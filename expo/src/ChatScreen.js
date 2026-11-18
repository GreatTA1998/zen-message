import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, AppState, Image, Keyboard, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from './api';
import { PersonAvatar } from './contacts';
import { dailyClock, dayPhrase, messageSticker, scheduledColumns, syncOpenedAt, threadMessages } from './delivery';
import { FriendRequestView } from './FriendRequestView';
import { ink, paper, moon, web, side } from './chatTheme';
import { ComposerFooter } from './ComposerFooter';
import { ThreadMessage } from './ThreadMessage';
import { ContactStrip } from './ContactStrip';
import { AccountMenu, ScheduleSettings } from './ChatSettings';
import { normalizeCode } from './people';
import { PlusView } from './PlusView';
import { loadDraft, loadOpenedAt, loadOutbox, loadPickedContact, outboxMedia, saveDraft, saveOpenedAt, saveOutbox, savePickedContact } from './session';
import { createOutbox } from './outbox';
import { ContactActionsMenu } from './contactActions';
import { pickCameraPhoto, pickLibraryPhoto } from './pickPhoto';
import { DrawModal } from './DrawModal';
import { useKeyboardInset } from './useKeyboardInset';

export function ChatScreen({ token, inbox, onInbox, onAdd, onLookup, onLogout, onDeleteAccount }) {
  const [draft, setDraft] = useState('');
  const [photo, setPhoto] = useState(null);
  const [sticker, setSticker] = useState(null);
  const [drawOpen, setDrawOpen] = useState(false);
  const [inputHeight, setInputHeight] = useState(44);
  const [intent, setIntent] = useState('anytime');
  const [choiceAt, setChoiceAt] = useState(null);
  const [panel, setPanel] = useState('chat');
  const [requestBusy, setRequestBusy] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);
  const [pendingNotify, setPendingNotify] = useState(null);
  const [pendingClock, setPendingClock] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [contactMenuId, setContactMenuId] = useState(null);
  const [photoViewerUri, setPhotoViewerUri] = useState(null);
  const [pendingOutbound, setPendingOutbound] = useState([]);
  const [pickedId, setPickedId] = useState(null);
  const [openedAt, setOpenedAt] = useState(null);
  const focusRequest = useRef(0);
  const attachBusy = useRef(false);
  const outboxRef = useRef(null);
  const mutateRef = useRef(null);
  const threadRef = useRef(null);
  const keyboardInset = useKeyboardInset();
  const hideChrome = Platform.OS !== 'web' && keyboardInset > 0 && panel === 'chat';
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadPickedContact().then((id) => { if (id) setPickedId(id); });
    loadDraft().then(setDraft);
    loadOpenedAt().then(setOpenedAt);
  }, []);

  useEffect(() => {
    if (hideChrome) closeMenus();
    if (Platform.OS === 'web' || !keyboardInset) return undefined;
    const t = setTimeout(() => threadRef.current?.scrollToEnd({ animated: false }), 16);
    return () => clearTimeout(t);
  }, [keyboardInset, hideChrome]);

  const state = inbox?.state;
  const contacts = inbox?.contacts ?? [];
  const selectedContactId = normalizeCode(pickedId) || normalizeCode(contacts[0]?.id) || null;
  const openedLoaded = openedAt != null;
  useEffect(() => { threadRef.current?.scrollToEnd({ animated: false }); }, [selectedContactId]);
  useEffect(() => {
    if (!openedLoaded) return;
    setOpenedAt((current) => {
      const next = syncOpenedAt(current || {}, contacts, state?.messages, panel === 'chat' ? selectedContactId : null);
      if (next !== current) saveOpenedAt(next).catch(() => {});
      return next;
    });
  }, [openedLoaded, contacts, state?.messages, selectedContactId, panel]);

  const contact = contacts.find((item) => normalizeCode(item.id) === selectedContactId) ?? null;
  const contactActive = contact?.status === 'active' || !contact?.status;
  const contactPendingIn = contact?.status === 'pending-in';
  const contactPendingOut = contact?.status === 'pending-out';
  const messages = useMemo(() => {
    if (!selectedContactId || !contact || !contactActive) return [];
    const base = threadMessages(state?.messages, selectedContactId);
    const seen = new Set(base.map((item) => item.id));
    const pending = pendingOutbound
      .filter((item) => normalizeCode(item.contactId) === selectedContactId && !seen.has(item.id))
      .map((item) => ({ ...item, _out: true }));
    return pending.length ? [...base, ...pending] : base;
  }, [selectedContactId, contact, state?.messages, contactActive, pendingOutbound]);
  const mode = pendingMode ?? state?.mode ?? 'batched';
  const focused = mode !== 'relaxed';
  const serverClock = dailyClock(state);
  const clock = pendingClock && (pendingClock.hour !== serverClock.hour || pendingClock.minute !== serverClock.minute) ? pendingClock : serverClock;
  const summaryTime = focused ? dayPhrase(clock.hour, clock.minute, true).replace(/ /g, '') : '';
  const accountId = inbox?.user?.id ?? '';
  const now = new Date();
  const columns = scheduledColumns(now);
  const choices = columns.today.concat(columns.tomorrow);
  const selectedAt = choices.find((at) => at.getTime() === choiceAt) ?? choices[0];
  const canSend = contactActive && Boolean(contact) && (draft.trim().length > 0 || Boolean(photo) || Boolean(sticker));

  function onToggleFocus() {
    const next = focused ? 'relaxed' : 'batched';
    const request = focusRequest.current + 1;
    focusRequest.current = request;
    setPendingMode(next);
    mutate('/v1/mode', { mode: next }).finally(() => { if (focusRequest.current === request) setPendingMode(null); });
  }

  async function mutate(path, body) {
    return onInbox(await api(path, { token, method: 'POST', body: { ...body, offsetMinutes: new Date().getTimezoneOffset() } }));
  }

  function pickContact(item) {
    const id = normalizeCode(item.id);
    if (!id) return;
    setPickedId(id);
    savePickedContact(id).catch(() => {});
    setPanel(item.status === 'pending-in' ? 'request' : 'chat');
    api('/v1/open', { token, method: 'POST', body: { contactId: id } }).catch(() => {});
  }

  function flashNotice(text) {
    setNotice(text);
    setTimeout(() => setNotice(''), 2800);
  }

  function closeMenus() {
    setScheduleOpen(false);
    setAccountOpen(false);
    setContactMenuId(null);
  }

  function syncPickedAfterRemoval(targetId, nextInbox) {
    if (normalizeCode(pickedId) !== normalizeCode(targetId)) return;
    const nextId = normalizeCode(nextInbox?.contacts?.[0]?.id) || null;
    setPickedId(nextId);
    savePickedContact(nextId).catch(() => {});
  }

  async function withRequestBusy(fn) {
    setRequestBusy(true);
    try { await fn(); } finally { setRequestBusy(false); }
  }

  async function reportContact(targetId, messageId) {
    try {
      await api('/v1/report', { token, method: 'POST', body: { contactId: targetId, messageId } });
      flashNotice('Report received.');
    } catch {
      flashNotice('Could not send report.');
    }
  }

  function confirmBlock(targetId) {
    const run = async () => {
      try {
        const next = await api('/v1/block', { token, method: 'POST', body: { contactId: targetId } });
        onInbox(next);
        syncPickedAfterRemoval(targetId, next);
        setPanel('chat');
        flashNotice('Contact blocked.');
      } catch {
        flashNotice('Could not block contact.');
      }
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Block this contact? You will not receive messages from them.')) run();
      return;
    }
    Alert.alert('Block contact', 'You will not receive messages from them.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Block', style: 'destructive', onPress: run },
    ]);
  }

  function adoptSticker(dataUri) {
    const next = messageSticker(dataUri);
    if (!next) return;
    setPhoto(null);
    setSticker(next);
  }

  if (!outboxRef.current) {
    outboxRef.current = createOutbox({
      load: loadOutbox,
      save: saveOutbox,
      media: outboxMedia,
      onChange: setPendingOutbound,
      send: (item) =>
        mutateRef.current('/v1/messages', {
          clientId: item.id,
          contactId: item.contactId,
          body: item.body,
          photo: item.photo,
          sticker: item.sticker,
          intent: item.intent,
          releaseAt: item.releaseAt || undefined,
        }),
    });
  }
  const outbox = outboxRef.current;
  mutateRef.current = mutate;

  useEffect(() => {
    let alive = true;
    outbox.hydrate().catch(() => {});
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active' || !alive) return;
      outbox.resume();
    });
    return () => { alive = false; sub.remove(); };
  }, [token, outbox]);

  async function send(text = draft) {
    const body = text.trim();
    if ((!body && !photo && !sticker) || !contact) return;
    const item = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      contactId: contact.id,
      contactName: contact.firstName || contact.id,
      body,
      photo: sticker ? null : photo,
      sticker,
      intent,
      createdAt: Date.now(),
      visible: true,
      releaseAt: intent === 'scheduled' ? selectedAt?.getTime() : null,
      direction: 'out',
    };
    try {
      await outbox.enqueue(item);
    } catch {
      flashNotice('Could not save message. Try again.');
      return;
    }
    setDraft('');
    saveDraft('').catch(() => {});
    setPhoto(null);
    setSticker(null);
    setInputHeight(44);
  }

  async function attach(source) {
    if (attachBusy.current) return;
    attachBusy.current = true;
    try {
      const next = source === 'camera' ? await pickCameraPhoto() : await pickLibraryPhoto();
      if (next) { setSticker(null); setPhoto(next); }
    } finally {
      attachBusy.current = false;
    }
  }

  const onInputSize = (event) => setInputHeight(Math.max(44, Math.min(Math.ceil(event.nativeEvent.contentSize.height), 176)));
  const toggleSchedule = () => { setAccountOpen(false); setScheduleOpen((v) => !v); };
  const toggleAccount = () => { setScheduleOpen(false); setAccountOpen((v) => !v); };
  const openPhoto = (uri) => { Keyboard.dismiss(); closeMenus(); setPhotoViewerUri(uri); };
  const notifyOn = pendingNotify?.id === contact?.id ? pendingNotify.on : !!contact?.notifyAll;
  const onNotifyAll = (on) => {
    if (!contact) return;
    setPendingNotify({ id: contact.id, on });
    mutate('/v1/notify-all', { contactId: contact.id, on }).catch(() => {}).finally(() => setPendingNotify(null));
  };

  const composerProps = {
    intent, onIntent: setIntent, choiceAt, onChoice: setChoiceAt, columns, now, photo,
    onClearPhoto: () => setPhoto(null), sticker, onClearSticker: () => setSticker(null),
    onDraw: () => { Keyboard.dismiss(); setDrawOpen(true); },
    draft, onChangeDraft: (value) => { setDraft(value); saveDraft(value).catch(() => {}); },
    onInputSize, inputHeight, contactName: contact?.firstName || contact?.id || selectedContactId,
    selectedAt, canSend, onSend: () => send(), onAttach: () => attach('library'), onAttachCamera: () => attach('camera'),
  };

  const menuOpen = scheduleOpen || accountOpen || contactMenuId;

  return (
    <View style={styles.root}>
      <View style={[styles.phone, web && styles.webScreen, { paddingBottom: keyboardInset }]}>
        {menuOpen ? <Pressable testID="schedule-backdrop" accessibilityLabel="Close menu" onPress={closeMenus} style={styles.backdrop} /> : null}
        <View testID="schedule-panel" style={[styles.top, hideChrome && styles.chromeGone]}>
          <View testID="top-bar" style={[styles.header, web && styles.webPad]}>
            <View style={styles.headerMain}>
              <Pressable testID="mode-toggle" accessibilityRole="button" accessibilityLabel="Focus" accessibilityState={{ selected: focused }} hitSlop={8} onPress={onToggleFocus} style={styles.focus}>
                <Ionicons name={focused ? 'moon' : 'moon-outline'} size={26} color={focused ? moon : ink} />
                {focused ? <Text style={styles.focusText}>Focus</Text> : null}
              </Pressable>
              <View style={styles.scheduleWrap}>
                {mode === 'relaxed' ? (
                  <Text testID="schedule-label" numberOfLines={1} style={styles.scheduleLine}>notified by any message</Text>
                ) : (
                  <View style={styles.schedulePhrase}>
                    <Text testID="schedule-label" numberOfLines={1} style={[styles.scheduleLine, styles.schedulePrefix]}>receiving summary at{' '}</Text>
                    <Pressable testID="schedule-time" accessibilityRole="button" accessibilityLabel={`Change summary time, ${summaryTime}`} accessibilityState={{ expanded: scheduleOpen }} hitSlop={4} onPress={toggleSchedule}>
                      <Text style={[styles.scheduleLine, styles.scheduleTime]}>{summaryTime}</Text>
                    </Pressable>
                  </View>
                )}
                {scheduleOpen ? (
                  <View testID="schedule-popover" style={styles.popover}>
                    <ScheduleSettings
                      hour={clock.hour}
                      minute={clock.minute}
                      onChoose={(dayHour, dayMinute) => {
                        setScheduleOpen(false);
                        setPendingClock({ hour: dayHour, minute: dayMinute });
                        mutate('/v1/schedule', { dayHour, dayMinute }).catch(() => setPendingClock(null));
                      }}
                    />
                  </View>
                ) : null}
              </View>
            </View>
            <Pressable testID="account-settings-button" accessibilityRole="button" accessibilityLabel="Account settings" accessibilityState={{ expanded: accountOpen }} hitSlop={6} onPress={toggleAccount}>
              <PersonAvatar id={accountId} name={inbox?.user?.firstName} uri={inbox?.user?.avatar} size={32} />
            </Pressable>
            {accountOpen ? (
              <View testID="account-popover" style={styles.popover}>
                <AccountMenu
                  userId={accountId}
                  onLogout={async () => { setAccountOpen(false); await onLogout(); }}
                  onDeleteAccount={async () => {
                    setAccountOpen(false);
                    const message = await onDeleteAccount();
                    if (message) flashNotice(message);
                  }}
                />
              </View>
            ) : null}
          </View>
        </View>

        <ContactStrip
          contacts={contacts}
          selectedContactId={selectedContactId}
          panel={panel}
          mode={mode}
          pendingNotify={pendingNotify}
          openedAt={openedAt}
          messages={state?.messages}
          hideChrome={hideChrome}
          onPick={pickContact}
          onLongPress={(id) => { closeMenus(); setContactMenuId(id); }}
          onToggleAdd={() => setPanel((current) => (current === 'add' ? 'chat' : 'add'))}
        />
        {contactMenuId && !hideChrome ? (
          <View testID="contact-actions-popover" style={styles.contactMenuPopover}>
            <ContactActionsMenu contactId={contactMenuId} onReport={() => reportContact(contactMenuId)} onBlock={() => confirmBlock(contactMenuId)} onClose={() => setContactMenuId(null)} />
          </View>
        ) : null}

        {panel === 'add' ? (
          <PlusView code={inbox?.user?.id} onLookup={onLookup} onAdd={async (code) => { const result = await onAdd(code); if (!result) setPanel('chat'); return result; }} />
        ) : null}
        {panel === 'request' && contactPendingIn && contact ? (
          <FriendRequestView
            contact={contact}
            busy={requestBusy}
            onAccept={() => withRequestBusy(async () => { await mutate('/v1/friend-request/accept', { contactId: contact.id }); setPanel('chat'); })}
            onDecline={() => withRequestBusy(async () => {
              const declinedId = contact.id;
              const next = await mutate('/v1/friend-request/decline', { contactId: declinedId });
              syncPickedAfterRemoval(declinedId, next);
              setPanel('chat');
            })}
          />
        ) : null}
        {panel === 'chat' ? (
          <View style={[styles.main, web && styles.webFill]}>
            {contactPendingOut ? (
              <View style={styles.pendingMain}>
                <Text style={styles.pendingText}>Waiting for {contact.firstName || contact.id} to accept.</Text>
              </View>
            ) : (
              <>
                <View style={[styles.thread, web && styles.webFill]}>
                  <ScrollView
                    ref={threadRef}
                    style={styles.thread}
                    contentContainerStyle={[styles.threadContent, web && styles.webThread]}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets={false}
                    contentInsetAdjustmentBehavior="never"
                    onContentSizeChange={() => threadRef.current?.scrollToEnd({ animated: false })}
                  >
                    {messages.map((message) => (
                      <ThreadMessage
                        key={message.id}
                        message={message}
                        onRetry={message.failed ? () => outbox.retry(message.id) : undefined}
                        onOpenPhoto={openPhoto}
                        onReportIncoming={(messageId) => { if (contact?.id) reportContact(contact.id, messageId); }}
                        onBlockIncoming={() => { if (contact?.id) confirmBlock(contact.id); }}
                      />
                    ))}
                  </ScrollView>
                </View>
                {contactActive ? (
                  <View style={styles.footer}>
                    {contact ? (
                      <View style={styles.notifyRow}>
                        <Text style={styles.menuText}>Get all notifications</Text>
                        <Switch testID={`notify-all-${contact.id}`} accessibilityLabel="Get all notifications" value={notifyOn} onValueChange={onNotifyAll} trackColor={{ false: '#d1d1d6', true: '#34c759' }} />
                      </View>
                    ) : null}
                    <ComposerFooter testID="composer" {...composerProps} />
                  </View>
                ) : null}
              </>
            )}
          </View>
        ) : null}
        <DrawModal visible={drawOpen} onCancel={() => setDrawOpen(false)} onDone={(dataUri) => { setDrawOpen(false); adoptSticker(dataUri); }} />
        <Modal visible={Boolean(photoViewerUri)} transparent animationType="fade" onRequestClose={() => setPhotoViewerUri(null)}>
          <Pressable testID="photo-viewer" accessibilityRole="button" accessibilityLabel="Close photo" onPress={() => setPhotoViewerUri(null)} style={styles.photoViewer}>
            {photoViewerUri ? <Image testID="photo-viewer-image" source={{ uri: photoViewerUri }} resizeMode="contain" style={styles.photoViewerImage} pointerEvents="none" /> : null}
            <Pressable testID="photo-viewer-close" accessibilityRole="button" accessibilityLabel="Close" onPress={() => setPhotoViewerUri(null)} style={[styles.photoViewerClose, { top: insets.top + 8 }]} hitSlop={8}>
              <Feather name="x" size={28} color={paper} />
            </Pressable>
          </Pressable>
        </Modal>
        {notice ? (
          <View testID="chat-notice" style={styles.chatNotice} pointerEvents="none">
            <Text style={styles.chatNoticeText}>{notice}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper, alignItems: 'center' },
  phone: { flex: 1, width: '100%', maxWidth: 480, backgroundColor: paper },
  webScreen: { alignSelf: 'stretch', maxWidth: '100%', minHeight: 0 },
  webPad: { paddingLeft: side, paddingRight: side },
  webThread: { paddingHorizontal: side },
  webFill: { minHeight: 0 },
  top: { zIndex: 4, backgroundColor: paper },
  chromeGone: { display: 'none' },
  header: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: ink, paddingLeft: 14, paddingRight: 16, paddingVertical: 8, gap: 8, position: 'relative' },
  headerMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 },
  focus: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4, paddingVertical: 6, borderRadius: 16, flexShrink: 0 },
  focusText: { color: ink, fontSize: 16, lineHeight: 20, fontWeight: '600' },
  scheduleWrap: { flex: 1, position: 'relative', zIndex: 2, minWidth: 0 },
  schedulePhrase: { flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0 },
  popover: { position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 200, backgroundColor: paper, borderWidth: 1, borderColor: ink, zIndex: 6 },
  scheduleLine: { color: ink, fontSize: 16, lineHeight: 20 },
  schedulePrefix: { flexShrink: 1 },
  scheduleTime: { flexShrink: 0, textDecorationLine: 'underline' },
  contactMenuPopover: { position: 'absolute', top: 124, left: side, zIndex: 6 },
  chatNotice: { position: 'absolute', left: side, right: side, bottom: 18, alignItems: 'center', zIndex: 12 },
  chatNoticeText: { color: ink, backgroundColor: paper, borderWidth: 1, borderColor: ink, paddingHorizontal: 14, paddingVertical: 8, fontSize: 14, lineHeight: 18 },
  photoViewer: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  photoViewerImage: { width: '100%', height: '100%' },
  photoViewerClose: { position: 'absolute', left: 12, padding: 10 },
  menuText: { color: ink, fontSize: 16, lineHeight: 21 },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 3 },
  pendingMain: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  pendingText: { color: ink, fontSize: 17, lineHeight: 22, textAlign: 'center' },
  main: { flex: 1, backgroundColor: paper },
  thread: { flex: 1 },
  threadContent: { paddingHorizontal: 16, paddingTop: 22, paddingBottom: 16, gap: 14 },
  footer: { backgroundColor: paper },
  notifyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 8 },
});