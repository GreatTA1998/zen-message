import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { api, inboxPath } from './src/api';
import { PERSON_AVATAR } from './src/contacts';
import {
  DAY_HOURS,
  INTENTS,
  dailyClock,
  dayPhrase,
  messagePhoto,
  nextDaily,
  receiptPhrase,
  scheduledChoices,
  threadMessages,
} from './src/delivery';
import { LoginView } from './src/LoginView';
import { listenForDigest, prepareNotifications } from './src/notify';
import { hasConfusingCharacter, isCode, normalizeCode } from './src/people';
import { PlusView } from './src/PlusView';
import { readExpoPushToken } from './src/push';
import { loadSession, saveSession } from './src/session';
import { finishSignIn } from './src/signIn';

function scheduleLabel(state) {
  if (state?.mode === 'relaxed') return 'Receiving notifications';
  const clock = dailyClock(state);
  return `Daily ${dayPhrase(clock.hour, clock.minute)}`;
}

const MISSING = {
  apple_capability: 'Apple sign-in needs the Apple capability on this device.',
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
      result.provider === 'google' ? 'google' : 'apple',
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

  if (!ready) return <View style={styles.boot} />;

  let body = null;
  if (!token) {
    body = <LoginView onSubject={onSubject} notice={notice} />;
  } else {
    body = <ChatScreen token={token} inbox={inbox} onInbox={applyInbox} onAdd={onAdd} onLookup={onLookup} />;
  }

  return (
    <SafeAreaView style={styles.frame} edges={['top', 'bottom']}>
      {body}
    </SafeAreaView>
  );
}

