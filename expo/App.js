import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, inboxPath } from './src/api';
import { PersonAvatar } from './src/contacts';
import {
  dailyClock,
  dayPhrase,
  messageSticker,
  scheduledColumns,
  syncOpenedAt,
  threadMessages,
} from './src/delivery';
import { FriendRequestView } from './src/FriendRequestView';
import { LoginView } from './src/LoginView';
import { OnboardingView } from './src/OnboardingView';
import { listenForDigest, prepareNotifications, runNotificationEffects } from './src/notify';
import { ink, paper, moon, web, side } from './src/chatTheme';
import { ComposerFooter } from './src/ComposerFooter';
import { ThreadMessage } from './src/ThreadMessage';
import { ContactStrip } from './src/ContactStrip';
import { AccountMenu, ScheduleSettings } from './src/ChatSettings';
import { hasConfusingCharacter, isCode, normalizeCode } from './src/people';
import { PlusView } from './src/PlusView';
import { readExpoPushToken } from './src/push';
import {
  loadDraft,
  loadOpenedAt,
  clearOutbox,
  loadOutbox,
  loadPickedContact,
  loadSession,
  outboxMedia,
  saveDraft,
  saveOpenedAt,
  saveOutbox,
  savePickedContact,
  saveSession,
} from './src/session';
import { createOutbox } from './src/outbox';
import { deleteFirebaseUser } from './src/accountAuth';
import { ContactActionsMenu } from './src/contactActions';
import { restoreAuthSubject } from './src/firebaseAuth';
import { finishSignIn } from './src/signIn';
import { pickCameraPhoto, pickLibraryPhoto } from './src/pickPhoto';
import { DrawModal } from './src/DrawModal';

