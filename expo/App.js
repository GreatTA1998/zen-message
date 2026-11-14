import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { api, inboxPath } from './src/api';
import { PERSON_AVATAR } from './src/contacts';
import {
  DAY_HOURS,
  INTENTS,
  dailyClock,
  dayPhrase,
  nextDaily,
  receiptPhrase,
  messageSticker,
  scheduledChoices,
  threadMessages,
} from './src/delivery';
import { FriendRequestView } from './src/FriendRequestView';
import { LoginView } from './src/LoginView';
import { OnboardingView } from './src/OnboardingView';
import { listenForDigest, prepareNotifications } from './src/notify';
import { messageBubbleParts } from './src/messageBubble';
import { hasConfusingCharacter, isCode, normalizeCode } from './src/people';
import { PlusView } from './src/PlusView';
import { readExpoPushToken } from './src/push';
import { loadSession, saveSession } from './src/session';
import { deleteFirebaseUser } from './src/accountAuth';
import { ContactActionsMenu } from './src/contactActions';
import { finishSignIn } from './src/signIn';
import { photoFromPickerAsset, pickLibraryPhoto } from './src/pickPhoto';
import { loadStickerLibrary, rememberSticker } from './src/stickerLibrary';
import { StickerDrawModal } from './src/StickerDraw';

const ink = '#1c1c1c';
const paper = '#fff';
const moon = '#5E5CE6';
const web = Platform.OS === 'web';
const side = 32;
const photoMaxWidth = web ? 320 : 280;

function summaryAt(hour, minute = 0) {
  const suffix = hour >= 12 ? 'pm' : 'am';
  const shown = hour % 12 || 12;
  if (!minute) return `${shown}${suffix}`;
  return `${shown}:${String(minute).padStart(2, '0')}${suffix}`;
}

function scheduleLabel(mode, state) {
  if (mode === 'relaxed') return 'open to all messages';
  const clock = dailyClock(state);
  return `receiving summary at ${summaryAt(clock.hour, clock.minute)}`;
}

function scheduleSummaryTime(state) {
  const clock = dailyClock(state);
  return summaryAt(clock.hour, clock.minute);
}

function webKeyboardOverlap() {
  const viewport = window.visualViewport;
  if (!viewport) return 0;
  return Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop));
}