function ChatScreen({ token, inbox, onInbox, onAdd, onLookup }) {
  const [draft, setDraft] = useState('');
  const [photo, setPhoto] = useState(null);
  const [inputHeight, setInputHeight] = useState(44);
  const [intent, setIntent] = useState('anytime');
  const [choice, setChoice] = useState(0);
  const [customHour, setCustomHour] = useState(15);
  const [panel, setPanel] = useState('chat');
  const threadRef = useRef(null);
  const frameRef = useRef(null);
  const avatarRefs = useRef({});
  const [tailX, setTailX] = useState(null);
  const state = inbox?.state;
  const contacts = inbox?.contacts ?? [];
  const contact = contacts.find((item) => item.id === state?.contactId) ?? null;
  const messages = contact && state ? threadMessages(state.messages, contact.id) : [];
  const focused = state?.mode !== 'relaxed';
  const label = scheduleLabel(state);
  const now = new Date();
  const choices = scheduledChoices(now);
  const selectedAt = choice === 'custom' ? nextDaily(now, customHour, 0) : choices[choice] ?? choices[0];
  const phrase = intent === 'scheduled' && selectedAt ? receiptPhrase(selectedAt, now) : '';
  const canSend = Boolean(contact) && (draft.trim().length > 0 || Boolean(photo));

  const syncTail = useCallback(() => {
    const avatar = avatarRefs.current[contact?.id];
    const frame = frameRef.current;
    if (!avatar?.measureInWindow || !frame?.measureInWindow) return;
    avatar.measureInWindow((x, _y, width) => {
      frame.measureInWindow((frameX, _frameY, frameWidth) => {
        const center = x + width / 2 - frameX;
        setTailX(Math.max(20, Math.min(center, frameWidth - 20)));
      });
    });
  }, [contact?.id]);

  useEffect(() => {
    const handle = requestAnimationFrame(syncTail);
    return () => cancelAnimationFrame(handle);
  }, [syncTail, contacts.length, messages.length]);

  async function mutate(path, body) {
    const next = await api(path, { token, method: 'POST', body });
    onInbox(next);
    if (next.effects?.length) {
      await api('/v1/effects/ack', { token, method: 'POST', body: {} });
    }
  }

  function send(text = draft) {
    const body = text.trim();
    if ((!body && !photo) || !contact) return;
    const attached = photo;
    const sentIntent = intent;
    const sentContact = contact;
    const sentAt = selectedAt?.getTime();
    setDraft('');
    setPhoto(null);
    setInputHeight(44);
    mutate('/v1/messages', {
      contactId: sentContact.id,
      body,
      photo: attached,
      intent: sentIntent,
      releaseAt: sentIntent === 'scheduled' ? sentAt : undefined,
    }).catch(() => {});
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
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const options = { mediaTypes: ['images'], quality: 0.4, base64: true, exif: false };
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
    const asset = result.canceled ? null : result.assets?.[0];
    if (!asset || asset.type === 'video' || String(asset.mimeType || '').startsWith('video/')) return;
    const mime = String(asset.mimeType || 'image/jpeg');
    const subtype = mime.slice('image/'.length).split(';')[0] || 'jpeg';
    const next = asset.base64 ? messagePhoto(`data:image/${subtype};base64,${asset.base64}`) : null;
    if (next) setPhoto(next);
  }

  function onChangeDraft(value) {
    setDraft(value);
  }

  function onInputSize(event) {
    const measured = event.nativeEvent.contentSize.height;
    setInputHeight(Math.max(44, Math.min(Math.ceil(measured), 176)));
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.phone}>
        <View testID="schedule-panel" style={styles.top}>
          <View testID="top-bar" style={styles.header}>
            <Pressable
              testID="mode-toggle"
              accessibilityRole="button"
              accessibilityLabel="Focus"
              accessibilityState={{ selected: focused }}
              hitSlop={6}
              onPress={() => mutate('/v1/mode', { mode: focused ? 'relaxed' : 'batched' })}
              style={[styles.focus, focused && styles.focusOn]}
            >
              <Feather name="moon" size={18} color={focused ? ink : '#8a8a8a'} />
              <Text style={[styles.focusText, focused && styles.focusTextOn]}>Focus</Text>
            </Pressable>
            <Pressable
              testID="schedule-button"
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: panel === 'settings' }}
              onPress={() => setPanel((current) => (current === 'settings' ? 'chat' : 'settings'))}
              style={styles.schedule}
            >
              <Text testID="schedule-label" numberOfLines={1} style={styles.scheduleLine}>
                {label}
              </Text>
              <Feather name="settings" size={22} color={ink} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contacts}
          testID="contact-strip"
          style={styles.contactStrip}
          scrollEventThrottle={16}
          onScroll={syncTail}
        >
          {contacts.map((item) => {
            const selected = item.id === contact?.id;
            return (
              <Pressable
                key={item.id}
                testID={`contact-${item.id}`}
                accessibilityRole="button"
                accessibilityLabel={item.id}
                accessibilityState={{ selected: panel === 'chat' && selected }}
                onPress={() => {
                  setPanel('chat');
                  mutate('/v1/open', { contactId: item.id });
                }}
                style={styles.contact}
              >
                <Image
                  ref={(node) => {
                    avatarRefs.current[item.id] = node;
                  }}
                  onLayout={syncTail}
                  source={PERSON_AVATAR}
                  resizeMode="cover"
                  style={[styles.avatar, panel === 'chat' && selected ? styles.circleOn : styles.circleDim]}
                />
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

        {panel === 'settings' ? (
          <ScheduleSettings
            state={state}
            onChoose={(dayHour) => mutate('/v1/schedule', { dayHour, dayMinute: 0 })}
          />
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
        {panel === 'chat' ? (
        <View style={styles.main}>
        <View ref={frameRef} style={styles.thread} onLayout={syncTail}>
          <ScrollView
            ref={threadRef}
            style={styles.thread}
            contentContainerStyle={styles.threadContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => threadRef.current?.scrollToEnd({ animated: false })}
          >
            {messages.map((message) => (
              <Bubble key={message.id} message={message} tailX={tailX} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <View style={styles.intents}>
            {INTENTS.map((item, index) => {
              const selected = item.id === intent;
              return (
                <Pressable
                  key={item.id}
                  testID={`intent-${item.id}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setIntent(item.id)}
                  style={[styles.intent, index === INTENTS.length - 1 && styles.intentLast]}
                >
                  <Text style={[styles.intentText, selected && styles.intentTextSelected]}>{item.label}</Text>
                  {selected ? <View style={styles.intentBar} /> : null}
                </Pressable>
              );
            })}
          </View>
          {intent === 'scheduled' ? (
            <View testID="scheduled-choices" style={styles.choices}>
              {choices.map((at, index) => {
                const selected = choice === index;
                return (
                  <Pressable
                    key={at.getTime()}
                    testID={`choice-${index}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setChoice(index)}
                    style={[styles.choice, selected && styles.choiceOn]}
                  >
                    <Text style={[styles.choiceText, selected && styles.choiceTextOn]}>{choiceLabel(at, now)}</Text>
                  </Pressable>
                );
              })}
              <Pressable
                testID="choice-custom"
                accessibilityRole="button"
                accessibilityState={{ selected: choice === 'custom' }}
                onPress={() => setChoice('custom')}
                style={[styles.choice, choice === 'custom' && styles.choiceOn]}
              >
                <Text style={[styles.choiceText, choice === 'custom' && styles.choiceTextOn]}>
                  {choice === 'custom' ? choiceLabel(selectedAt, now) : 'Pick a time'}
                </Text>
              </Pressable>
            </View>
          ) : null}
          {intent === 'scheduled' && choice === 'custom' ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hours}>
              {DAY_HOURS.map((hour) => {
                const selected = hour === customHour;
                return (
                  <Pressable
                    key={hour}
                    testID={`custom-hour-${hour}`}
                    accessibilityRole="button"
                    accessibilityLabel={dayPhrase(hour)}
                    onPress={() => setCustomHour(hour)}
                    style={[styles.hourChip, selected && styles.hourChipOn]}
                  >
                    <Text style={[styles.hourChipText, selected && styles.hourChipTextOn]}>{dayPhrase(hour)}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
          <View testID="composer-bar" style={styles.composer}>
            {phrase ? (
              <Text testID="receipt-phrase" style={styles.receipt}>
                {phrase}
              </Text>
            ) : null}
            {photo ? (
              <View style={styles.previewWrap}>
                <Image testID="photo-preview" source={{ uri: photo }} resizeMode="cover" style={styles.preview} />
                <Pressable
                  testID="photo-clear"
                  accessibilityRole="button"
                  accessibilityLabel="Remove photo"
                  onPress={() => setPhoto(null)}
                  style={styles.previewClear}
                >
                  <Feather name="x" size={14} color={ink} />
                </Pressable>
              </View>
            ) : null}
            <TextInput
              testID="composer"
              value={draft}
              onChangeText={onChangeDraft}
              onContentSizeChange={onInputSize}
              placeholder={contact ? `Message ${contact.id}` : 'Message'}
              placeholderTextColor="#8a8a8a"
              multiline
              numberOfLines={2}
              style={[styles.input, { height: inputHeight }]}
            />
            <View style={styles.boxTools}>
              <Pressable
                testID="attach-photo"
                accessibilityRole="button"
                accessibilityLabel="Photo"
                onPress={() => attach('library')}
                style={styles.photoButton}
              >
                <Feather name="image" size={22} color={ink} />
              </Pressable>
              <Pressable
                testID="send"
                accessibilityRole="button"
                accessibilityLabel="Send"
                disabled={!canSend}
                onPress={() => send()}
                style={[styles.send, canSend && styles.sendReady]}
              >
                <Feather name="send" size={18} color={canSend ? paper : '#9a9a9a'} />
              </Pressable>
            </View>
          </View>
        </View>
        </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

function userId(inbox) {
  return inbox?.user?.id;
}

function choiceLabel(at, now) {
  const phrase = receiptPhrase(at, now);
  return phrase.replace('Received at ', '');
}

function ScheduleSettings({ state, onChoose }) {
  const selected = dailyClock(state).hour;
  return (
    <ScrollView testID="schedule-menu" style={styles.main} contentContainerStyle={styles.menu} keyboardShouldPersistTaps="handled">
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

function Bubble({ message, tailX }) {
  const incoming = message.direction === 'in';
  const [width, setWidth] = useState(0);
  if (!incoming) {
    return (
      <View style={styles.bubble}>
        <BubbleBody message={message} />
        <View testID="tail-own" style={styles.ownTail}>
          <View style={styles.ownTailInk} />
          <View style={styles.ownTailPaper} />
          <View style={styles.ownTailJoin} />
        </View>
      </View>
    );
  }
  const tailLeft = Math.max(8, (tailX ?? 34) - 16 - 9);
  const minWidth = Math.max(72, tailLeft + 30);
  return (
    <View
      testID="bubble-in"
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[styles.bubble, styles.bubbleIn, { minWidth: Math.min(minWidth, Math.max(width, minWidth)) }]}
    >
      <View testID="tail-in" style={[styles.theirTail, { left: Math.min(tailLeft, Math.max(minWidth, width) - 26) }]}>
        <View style={styles.theirTailInk} />
        <View style={styles.theirTailPaper} />
        <View style={styles.theirTailJoin} />
      </View>
      <BubbleBody message={message} />
    </View>
  );
}

function BubbleBody({ message }) {
  return (
    <>
      {message.photo ? (
        <Image testID="bubble-photo" source={{ uri: message.photo }} resizeMode="cover" style={styles.bubblePhoto} />
      ) : null}
      {message.body ? <Text style={styles.bubbleText}>{message.body}</Text> : null}
    </>
  );
}

const ink = '#1c1c1c';
const paper = '#fff';

const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: paper },
  provider: { flex: 1, backgroundColor: paper },
  frame: { flex: 1, backgroundColor: paper },
  root: { flex: 1, backgroundColor: paper, alignItems: 'center' },
  phone: { flex: 1, width: '100%', maxWidth: 480, backgroundColor: paper },
  top: { zIndex: 2, backgroundColor: paper },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: ink,
    paddingLeft: 14,
    paddingRight: 16,
    paddingVertical: 8,
    gap: 14,
  },
  focus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  focusOn: { backgroundColor: '#ece7df' },
  focusText: { color: '#8a8a8a', fontSize: 16, lineHeight: 20 },
  focusTextOn: { color: ink, fontWeight: '600' },
  schedule: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  scheduleLine: { flex: 1, color: ink, fontSize: 16, lineHeight: 20 },
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
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 1 },
  contactStrip: { flexGrow: 0, flexShrink: 0, borderBottomWidth: 1, borderBottomColor: ink, zIndex: 0 },
  contacts: { paddingHorizontal: 12, paddingTop: 14, paddingBottom: 10, gap: 18 },
  contact: { width: 76, alignItems: 'center' },
  avatar: { width: 54, height: 54, borderRadius: 27, borderWidth: 1, borderColor: ink, backgroundColor: paper },
  circleOn: { opacity: 1, borderWidth: 2, borderColor: ink },
  circleDim: { opacity: 0.4 },
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
  thread: { flex: 1 },
  threadContent: { paddingHorizontal: 16, paddingTop: 22, paddingBottom: 28, gap: 14, overflow: 'visible' },
  bubble: {
    alignSelf: 'flex-end',
    maxWidth: '84%',
    borderWidth: 1,
    borderColor: ink,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: paper,
    overflow: 'visible',
    marginBottom: 6,
  },
  bubbleIn: { alignSelf: 'flex-start', maxWidth: '100%', marginTop: 8, marginBottom: 0 },
  ownTail: { position: 'absolute', right: 6, bottom: -11, width: 18, height: 12 },
  ownTailInk: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 2,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: ink,
  },
  ownTailPaper: {
    position: 'absolute',
    right: 1,
    bottom: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 1,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: paper,
  },
  ownTailJoin: { position: 'absolute', right: 2, top: -1, width: 12, height: 3, backgroundColor: paper },
  theirTail: { position: 'absolute', top: -11, width: 18, height: 12, zIndex: 1 },
  theirTailInk: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: ink,
  },
  theirTailPaper: {
    position: 'absolute',
    left: 2,
    top: 3,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: paper,
  },
  theirTailJoin: { position: 'absolute', left: 2, bottom: -2, width: 14, height: 4, backgroundColor: paper },
  bubbleText: { color: ink, fontSize: 17, lineHeight: 22 },
  footer: { borderTopWidth: 1, borderTopColor: ink, backgroundColor: paper },
  intents: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: ink },
  intent: {
    flex: 1,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: ink,
  },
  intentLast: { borderRightWidth: 0 },
  intentBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, backgroundColor: ink },
  intentText: { color: ink, fontSize: 14, textAlign: 'center', lineHeight: 18 },
  intentTextSelected: { fontWeight: '700' },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 12, paddingTop: 10 },
  choice: { borderWidth: 1, borderColor: ink, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  choiceOn: { backgroundColor: ink },
  choiceText: { color: ink, fontSize: 13, lineHeight: 16 },
  choiceTextOn: { color: paper },
  hours: { paddingHorizontal: 12, paddingTop: 8, gap: 6 },
  hourChip: { borderWidth: 1, borderColor: ink, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  hourChipOn: { backgroundColor: ink },
  hourChipText: { color: ink, fontSize: 12, lineHeight: 16 },
  hourChipTextOn: { color: paper },
  receipt: {
    paddingHorizontal: 16,
    paddingTop: 12,
    color: ink,
    fontSize: 15,
    lineHeight: 20,
  },
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
  bubblePhoto: { width: 180, height: 140, borderRadius: 10, marginBottom: 6 },
  send: {
    marginLeft: 'auto',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  sendReady: { backgroundColor: ink },
});