function useKeyboardInset() {
  const [keyboard, setKeyboard] = useState(0);
  const { bottom: safeBottom } = useSafeAreaInsets();
  useEffect(() => {
    if (Platform.OS === 'web') {
      const update = () => {
        const viewport = window.visualViewport;
        setKeyboard(
          viewport
            ? Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop))
            : 0
        );
      };
      update();
      window.visualViewport?.addEventListener('resize', update);
      window.visualViewport?.addEventListener('scroll', update);
      return () => {
        window.visualViewport?.removeEventListener('resize', update);
        window.visualViewport?.removeEventListener('scroll', update);
      };
    }
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (event) => {
      setKeyboard(Math.max(0, Math.round(event?.endCoordinates?.height ?? 0)));
    });
    const hide = Keyboard.addListener(hideEvent, () => setKeyboard(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return Platform.OS === 'web' || !keyboard ? keyboard : Math.max(0, keyboard - safeBottom);
}

const MISSING = {
  apple_capability: 'Apple sign-in needs the Apple capability on this device.',
  apple_unavailable: 'Apple sign-in is not available in this browser.',
  google_unavailable: 'Google sign-in is not available in this browser.',
};

export default function App() {
  return (
    <SafeAreaProvider style={styles.provider}>
      <StatusBar style="dark" />
      <Root />
    </SafeAreaProvider>
  );
}

function Root() {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [inbox, setInbox] = useState(null);
  const [notice, setNotice] = useState('');
  const tokenRef = useRef(null);
  const writeGen = useRef(0);

  useEffect(() => {
    if (inbox?.user) setUser(inbox.user);
  }, [inbox?.user]);

  const deliverInbox = useCallback(async (current, next, { write = false } = {}) => {
    if (write) writeGen.current += 1;
    setInbox(next);
    if (next?.effects?.length) {
      await runNotificationEffects(next.effects);
      await api('/v1/effects/ack', { token: current, method: 'POST', body: {} });
    }
    return next;
  }, []);

  const refresh = useCallback(async () => {
    const current = tokenRef.current;
    if (!current) return null;
    const gen = writeGen.current;
    const next = await api(inboxPath(), { token: current });
    if (writeGen.current !== gen) return null;
    return deliverInbox(current, next);
  }, [deliverInbox]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await Promise.race([
          prepareNotifications(),
          new Promise((resolve) => setTimeout(resolve, 4000)),
        ]);
        let saved = await loadSession();
        if (!alive) return;
        if (saved) {
          tokenRef.current = saved;
          setToken(saved);
          try {
            await refresh();
          } catch (error) {
            if (error?.code === 'sign_in_required') {
              tokenRef.current = null;
              setToken(null);
              await saveSession(null);
              saved = null;
            }
          }
        }
        if (!saved && alive) {
          const restored = await restoreAuthSubject();
          if (restored?.subject && alive) {
            await finishSignIn(
              restored.provider,
              {
                user: restored.subject,
                firstName: restored.firstName || '',
                email: restored.email || '',
              },
              {
                request: api,
                saveSession,
                loadSession,
                refresh: async (session) => {
                  tokenRef.current = session.token;
                  setToken(session.token);
                  setUser(session.user);
                  await refresh();
                },
              }
            );
          }
        }
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [refresh]);

  useEffect(() => {
    if (!token) return undefined;
    const handle = setInterval(() => {
      refresh().catch(() => {});
    }, 4000);
    return () => clearInterval(handle);
  }, [refresh, token]);

  useEffect(() => {
    if (!token) return undefined;
    let alive = true;
    (async () => {
      const pushToken = await readExpoPushToken();
      if (!alive || !pushToken) return;
      await api('/v1/push-token', { token, method: 'POST', body: { token: pushToken } });
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  useEffect(() => {
    const subscription = listenForDigest(() => {
      const current = tokenRef.current;
      if (!current) return;
      api('/v1/shown', { token: current, method: 'POST', body: {} })
        .then((next) => deliverInbox(current, next, { write: true }))
        .catch(() => {});
    });
    return () => subscription.remove();
  }, [deliverInbox]);

  async function onSubject(result) {
    if (result.missing) {
      setNotice(MISSING[result.missing] || 'Sign-in is not available on this device.');
      return;
    }
    const outcome = await finishSignIn(
      result.provider,
      { user: result.subject, firstName: result.firstName || '', email: result.email || '' },
      {
        request: api,
        saveSession,
        loadSession,
        refresh: async (session) => {
          tokenRef.current = session.token;
          setToken(session.token);
          setUser(session.user);
          await refresh();
        },
      }
    );
    setNotice(outcome.notice);
    if (!outcome.token) {
      tokenRef.current = null;
      setToken(null);
      setUser(null);
    }
  }

  const onLookup = useCallback(async (raw) => {
    const code = normalizeCode(raw);
    if (!isCode(code) || code === user?.id) return { found: false };
    try {
      return await api(`/v1/person?code=${encodeURIComponent(code)}`, { token: tokenRef.current });
    } catch {
      return { found: false };
    }
  }, [user?.id]);

  async function onLogout() {
    await saveSession(null);
    await savePickedContact(null);
    await saveDraft('');
    await clearOutbox();
    tokenRef.current = null;
    setToken(null);
    setUser(null);
    setInbox(null);
  }

  async function onDeleteAccount() {
    const current = tokenRef.current;
    if (!current) return 'Could not delete account.';
    try {
      await api('/v1/account/delete', { token: current, method: 'POST', body: {} });
    } catch {
      return 'Could not delete account.';
    }
    const authResult = await deleteFirebaseUser();
    if (!authResult.ok) {
      if (authResult.code === 'recent_login') {
        return 'Sign in again, then delete account.';
      }
      return 'Account data was removed. Sign-in could not be cleared.';
    }
    await onLogout();
    return '';
  }

  async function onAdd(raw) {
    const code = normalizeCode(raw);
    if (hasConfusingCharacter(code)) return '1, I, and L are not used.';
    if (!isCode(code)) return 'Enter a 3-character ID.';
    if (code === user?.id) return 'That is your ID.';
    try {
      const next = await api('/v1/contacts', { token, method: 'POST', body: { code } });
      setInbox(next);
      return '';
    } catch (error) {
      if (error.code === 'code_invalid') return '1, I, and L are not used.';
      if (error.code === 'person_not_found') return 'No one has that ID.';
      return 'Could not add that ID.';
    }
  }

  async function saveNickname(nickname) {
    const next = await api('/v1/profile', { token, method: 'POST', body: { nickname } });
    if (next?.user) setUser(next.user);
    await refresh();
  }

  if (!ready) return <View style={styles.boot} />;

  const sessionUser = user ?? inbox?.user ?? null;

  let body = null;
  if (!token) {
    body = <LoginView onSubject={onSubject} notice={notice} />;
  } else if (sessionUser && sessionUser.onboarded === false) {
    body = (
      <OnboardingView
        userId={sessionUser.id}
        onSaveNickname={saveNickname}
        onContinue={refresh}
      />
    );
  } else {
    body = (
      <ChatScreen
        token={token}
        inbox={inbox}
        onInbox={(next) => deliverInbox(token, next, { write: true })}
        onAdd={onAdd}
        onLookup={onLookup}
        onLogout={onLogout}
        onDeleteAccount={onDeleteAccount}
      />
    );
  }

  return (
    <SafeAreaView style={styles.frame} edges={['top', 'bottom']}>
      {body}
    </SafeAreaView>
  );
}

function ChatScreen({
  token,
  inbox,
  onInbox,
  onAdd,
  onLookup,
  onLogout,
  onDeleteAccount,
}) {
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
    loadPickedContact().then((id) => {
      if (id) setPickedId(id);
    });
    loadDraft().then(setDraft);
    loadOpenedAt().then(setOpenedAt);
  }, []);

  useEffect(() => {
    if (hideChrome) {
      setScheduleOpen(false);
      setAccountOpen(false);
      setContactMenuId(null);
    }
    if (Platform.OS === 'web' || !keyboardInset) return undefined;
    const t = setTimeout(() => threadRef.current?.scrollToEnd({ animated: false }), 16);
    return () => clearTimeout(t);
  }, [keyboardInset, hideChrome]);

  const state = inbox?.state;
  const contacts = inbox?.contacts ?? [];
  const selectedContactId =
    normalizeCode(pickedId) || normalizeCode(contacts[0]?.id) || null;
  const openedLoaded = openedAt != null;

  useEffect(() => {
    threadRef.current?.scrollToEnd({ animated: false });
  }, [selectedContactId]);

  useEffect(() => {
    if (!openedLoaded) return;
    setOpenedAt((current) => {
      const next = syncOpenedAt(
        current || {},
        contacts,
        state?.messages,
        panel === 'chat' ? selectedContactId : null
      );
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
  const clock =
    pendingClock && (pendingClock.hour !== serverClock.hour || pendingClock.minute !== serverClock.minute)
      ? pendingClock
      : serverClock;
  const summaryTime = mode !== 'relaxed' ? dayPhrase(clock.hour, clock.minute, true).replace(/ /g, '') : '';
  const accountId = inbox?.user?.id ?? '';
  const now = new Date();
  const columns = scheduledColumns(now);
  const choices = columns.today.concat(columns.tomorrow);
  const selectedAt = choices.find((at) => at.getTime() === choiceAt) ?? choices[0];
  const canSend =
    contactActive && Boolean(contact) && (draft.trim().length > 0 || Boolean(photo) || Boolean(sticker));

  function onToggleFocus() {
    const next = focused ? 'relaxed' : 'batched';
    const request = focusRequest.current + 1;
    focusRequest.current = request;
    setPendingMode(next);
    mutate('/v1/mode', { mode: next }).finally(() => {
      if (focusRequest.current === request) setPendingMode(null);
    });
  }

  async function mutate(path, body) {
    return onInbox(
      await api(path, {
        token,
        method: 'POST',
        body: { ...body, offsetMinutes: new Date().getTimezoneOffset() },
      })
    );
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
        if (normalizeCode(pickedId) === normalizeCode(targetId)) {
          const nextId = normalizeCode(next?.contacts?.[0]?.id) || null;
          setPickedId(nextId);
          savePickedContact(nextId).catch(() => {});
        }
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
    return () => {
      alive = false;
      sub.remove();
    };
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
      if (next) {
        setSticker(null);
        setPhoto(next);
      }
    } finally {
      attachBusy.current = false;
    }
  }

  function onInputSize(event) {
    const measured = event.nativeEvent.contentSize.height;
    setInputHeight(Math.max(44, Math.min(Math.ceil(measured), 176)));
  }

  const composerProps = {
    intent,
    onIntent: setIntent,
    choiceAt,
    onChoice: setChoiceAt,
    columns,
    now,
    photo,
    onClearPhoto: () => setPhoto(null),
    sticker,
    onClearSticker: () => setSticker(null),
    onDraw: () => {
      Keyboard.dismiss();
      setDrawOpen(true);
    },
    draft,
    onChangeDraft: (value) => {
      setDraft(value);
      saveDraft(value).catch(() => {});
    },
    onInputSize,
    inputHeight,
    contactName: contact?.firstName || contact?.id || selectedContactId,
    selectedAt,
    canSend,
    onSend: () => send(),
    onAttach: () => attach('library'),
    onAttachCamera: () => attach('camera'),
  };

  return (
    <View style={styles.root}>
      <View style={[styles.phone, web && styles.webScreen, { paddingBottom: keyboardInset }]}>
        {scheduleOpen || accountOpen || contactMenuId ? (
          <Pressable
            testID="schedule-backdrop"
            accessibilityLabel="Close menu"
            onPress={() => {
              setScheduleOpen(false);
              setAccountOpen(false);
              setContactMenuId(null);
            }}
            style={styles.backdrop}
          />
        ) : null}
        <View testID="schedule-panel" style={[styles.top, hideChrome && styles.chromeGone]}>
          <View testID="top-bar" style={[styles.header, web && styles.webPad]}>
            <View style={styles.headerMain}>
              <Pressable
                testID="mode-toggle"
                accessibilityRole="button"
                accessibilityLabel="Focus"
                accessibilityState={{ selected: focused }}
                hitSlop={8}
                onPress={onToggleFocus}
                style={styles.focus}
              >
                <Ionicons name={focused ? 'moon' : 'moon-outline'} size={26} color={focused ? moon : ink} />
                {focused ? <Text style={styles.focusText}>Focus</Text> : null}
              </Pressable>
              <View style={styles.scheduleWrap}>
                {mode === 'relaxed' ? (
                  <Text testID="schedule-label" numberOfLines={1} style={styles.scheduleLine}>
                    notified by any message
                  </Text>
                ) : (
                  <View style={styles.schedulePhrase}>
                    <Text testID="schedule-label" numberOfLines={1} style={[styles.scheduleLine, styles.schedulePrefix]}>
                      receiving summary at{' '}
                    </Text>
                    <Pressable
                      testID="schedule-time"
                      accessibilityRole="button"
                      accessibilityLabel={`Change summary time, ${summaryTime}`}
                      accessibilityState={{ expanded: scheduleOpen }}
                      hitSlop={4}
                      onPress={() => {
                        setAccountOpen(false);
                        setScheduleOpen((current) => !current);
                      }}
                    >
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
            <Pressable
              testID="account-settings-button"
              accessibilityRole="button"
              accessibilityLabel="Account settings"
              accessibilityState={{ expanded: accountOpen }}
              hitSlop={6}
              onPress={() => {
                setScheduleOpen(false);
                setAccountOpen((current) => !current);
              }}
            >
              <PersonAvatar id={accountId} name={inbox?.user?.firstName} uri={inbox?.user?.avatar} size={32} />
            </Pressable>
            {accountOpen ? (
              <View testID="account-popover" style={styles.popover}>
                <AccountMenu
                  userId={accountId}
                  onLogout={async () => {
                    setAccountOpen(false);
                    await onLogout();
                  }}
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
          onLongPress={(id) => { setScheduleOpen(false); setAccountOpen(false); setContactMenuId(id); }}
          onToggleAdd={() => setPanel((current) => (current === 'add' ? 'chat' : 'add'))}
        />
        {contactMenuId && !hideChrome ? (
          <View testID="contact-actions-popover" style={styles.contactMenuPopover}>
            <ContactActionsMenu
              contactId={contactMenuId}
              onReport={() => reportContact(contactMenuId)}
              onBlock={() => confirmBlock(contactMenuId)}
              onClose={() => setContactMenuId(null)}
            />
          </View>
        ) : null}

        {panel === 'add' ? (
          <PlusView
            code={inbox?.user?.id}
            onLookup={onLookup}
            onAdd={async (code) => {
              const result = await onAdd(code);
              if (!result) setPanel('chat');
              return result;
            }}
          />
        ) : null}
        {panel === 'request' && contactPendingIn && contact ? (
          <FriendRequestView
            contact={contact}
            busy={requestBusy}
            onAccept={async () => {
              setRequestBusy(true);
              try {
                await mutate('/v1/friend-request/accept', { contactId: contact.id });
                setPanel('chat');
              } finally {
                setRequestBusy(false);
              }
            }}
            onDecline={async () => {
              setRequestBusy(true);
              try {
                const declinedId = contact.id;
                const next = await mutate('/v1/friend-request/decline', { contactId: declinedId });
                if (normalizeCode(pickedId) === normalizeCode(declinedId)) {
                  const nextId = normalizeCode(next?.contacts?.[0]?.id) || null;
                  setPickedId(nextId);
                  savePickedContact(nextId).catch(() => {});
                }
                setPanel('chat');
              } finally {
                setRequestBusy(false);
              }
            }}
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
            onContentSizeChange={() => {
              threadRef.current?.scrollToEnd({ animated: false });
            }}
          >
            {messages.map((message) => (
              <ThreadMessage
                key={message.id}
                message={message}
                onRetry={message.failed ? () => outbox.retry(message.id) : undefined}
                onOpenPhoto={(uri) => {
                  Keyboard.dismiss();
                  setScheduleOpen(false);
                  setAccountOpen(false);
                  setContactMenuId(null);
                  setPhotoViewerUri(uri);
                }}
                onReportIncoming={(messageId) => {
                  if (!contact?.id) return;
                  reportContact(contact.id, messageId);
                }}
                onBlockIncoming={() => {
                  if (!contact?.id) return;
                  confirmBlock(contact.id);
                }}
              />
            ))}
          </ScrollView>
        </View>

        {contactActive ? (
          <View style={styles.footer}>
            {contact ? (
              <View style={styles.notifyRow}>
                <Text style={styles.menuText}>Get all notifications</Text>
                <Switch testID={`notify-all-${contact.id}`} accessibilityLabel="Get all notifications" value={pendingNotify?.id === contact.id ? pendingNotify.on : !!contact.notifyAll} onValueChange={(on) => { setPendingNotify({ id: contact.id, on }); mutate('/v1/notify-all', { contactId: contact.id, on }).catch(() => {}).finally(() => setPendingNotify(null)); }} trackColor={{ false: '#d1d1d6', true: '#34c759' }} />
              </View>
            ) : null}
            <ComposerFooter testID="composer" {...composerProps} />
          </View>
        ) : null}
        </>
        )}
        </View>
        ) : null}
        <DrawModal
          visible={drawOpen}
          onCancel={() => setDrawOpen(false)}
          onDone={(dataUri) => {
            setDrawOpen(false);
            adoptSticker(dataUri);
          }}
        />
        <Modal
          visible={Boolean(photoViewerUri)}
          transparent
          animationType="fade"
          onRequestClose={() => setPhotoViewerUri(null)}
        >
          <Pressable
            testID="photo-viewer"
            accessibilityRole="button"
            accessibilityLabel="Close photo"
            onPress={() => setPhotoViewerUri(null)}
            style={styles.photoViewer}
          >
            {photoViewerUri ? (
              <Image
                testID="photo-viewer-image"
                source={{ uri: photoViewerUri }}
                resizeMode="contain"
                style={styles.photoViewerImage}
                pointerEvents="none"
              />
            ) : null}
            <Pressable
              testID="photo-viewer-close"
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={() => setPhotoViewerUri(null)}
              style={[styles.photoViewerClose, { top: insets.top + 8 }]}
              hitSlop={8}
            >
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
  boot: { flex: 1, backgroundColor: paper },
  provider: { flex: 1, backgroundColor: paper },
  frame: { flex: 1, backgroundColor: paper },
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
  menuRow: { paddingVertical: 13, paddingHorizontal: 18, borderTopWidth: 1, borderTopColor: ink },
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