function useConversation(hostRef) {
  const [open, setOpen] = useState(false);
  const [inset, setInset] = useState(0);
  const openRef = useRef(false);
  const insetRef = useRef(0);
  const focusCount = useRef(0);
  const handoff = useRef(false);
  const blurTimer = useRef(null);
  const restingBottom = useRef(0);
  const pendingShow = useRef(null);

  const rememberBottom = useCallback(() => {
    if (insetRef.current > 0) return;
    hostRef.current?.measureInWindow((_x, y, _width, height) => {
      if (height) restingBottom.current = y + height;
    });
  }, [hostRef]);

  const overlapFrom = useCallback((event) => {
    const screenY = event?.endCoordinates?.screenY;
    if (typeof screenY !== 'number') return 0;
    const bottom = restingBottom.current;
    if (!bottom) return Math.max(0, Math.round(event.endCoordinates?.height ?? 0));
    return Math.max(0, Math.round(bottom - screenY));
  }, []);

  const commit = useCallback((show, nextInset) => {
    const insetValue = show ? nextInset : 0;
    if (openRef.current === show && insetRef.current === insetValue) return;
    openRef.current = show;
    insetRef.current = insetValue;
    setOpen(show);
    setInset(insetValue);
  }, []);

  const presentWithKeyboard = useCallback((event) => {
    if (openRef.current) {
      handoff.current = false;
      return;
    }
    handoff.current = true;
    const nextInset = event ? overlapFrom(event) : Platform.OS === 'web' ? webKeyboardOverlap() : 0;
    commit(true, nextInset);
  }, [commit, overlapFrom]);

  const dismissWithKeyboard = useCallback(() => {
    handoff.current = false;
    commit(false, 0);
  }, [commit]);

  const onComposerFocus = useCallback(() => {
    focusCount.current += 1;
    if (blurTimer.current) {
      clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
    if (Platform.OS === 'web') return;
    if (Platform.OS === 'ios') {
      if (openRef.current) {
        handoff.current = false;
        return;
      }
      const event = pendingShow.current;
      if (!event) return;
      pendingShow.current = null;
      presentWithKeyboard(event);
      return;
    }
    presentWithKeyboard(null);
  }, [presentWithKeyboard]);

  const onComposerBlur = useCallback(() => {
    focusCount.current = Math.max(0, focusCount.current - 1);
    if (focusCount.current > 0) return;
    if (Platform.OS === 'ios') {
      if (handoff.current) return;
      if (typeof Keyboard.isVisible === 'function' && Keyboard.isVisible()) return;
      commit(false, 0);
      return;
    }
    if (blurTimer.current) clearTimeout(blurTimer.current);
    blurTimer.current = setTimeout(() => {
      blurTimer.current = null;
      if (focusCount.current > 0) return;
      commit(false, 0);
    }, 120);
  }, [commit]);

  useEffect(() => {
    return () => {
      if (blurTimer.current) clearTimeout(blurTimer.current);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') return undefined;

    function onShow(event) {
      pendingShow.current = event;
      if (focusCount.current === 0) return;
      pendingShow.current = null;
      presentWithKeyboard(event);
    }

    function onHide(event) {
      pendingShow.current = null;
      if (handoff.current || !openRef.current) return;
      dismissWithKeyboard(event);
    }

    const subs = [
      Keyboard.addListener('keyboardWillShow', onShow),
      Keyboard.addListener('keyboardWillHide', onHide),
    ];
    return () => subs.forEach((sub) => sub.remove());
  }, [commit, dismissWithKeyboard, presentWithKeyboard]);

  return {
    open,
    inset,
    rememberBottom,
    onComposerFocus,
    onComposerBlur,
  };
}

const MISSING = {
  apple_capability: 'Apple sign-in needs the Apple capability on this device.',
  apple_unavailable: 'Apple sign-in is not available in this browser.',
  google_unavailable: 'Google sign-in is not available in this browser.',
  phone_unavailable: 'Phone sign-in is not available on this device.',
  phone_invalid: 'That phone number could not be used.',
  phone_code_invalid: 'That code did not work.',
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

  const applyInbox = useCallback((next) => {
    setInbox(next);
    if (next?.user) setUser(next.user);
  }, []);

  const refresh = useCallback(async () => {
    const current = tokenRef.current;
    if (!current) return null;
    const next = await api(inboxPath(), { token: current });
    applyInbox(next);
    if (next.effects?.length) {
      await api('/v1/effects/ack', { token: current, method: 'POST', body: {} });
    }
    return next;
  }, [applyInbox]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await Promise.race([
          prepareNotifications(),
          new Promise((resolve) => setTimeout(resolve, 4000)),
        ]);
        const saved = await loadSession();
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
            }
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
        .then(applyInbox)
        .catch(() => {});
    });
    return () => subscription.remove();
  }, [applyInbox]);

  async function onSubject(result) {
    if (result.missing) {
      setNotice(MISSING[result.missing] || 'Sign-in is not available on this device.');
      return;
    }
    const outcome = await finishSignIn(
      result.provider,
      { user: result.subject, firstName: result.firstName || '' },
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
      applyInbox(next);
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

  let body = null;
  if (!token) {
    body = <LoginView onSubject={onSubject} notice={notice} />;
  } else if (user && user.onboarded === false) {
    body = (
      <OnboardingView
        userId={user.id}
        onSaveNickname={saveNickname}
        onContinue={refresh}
      />
    );
  } else {
    body = (
      <ChatScreen
        token={token}
        inbox={inbox}
        onInbox={applyInbox}
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

function ChatScreen({ token, inbox, onInbox, onAdd, onLookup, onLogout, onDeleteAccount }) {
  const [draft, setDraft] = useState('');
  const [photo, setPhoto] = useState(null);
  const [sticker, setSticker] = useState(null);
  const [stickerTrayOpen, setStickerTrayOpen] = useState(false);
  const [stickerLibrary, setStickerLibrary] = useState([]);
  const [drawStickerOpen, setDrawStickerOpen] = useState(false);
  const [inputHeight, setInputHeight] = useState(44);
  const [intent, setIntent] = useState('anytime');
  const [choice, setChoice] = useState(0);
  const [customHour, setCustomHour] = useState(15);
  const [panel, setPanel] = useState('chat');
  const [requestBusy, setRequestBusy] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [contactMenuId, setContactMenuId] = useState(null);
  const [photoViewerUri, setPhotoViewerUri] = useState(null);
  const [pendingOutbound, setPendingOutbound] = useState([]);
  const focusRequest = useRef(0);
  const attachBusy = useRef(false);
  const threadRef = useRef(null);
  const phoneRef = useRef(null);
  const { open, inset, rememberBottom, onComposerFocus, onComposerBlur } = useConversation(phoneRef);
  const state = inbox?.state;
  const contacts = inbox?.contacts ?? [];
  const contact = contacts.find((item) => item.id === state?.contactId) ?? null;
  const contactActive = contact?.status === 'active' || !contact?.status;
  const contactPendingIn = contact?.status === 'pending-in';
  const contactPendingOut = contact?.status === 'pending-out';
  const messages = useMemo(() => {
    if (!contact || !state || !contactActive) return [];
    const base = threadMessages(state.messages, contact.id);
    const pending = pendingOutbound.filter((item) => item.contactId === contact.id);
    return pending.length ? [...base, ...pending] : base;
  }, [contact, state, contactActive, pendingOutbound]);
  const mode = pendingMode ?? state?.mode ?? 'batched';
  const focused = mode !== 'relaxed';
  const label = scheduleLabel(mode, state);
  const summaryTime = mode !== 'relaxed' ? scheduleSummaryTime(state) : '';
  const accountId = inbox?.user?.id ?? '';
  const now = new Date();
  const choices = scheduledChoices(now);
  const selectedAt = choice === 'custom' ? nextDaily(now, customHour, 0) : choices[choice] ?? choices[0];
  const canSend =
    contactActive && Boolean(contact) && (draft.trim().length > 0 || Boolean(photo) || Boolean(sticker));

  useEffect(() => {
    loadStickerLibrary().then(setStickerLibrary).catch(() => {});
  }, [token]);

  function onToggleFocus() {
    const next = focused ? 'relaxed' : 'batched';
    const request = focusRequest.current + 1;
    focusRequest.current = request;
    setPendingMode(next);
    mutate('/v1/mode', { mode: next }).finally(() => {
      if (focusRequest.current === request) setPendingMode(null);
    });
  }

  useEffect(() => {
    if (open) {
      setScheduleOpen(false);
      setAccountOpen(false);
      setStickerTrayOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) return;
    threadRef.current?.scrollToEnd({ animated: false });
  }, [messages.length, open]);

  async function mutate(path, body) {
    const next = await api(path, { token, method: 'POST', body });
    onInbox(next);
    if (next.effects?.length) {
      await api('/v1/effects/ack', { token, method: 'POST', body: {} });
    }
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

  async function adoptSticker(dataUri, remember = true) {
    const next = messageSticker(dataUri);
    if (!next) return;
    setPhoto(null);
    setSticker(next);
    setStickerTrayOpen(false);
    if (remember) {
      const library = await rememberSticker(next);
      setStickerLibrary(library);
    }
  }

  function send(text = draft) {
    const body = text.trim();
    if ((!body && !photo && !sticker) || !contact) return;
    const attachedSticker = sticker;
    const attached = attachedSticker ? null : photo;
    const sentIntent = intent;
    const sentContact = contact;
    const sentAt = selectedAt?.getTime();
    const createdAt = Date.now();
    const pendingId = `local-${createdAt}-${Math.random().toString(36).slice(2, 8)}`;
    setDraft('');
    setPhoto(null);
    setSticker(null);
    setInputHeight(44);
    setPendingOutbound((current) => [
      ...current,
      {
        id: pendingId,
        contactId: sentContact.id,
        contactName: sentContact.firstName || sentContact.id,
        body,
        photo: attached,
        sticker: attachedSticker,
        intent: sentIntent,
        createdAt,
        visible: true,
        releaseAt: null,
        direction: 'out',
      },
    ]);
    mutate('/v1/messages', {
      contactId: sentContact.id,
      body,
      photo: attached,
      sticker: attachedSticker,
      intent: sentIntent,
      releaseAt: sentIntent === 'scheduled' ? sentAt : undefined,
    })
      .then(() => {
        setPendingOutbound((current) => current.filter((item) => item.id !== pendingId));
      })
      .catch(() => {
        setPendingOutbound((current) => current.filter((item) => item.id !== pendingId));
        flashNotice('Could not send message.');
      });
    if (sentIntent !== 'realtime') {
      const at =
        sentIntent === 'scheduled'
          ? sentAt
          : nextDaily(new Date(), sentContact.dayHour, sentContact.dayMinute, sentContact.offsetMinutes).getTime();
      const delay = at - Date.now() + 1000;
      if (delay > 0 && delay < 8 * 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          api(inboxPath(), { token }).catch(() => {});
        }, delay);
      }
    }
  }

  async function attach(source) {
    if (attachBusy.current) return;
    attachBusy.current = true;
    try {
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) return;
        const options = {
          mediaTypes: ['images'],
          quality: 0.4,
          base64: true,
          exif: false,
        };
        if (Platform.OS === 'ios') {
          options.preferredAssetRepresentationMode =
            ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible;
        }
        const result = await ImagePicker.launchCameraAsync(options);
        const asset = result.canceled ? null : result.assets?.[0];
        if (!asset) return;
        const next = photoFromPickerAsset(asset);
        if (next) {
          setSticker(null);
          setPhoto(next);
        }
        return;
      }
      const next = await pickLibraryPhoto();
      if (next) {
        setSticker(null);
        setPhoto(next);
      }
    } finally {
      attachBusy.current = false;
    }
  }

  async function attachStickerFromPhoto() {
    if (attachBusy.current) return;
    attachBusy.current = true;
    try {
      setPhoto(null);
      setStickerTrayOpen(false);
      const next = await pickLibraryPhoto();
      if (next) await adoptSticker(next);
    } finally {
      attachBusy.current = false;
    }
  }

  function onChangeDraft(value) {
    setDraft(value);
  }

  function onInputSize(event) {
    const measured = event.nativeEvent.contentSize.height;
    setInputHeight(Math.max(44, Math.min(Math.ceil(measured), 176)));
  }

  const composerProps = {
    intent,
    onIntent: setIntent,
    choice,
    onChoice: setChoice,
    choices,
    now,
    customHour,
    onCustomHour: setCustomHour,
    photo,
    onClearPhoto: () => setPhoto(null),
    sticker,
    onClearSticker: () => setSticker(null),
    stickerTrayOpen,
    onToggleStickerTray: () => setStickerTrayOpen((current) => !current),
    stickerLibrary,
    onPickLibrarySticker: (dataUri) => adoptSticker(dataUri, false),
    onDrawSticker: () => {
      setStickerTrayOpen(false);
      Keyboard.dismiss();
      setDrawStickerOpen(true);
    },
    onPhotoSticker: () => attachStickerFromPhoto(),
    draft,
    onChangeDraft,
    onInputSize,
    inputHeight,
    contactId: contact?.id,
    canSend,
    onSend: () => send(),
    onAttach: () => attach('library'),
    onComposerFocus,
    onComposerBlur,
  };

  return (
    <View style={styles.root}>
      <View
        ref={phoneRef}
        onLayout={rememberBottom}
        style={[styles.phone, web && styles.webScreen]}
      >
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
        <View testID="schedule-panel" style={styles.top}>
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
                    {label}
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
                      state={state}
                      onChoose={(dayHour) => {
                        setScheduleOpen(false);
                        mutate('/v1/schedule', { dayHour, dayMinute: 0 });
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
              style={styles.accountGear}
            >
              <Feather name="settings" size={22} color={ink} />
            </Pressable>
            {accountOpen ? (
              <View testID="account-popover" style={styles.accountPopover}>
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.contacts, web && styles.webPad]}
          testID="contact-strip"
          style={styles.contactStrip}
          scrollEventThrottle={16}
        >
          {contacts.map((item) => {
            const selected = item.id === contact?.id;
            const pending = item.status === 'pending-in' || item.status === 'pending-out';
            const ring = panel !== 'add' && selected;
            const dim = ring ? styles.circleOn : styles.circleDim;
            return (
              <Pressable
                key={item.id}
                testID={`contact-${item.id}`}
                accessibilityRole="button"
                accessibilityLabel={item.firstName || item.id}
                accessibilityState={{
                  selected: (panel === 'chat' || panel === 'request') && selected,
                }}
                onPress={() => {
                  if (item.status === 'pending-in') setPanel('request');
                  else setPanel('chat');
                  mutate('/v1/open', { contactId: item.id });
                }}
                onLongPress={() => {
                  setScheduleOpen(false);
                  setAccountOpen(false);
                  setContactMenuId(item.id);
                }}
                style={styles.contact}
              >
                {pending ? (
                  <View style={[styles.avatarShell, styles.avatarDashed, dim]}>
                    <Image source={PERSON_AVATAR} resizeMode="cover" style={styles.avatarFill} />
                  </View>
                ) : (
                  <Image
                    source={PERSON_AVATAR}
                    resizeMode="cover"
                    style={[styles.avatar, dim]}
                  />
                )}
                <Text numberOfLines={1} style={styles.contactLabel}>
                  {item.firstName || item.id}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            testID="add-person"
            accessibilityRole="button"
            accessibilityLabel="new contact"
            accessibilityState={{ selected: panel === 'add' }}
            onPress={() => setPanel((current) => (current === 'add' ? 'chat' : 'add'))}
            style={styles.contact}
          >
            <View style={[styles.plus, panel === 'add' ? styles.circleOn : styles.circleDim]}>
              <Text style={styles.plusMark}>+</Text>
            </View>
            <Text numberOfLines={1} style={styles.contactLabel}>
              new contact
            </Text>
          </Pressable>
        </ScrollView>
        {contactMenuId ? (
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
            code={userId(inbox)}
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
                await mutate('/v1/friend-request/decline', { contactId: contact.id });
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
              if (open) return;
              threadRef.current?.scrollToEnd({ animated: false });
            }}
          >
            {messages.map((message) => (
              <ThreadMessage
                key={message.id}
                message={message}
                onOpenPhoto={setPhotoViewerUri}
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

        {contactActive ? <ComposerFooter testID="composer" {...composerProps} /> : null}
        </>
        )}
        </View>
        ) : null}
        {panel === 'chat' && open && Platform.OS !== 'web' ? (
          <ConversationSheet
            inset={inset}
            messages={messages}
            footer={<ComposerFooter testID="composer-copy" autoFocus {...composerProps} />}
            onOpenPhoto={setPhotoViewerUri}
            onReportIncoming={(messageId) => {
              if (!contact?.id) return;
              reportContact(contact.id, messageId);
            }}
            onBlockIncoming={() => {
              if (!contact?.id) return;
              confirmBlock(contact.id);
            }}
          />
        ) : null}
        <StickerDrawModal
          visible={drawStickerOpen}
          onCancel={() => setDrawStickerOpen(false)}
          onDone={async (dataUri) => {
            setDrawStickerOpen(false);
            await adoptSticker(dataUri);
          }}
        />
        {photoViewerUri ? (
          <View testID="photo-viewer" style={styles.photoViewer}>
            <Pressable
              testID="photo-viewer-backdrop"
              accessibilityRole="button"
              accessibilityLabel="Close photo"
              onPress={() => setPhotoViewerUri(null)}
              style={styles.photoViewerBackdrop}
            />
            <Image testID="photo-viewer-image" source={{ uri: photoViewerUri }} resizeMode="contain" style={styles.photoViewerImage} />
            <Pressable
              testID="photo-viewer-close"
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={() => setPhotoViewerUri(null)}
              style={styles.photoViewerClose}
            >
              <Feather name="x" size={28} color={paper} />
            </Pressable>
          </View>
        ) : null}
        {notice ? (
          <View testID="chat-notice" style={styles.chatNotice} pointerEvents="none">
            <Text style={styles.chatNoticeText}>{notice}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function userId(inbox) {
  return inbox?.user?.id;
}

function choiceLabel(at, now) {
  const phrase = receiptPhrase(at, now).replace(/^Received at /, '');
  const match = phrase.match(/^(\d+)(?::(\d+))?\s*(am|pm)\s+(.+)$/i);
  if (!match) return phrase;
  const [, hour, minute, suffix, day] = match;
  const clock = minute && minute !== '00' ? `${hour}:${minute}${suffix.toLowerCase()}` : `${hour}${suffix.toLowerCase()}`;
  return day === 'today' ? clock : `${clock} ${day}`;
}

function ComposerFooter({
  testID,
  autoFocus = false,
  intent,
  onIntent,
  choice,
  onChoice,
  choices,
  now,
  customHour,
  onCustomHour,
  photo,
  onClearPhoto,
  sticker,
  onClearSticker,
  stickerTrayOpen,
  onToggleStickerTray,
  stickerLibrary,
  onPickLibrarySticker,
  onDrawSticker,
  onPhotoSticker,
  draft,
  onChangeDraft,
  onInputSize,
  inputHeight,
  contactId,
  canSend,
  onSend,
  onAttach,
  onComposerFocus,
  onComposerBlur,
}) {
  const inputRef = useRef(null);
  const [timesOpen, setTimesOpen] = useState(false);
  const showIds = testID === 'composer';
  const stickersEnabled = Platform.OS === 'web' || Platform.OS === 'ios';
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);
  useEffect(() => {
    if (intent !== 'scheduled') setTimesOpen(false);
  }, [intent]);

  function chooseIntent(id) {
    onIntent(id);
    setTimesOpen(id === 'scheduled');
  }

  return (
    <View style={styles.footer}>
      <View style={styles.composerWrap}>
        {timesOpen ? (
          <View testID={showIds ? 'scheduled-choices' : undefined} style={[styles.choicePopover, web && styles.webChoices]}>
            {choices.map((at, index) => {
              const selected = choice === index;
              return (
                <Pressable
                  key={at.getTime()}
                  testID={showIds ? `choice-${index}` : undefined}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => onChoice(index)}
                  style={[styles.choiceRow, index === 0 && styles.choiceRowFirst, selected && styles.choiceRowOn]}
                >
                  <Text numberOfLines={1} style={[styles.choiceText, selected && styles.choiceTextOn]}>
                    {choiceLabel(at, now)}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              testID={showIds ? 'choice-custom' : undefined}
              accessibilityRole="button"
              accessibilityState={{ selected: choice === 'custom' }}
              onPress={() => onChoice('custom')}
              style={[styles.choiceRow, choice === 'custom' && styles.choiceRowOn]}
            >
              <Text numberOfLines={1} style={[styles.choiceText, choice === 'custom' && styles.choiceTextOn]}>
                custom
              </Text>
            </Pressable>
            {choice === 'custom' ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hours}>
                {DAY_HOURS.map((hour) => {
                  const selected = hour === customHour;
                  return (
                    <Pressable
                      key={hour}
                      testID={showIds ? `custom-hour-${hour}` : undefined}
                      accessibilityRole="button"
                      accessibilityLabel={dayPhrase(hour)}
                      onPress={() => onCustomHour(hour)}
                      style={[styles.hourChip, selected && styles.hourChipOn]}
                    >
                      <Text style={[styles.hourChipText, selected && styles.hourChipTextOn]}>{dayPhrase(hour)}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : null}
          </View>
        ) : null}
        {stickersEnabled && stickerTrayOpen ? (
          <View testID={showIds ? 'sticker-tray' : undefined} style={[styles.stickerTray, web && styles.stickerTrayWeb]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stickerTrayScroll}>
              <Pressable
                testID={showIds ? 'sticker-new-draw' : undefined}
                accessibilityRole="button"
                accessibilityLabel="Draw sticker"
                onPress={onDrawSticker}
                style={styles.stickerTrayAction}
              >
                <MaterialCommunityIcons name="draw-pen" size={22} color={ink} />
                <Text style={styles.stickerTrayLabel}>Draw</Text>
              </Pressable>
              <Pressable
                testID={showIds ? 'sticker-new-photo' : undefined}
                accessibilityRole="button"
                accessibilityLabel="Sticker from photo"
                onPress={onPhotoSticker}
                style={styles.stickerTrayAction}
              >
                <Feather name="image" size={20} color={ink} />
                <Text style={styles.stickerTrayLabel}>Photo</Text>
              </Pressable>
              {stickerLibrary.map((item, index) => (
                <Pressable
                  key={`${index}-${item.slice(0, 32)}`}
                  testID={showIds ? `sticker-saved-${index}` : undefined}
                  accessibilityRole="button"
                  accessibilityLabel="Saved sticker"
                  onPress={() => onPickLibrarySticker?.(item)}
                  style={styles.stickerTrayThumbWrap}
                >
                  <Image source={{ uri: item }} resizeMode="contain" style={styles.stickerTrayThumb} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
        <View testID={showIds ? 'composer-bar' : undefined} style={[styles.composer, web && styles.webComposer]}>
          {photo ? (
            <View style={styles.previewWrap}>
              <Image testID={showIds ? 'photo-preview' : undefined} source={{ uri: photo }} resizeMode="cover" style={styles.preview} />
              <Pressable
                testID={showIds ? 'photo-clear' : undefined}
                accessibilityRole="button"
                accessibilityLabel="Remove photo"
                onPress={onClearPhoto}
                style={styles.previewClear}
              >
                <Feather name="x" size={14} color={ink} />
              </Pressable>
            </View>
          ) : null}
          {!photo && sticker ? (
            <View style={styles.previewWrap}>
              <Image
                testID={showIds ? 'sticker-preview' : undefined}
                source={{ uri: sticker }}
                resizeMode="contain"
                style={styles.stickerPreview}
              />
              <Pressable
                testID={showIds ? 'sticker-clear' : undefined}
                accessibilityRole="button"
                accessibilityLabel="Remove sticker"
                onPress={onClearSticker}
                style={styles.previewClear}
              >
                <Feather name="x" size={14} color={ink} />
              </Pressable>
            </View>
          ) : null}
          <TextInput
            ref={inputRef}
            testID={testID}
            value={draft}
            autoFocus={autoFocus}
            onChangeText={onChangeDraft}
            onContentSizeChange={onInputSize}
            onFocus={onComposerFocus}
            onBlur={onComposerBlur}
            placeholder={contactId ? `Message ${contactId}` : 'Message'}
            placeholderTextColor="#8a8a8a"
            multiline
            numberOfLines={2}
            style={[styles.input, { height: inputHeight }]}
          />
          <View style={styles.boxTools}>
            {stickersEnabled ? (
              <Pressable
                testID={showIds ? 'attach-sticker' : undefined}
                accessibilityRole="button"
                accessibilityLabel="Stickers"
                accessibilityState={{ expanded: stickerTrayOpen }}
                onPress={onToggleStickerTray}
                style={styles.photoButton}
              >
                <MaterialCommunityIcons name="sticker-emoji" size={22} color={ink} />
              </Pressable>
            ) : null}
            <Pressable
              testID={showIds ? 'attach-photo' : undefined}
              accessibilityRole="button"
              accessibilityLabel="Photo"
              onPress={onAttach}
              style={styles.photoButton}
            >
              <Feather name="image" size={22} color={ink} />
            </Pressable>
            <View style={styles.intentSlot}>
              {INTENTS.map((item) => {
                const selected = item.id === intent;
                return (
                  <Pressable
                    key={item.id}
                    testID={showIds ? `intent-${item.id}` : undefined}
                    accessibilityRole="button"
                    accessibilityState={{ selected, expanded: item.id === 'scheduled' ? timesOpen : undefined }}
                    onPress={() => chooseIntent(item.id)}
                    style={styles.intentWord}
                  >
                    <Text numberOfLines={1} style={[styles.intentText, selected && styles.intentTextSelected]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              testID={showIds ? 'send' : undefined}
              accessibilityRole="button"
              accessibilityLabel="Send"
              disabled={!canSend}
              onPress={onSend}
              style={[styles.send, canSend && styles.sendReady]}
            >
              <Feather name="send" size={18} color={canSend ? paper : '#9a9a9a'} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function ConversationSheet({ inset, messages, footer, onOpenPhoto, onReportIncoming, onBlockIncoming }) {
  const ordered = messages.slice().reverse();
  return (
    <View testID="conversation-copy" style={[styles.copy, { top: 0, paddingBottom: inset }]}>
      <View style={styles.copyColumn}>
        <ScrollView
          style={[styles.thread, styles.flip]}
          contentContainerStyle={styles.threadContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={false}
          contentInsetAdjustmentBehavior="never"
        >
          {ordered.map((message) => (
            <View key={message.id} style={styles.flip}>
              <ThreadMessage
                message={message}
                onOpenPhoto={onOpenPhoto}
                onReportIncoming={onReportIncoming}
                onBlockIncoming={onBlockIncoming}
              />
            </View>
          ))}
        </ScrollView>
        {footer}
      </View>
    </View>
  );
}

const DELETE_ACCOUNT_CONSEQUENCE =
  'Your account, contacts, and messages are permanently removed from Zen Message and sign-in is cleared. This cannot be undone.';

function AccountMenu({ userId, onLogout, onDeleteAccount }) {
  const [armingDelete, setArmingDelete] = useState(false);

  return (
    <View testID="account-menu" style={armingDelete ? styles.accountMenuWide : null}>
      <View style={styles.menuRow}>
        <Text testID="account-id" style={styles.menuText}>
          ID {userId}
        </Text>
      </View>
      <Pressable
        testID="logout-button"
        accessibilityRole="button"
        accessibilityLabel="Log out"
        onPress={onLogout}
        style={styles.menuRow}
      >
        <Text style={styles.menuText}>Log out</Text>
      </Pressable>
      {armingDelete ? (
        <View testID="delete-account-confirm-step" style={styles.menuFooter}>
          <Text style={styles.menuConsequence}>{DELETE_ACCOUNT_CONSEQUENCE}</Text>
          <Pressable
            testID="delete-account-confirm"
            accessibilityRole="button"
            accessibilityLabel="Delete account permanently"
            onPress={() => {
              setArmingDelete(false);
              onDeleteAccount();
            }}
            style={styles.menuRow}
          >
            <Text style={[styles.menuTextQuiet, styles.menuTextAlert]}>Delete account permanently</Text>
          </Pressable>
          <Pressable
            testID="delete-account-cancel"
            accessibilityRole="button"
            accessibilityLabel="Cancel delete account"
            onPress={() => setArmingDelete(false)}
            style={styles.menuRow}
          >
            <Text style={styles.menuTextQuiet}>Cancel</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.menuFooter}>
          <Pressable
            testID="delete-account-button"
            accessibilityRole="button"
            accessibilityLabel="Delete account"
            onPress={() => setArmingDelete(true)}
            style={styles.menuRowQuiet}
            hitSlop={4}
          >
            <Text style={styles.menuTextQuiet}>Delete account</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function ScheduleSettings({ state, onChoose }) {
  const selected = dailyClock(state).hour;
  return (
    <ScrollView testID="schedule-menu" style={styles.popoverList} keyboardShouldPersistTaps="handled">
      {DAY_HOURS.map((hour) => {
        const on = hour === selected;
        return (
          <Pressable
            key={hour}
            testID={`schedule-hour-${hour}`}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onChoose(hour)}
            style={[styles.menuRow, on && styles.menuRowSelected]}
          >
            <Text style={[styles.menuText, on && styles.menuTextSelected]}>{dayPhrase(hour)}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function ThreadMessage({ message, onOpenPhoto, onReportIncoming, onBlockIncoming }) {
  const incoming = message.direction === 'in';
  const parts = messageBubbleParts(message);
  if (parts.length === 0) return null;

  function onLongPress() {
    if (!incoming) return;
    if (Platform.OS === 'web') {
      const report = window.confirm('Report this message?');
      if (report) {
        onReportIncoming?.(message.id);
        return;
      }
      const block = window.confirm('Block this contact?');
      if (block) onBlockIncoming?.();
      return;
    }
    Alert.alert('Message', 'Choose an action.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Report', onPress: () => onReportIncoming?.(message.id) },
      { text: 'Block contact', style: 'destructive', onPress: () => onBlockIncoming?.() },
    ]);
  }

  return (
    <Pressable
      onLongPress={incoming ? onLongPress : undefined}
      delayLongPress={420}
      style={[styles.messageStack, incoming ? styles.messageStackIn : styles.messageStackOut]}
    >
      {parts.map((kind) =>
        kind === 'sticker' ? (
          <StickerBubble key={`${message.id}-sticker`} message={message} incoming={incoming} onOpenPhoto={onOpenPhoto} />
        ) : kind === 'photo' ? (
          <PhotoBubble key={`${message.id}-photo`} message={message} incoming={incoming} onOpenPhoto={onOpenPhoto} />
        ) : (
          <TextBubble key={`${message.id}-text`} message={message} incoming={incoming} />
        ),
      )}
    </Pressable>
  );
}

function TextBubble({ message, incoming }) {
  return (
    <View testID={incoming ? 'bubble-in' : 'bubble-out'} style={[styles.bubble, incoming ? styles.bubbleIn : styles.bubbleOut, web && styles.bubbleRead]}>
      <View pointerEvents="none" testID={incoming ? 'tail-in' : 'tail-own'} style={[styles.tail, incoming ? styles.tailIn : styles.tailOut]}>
        <View style={styles.tailStem} />
        <View style={styles.tailFill} />
        <View style={styles.tailJoin} />
        <View style={styles.tailClip}>
          <View style={styles.tailEdge} />
        </View>
      </View>
      <Text style={styles.bubbleText}>{message.body}</Text>
    </View>
  );
}

function StickerBubble({ message, incoming, onOpenPhoto }) {
  const [aspect, setAspect] = useState(1);
  useEffect(() => {
    if (!message.sticker) return;
    Image.getSize(
      message.sticker,
      (width, height) => {
        if (width > 0 && height > 0) setAspect(width / height);
      },
      () => {},
    );
  }, [message.sticker]);
  return (
    <Pressable
      testID={incoming ? 'sticker-in' : 'sticker-out'}
      accessibilityRole="button"
      accessibilityLabel="View sticker"
      onPress={() => onOpenPhoto?.(message.sticker)}
      style={[
        styles.stickerBubble,
        incoming ? styles.stickerBubbleIn : styles.stickerBubbleOut,
        web && styles.stickerBubbleWeb,
        { width: photoMaxWidth, aspectRatio: aspect },
      ]}
    >
      <Image testID="bubble-sticker" source={{ uri: message.sticker }} resizeMode="contain" style={styles.stickerImage} />
    </Pressable>
  );
}

function PhotoBubble({ message, incoming, onOpenPhoto }) {
  const [aspect, setAspect] = useState(4 / 3);
  useEffect(() => {
    if (!message.photo) return;
    Image.getSize(
      message.photo,
      (width, height) => {
        if (width > 0 && height > 0) setAspect(width / height);
      },
      () => {},
    );
  }, [message.photo]);
  return (
    <Pressable
      testID={incoming ? 'photo-in' : 'photo-out'}
      accessibilityRole="button"
      accessibilityLabel="View photo"
      onPress={() => onOpenPhoto?.(message.photo)}
      style={[
        styles.photoBubble,
        incoming ? styles.photoBubbleIn : styles.photoBubbleOut,
        web && styles.photoBubbleWeb,
        { width: photoMaxWidth, aspectRatio: aspect },
      ]}
    >
      <Image testID="bubble-photo" source={{ uri: message.photo }} resizeMode="cover" style={styles.photoImage} />
    </Pressable>
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
  webComposer: { marginHorizontal: side },
  webChoices: { left: side, right: side, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' },
  top: { zIndex: 4, backgroundColor: paper },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: ink,
    paddingLeft: 14,
    paddingRight: 16,
    paddingVertical: 8,
    gap: 8,
    position: 'relative',
  },
  headerMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 },
  focus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 16,
    flexShrink: 0,
  },
  focusText: { color: ink, fontSize: 16, lineHeight: 20, fontWeight: '600' },
  scheduleWrap: { flex: 1, position: 'relative', zIndex: 2, minWidth: 0 },
  schedulePhrase: { flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0 },
  popover: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    width: 168,
    maxHeight: 280,
    backgroundColor: paper,
    borderWidth: 1,
    borderColor: ink,
    zIndex: 6,
  },
  popoverList: { maxHeight: 280 },
  scheduleLine: { color: ink, fontSize: 16, lineHeight: 20 },
  schedulePrefix: { flexShrink: 1 },
  scheduleTime: { flexShrink: 0, textDecorationLine: 'underline' },
  accountGear: { padding: 2, flexShrink: 0 },
  accountPopover: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    width: 168,
    backgroundColor: paper,
    borderWidth: 1,
    borderColor: ink,
    zIndex: 6,
  },
  contactMenuPopover: {
    position: 'absolute',
    top: 124,
    left: side,
    zIndex: 6,
  },
  accountMenuWide: { width: 248 },
  menuFooter: { borderTopWidth: 1, borderTopColor: '#e6e3dc' },
  menuRowQuiet: { paddingVertical: 10, paddingHorizontal: 18 },
  menuTextQuiet: { color: '#6a6a6a', fontSize: 13, lineHeight: 17 },
  menuConsequence: {
    color: ink,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 6,
  },
  menuTextAlert: { color: '#b3261e' },
  chatNotice: {
    position: 'absolute',
    left: side,
    right: side,
    bottom: 18,
    alignItems: 'center',
    zIndex: 12,
  },
  chatNoticeText: {
    color: ink,
    backgroundColor: paper,
    borderWidth: 1,
    borderColor: ink,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    lineHeight: 18,
  },
  photoViewer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoViewerBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.92)' },
  photoViewerImage: { width: '100%', height: '100%' },
  photoViewerClose: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 10,
    zIndex: 1,
  },
  menu: { borderBottomWidth: 1, borderBottomColor: ink, backgroundColor: paper },
  menuRow: { paddingVertical: 13, paddingHorizontal: 18, borderTopWidth: 1, borderTopColor: ink },
  weekBlock: { paddingTop: 10, paddingBottom: 12, borderTopWidth: 1, borderTopColor: ink, gap: 8 },
  weekRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 18 },
  weekChip: { borderWidth: 1, borderColor: ink, paddingHorizontal: 8, paddingVertical: 6 },
  weekChipOn: { backgroundColor: ink },
  weekChipText: { color: ink, fontSize: 13, lineHeight: 16 },
  weekChipTextOn: { color: paper },
  menuRowSelected: { backgroundColor: '#f6f3ee' },
  menuText: { color: ink, fontSize: 16, lineHeight: 21 },
  menuTextSelected: { fontWeight: '700' },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 3 },
  contactStrip: { flexGrow: 0, flexShrink: 0, borderBottomWidth: 1, borderBottomColor: ink, zIndex: 0 },
  contacts: { paddingHorizontal: 12, paddingTop: 14, paddingBottom: 10, gap: 18 },
  contact: { width: 76, alignItems: 'center' },
  avatar: { width: 54, height: 54, borderRadius: 27, borderWidth: 1, borderColor: ink, backgroundColor: paper },
  avatarShell: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: ink,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paper,
  },
  avatarDashed: { borderStyle: 'dashed' },
  avatarFill: { width: 46, height: 46, borderRadius: 23 },
  circleOn: { opacity: 1, borderWidth: 2, borderColor: ink },
  circleDim: { opacity: 0.4 },
  pendingMain: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  pendingText: { color: ink, fontSize: 17, lineHeight: 22, textAlign: 'center' },
  contactLabel: { marginTop: 4, maxWidth: 76, color: ink, fontSize: 11, lineHeight: 14, textAlign: 'center' },
  plus: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusMark: { color: ink, fontSize: 32, lineHeight: 34 },
  main: { flex: 1, backgroundColor: paper },
  copy: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 8,
    overflow: 'hidden',
    backgroundColor: paper,
  },
  copyColumn: { flex: 1, backgroundColor: paper },
  flip: { transform: [{ scaleY: -1 }] },
  thread: { flex: 1 },
  threadContent: { paddingHorizontal: 16, paddingTop: 22, paddingBottom: 16, gap: 14, overflow: 'visible' },
  messageStack: { gap: 6, maxWidth: '100%' },
  messageStackIn: { alignSelf: 'flex-start', marginTop: 10 },
  messageStackOut: { alignSelf: 'flex-end' },
  stickerTray: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: '100%',
    marginBottom: 6,
    backgroundColor: paper,
    borderWidth: 1,
    borderColor: ink,
    borderRadius: 16,
    zIndex: 6,
    maxHeight: 112,
  },
  stickerTrayWeb: { left: 56, right: 56 },
  stickerTrayScroll: { flexDirection: 'row', padding: 10, gap: 10, alignItems: 'center' },
  stickerTrayAction: {
    width: 72,
    height: 72,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ink,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#f8f8f8',
  },
  stickerTrayLabel: { color: ink, fontSize: 12, lineHeight: 14 },
  stickerTrayThumbWrap: {
    width: 72,
    height: 72,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  stickerTrayThumb: { width: '100%', height: '100%' },
  stickerPreview: { width: 120, height: 88, borderRadius: 12, backgroundColor: '#fafafa' },
  stickerBubble: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  stickerBubbleIn: { alignSelf: 'flex-start' },
  stickerBubbleOut: { alignSelf: 'flex-end' },
  stickerBubbleWeb: { maxWidth: 'min(320px, 84%)' },
  stickerImage: { width: '100%', height: '100%' },
  photoBubble: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  photoBubbleIn: { alignSelf: 'flex-start' },
  photoBubbleOut: { alignSelf: 'flex-end' },
  photoBubbleWeb: { maxWidth: 'min(320px, 84%)' },
  photoImage: { width: '100%', height: '100%' },
  bubble: {
    alignSelf: 'flex-end',
    maxWidth: '84%',
    borderWidth: 1,
    borderColor: ink,
    borderRadius: 18,
    backgroundColor: paper,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 4,
  },
  bubbleOut: { borderBottomRightRadius: 2 },
  bubbleIn: {
    alignSelf: 'flex-start',
    maxWidth: '78%',
    marginTop: 10,
    marginBottom: 0,
    borderTopLeftRadius: 2,
  },
  bubbleRead: { maxWidth: 'min(560px, 100%)' },
  tail: { position: 'absolute', width: 24, height: 20 },
  tailIn: { left: -1, top: -12 },
  tailOut: { right: -1, bottom: -12, transform: [{ rotate: '180deg' }] },
  tailStem: { position: 'absolute', left: 0, top: 0, width: 1, height: 14, backgroundColor: ink },
  tailFill: {
    position: 'absolute',
    left: 1,
    top: 0,
    width: 0,
    height: 0,
    borderRightWidth: 16,
    borderBottomWidth: 13,
    borderRightColor: 'transparent',
    borderBottomColor: paper,
  },
  tailJoin: { position: 'absolute', left: 1, top: 11, width: 16, height: 8, backgroundColor: paper },
  tailClip: { position: 'absolute', left: 0, top: 0, width: 24, height: 12, overflow: 'hidden' },
  tailEdge: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 28,
    height: 1,
    backgroundColor: ink,
    transformOrigin: 'left center',
    transform: [{ rotate: '36deg' }],
  },
  bubbleText: { color: ink, fontSize: 17, lineHeight: 22 },
  footer: { backgroundColor: paper },
  composerWrap: { position: 'relative', zIndex: 2 },
  intentSlot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  intentWord: { paddingVertical: 6, paddingHorizontal: 2 },
  intentText: { color: ink, fontSize: 14, lineHeight: 18 },
  intentTextSelected: { fontWeight: '700' },
  choicePopover: {
    position: 'absolute',
    left: 56,
    right: 56,
    bottom: '100%',
    marginBottom: 6,
    backgroundColor: paper,
    borderWidth: 1,
    borderColor: ink,
    zIndex: 6,
  },
  choiceRow: { paddingVertical: 11, paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: ink },
  choiceRowFirst: { borderTopWidth: 0 },
  choiceRowOn: { backgroundColor: '#f6f3ee' },
  choiceText: { color: ink, fontSize: 15, lineHeight: 20 },
  choiceTextOn: { fontWeight: '700' },
  hours: { paddingHorizontal: 10, paddingBottom: 10, gap: 6 },
  hourChip: { borderWidth: 1, borderColor: ink, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  hourChipOn: { backgroundColor: ink },
  hourChipText: { color: ink, fontSize: 12, lineHeight: 16 },
  hourChipTextOn: { color: paper },
  composer: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: ink,
    borderRadius: 22,
    backgroundColor: paper,
    overflow: 'hidden',
  },
  previewWrap: { paddingTop: 12, paddingHorizontal: 12 },
  preview: { width: 120, height: 88, borderRadius: 12, backgroundColor: '#f3f3f3' },
  previewClear: {
    position: 'absolute',
    top: 18,
    left: 104,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: ink,
    backgroundColor: paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    fontSize: 17,
    lineHeight: 22,
    color: ink,
    borderWidth: 0,
    outlineStyle: 'none',
  },
  boxTools: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 8,
    paddingBottom: 8,
  },
  photoButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  sendReady: { backgroundColor: ink },
});
