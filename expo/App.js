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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { api, inboxPath } from './src/api';
import { PERSON_AVATAR, LOGO } from './src/contacts';
import { INTENTS, SCHEDULES, scheduleById, threadMessages } from './src/delivery';
import { LoginView } from './src/LoginView';
import { listenForDigest, prepareNotifications, runNotificationEffects } from './src/notify';
import { hasConfusingCharacter, isCode, normalizeCode } from './src/people';
import { PlusView } from './src/PlusView';
import { readExpoPushToken } from './src/push';
import { loadSession, saveSession } from './src/session';

function scheduleLabel(scheduleId, relaxed) {
  if (scheduleId === 'daily-1-7') return relaxed ? 'Relaxed daily, 1pm, 7pm' : 'Batched daily, 1pm, 7pm';
  if (scheduleId === 'daily-8') return relaxed ? 'Relaxed daily, 8am' : 'Daily, 8am';
  if (scheduleId === 'hourly') return relaxed ? 'Relaxed hourly' : 'Hourly';
  return relaxed ? 'Relaxed, every 3 hours' : 'Every 3 hours';
}

const MISSING = {
  google_oauth_client: 'Google sign-in needs a Google OAuth client.',
  apple_capability: 'Apple sign-in needs the Apple capability on this device.',
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
  const [searching, setSearching] = useState(false);
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
      await runNotificationEffects(next.effects);
      await api('/v1/effects/ack', { token: current, method: 'POST', body: {} });
    }
    return next;
  }, [applyInbox]);

  useEffect(() => {
    let alive = true;
    (async () => {
      await prepareNotifications();
      const saved = await loadSession();
      if (!alive) return;
      if (!saved) {
        setReady(true);
        return;
      }
      tokenRef.current = saved;
      setToken(saved);
      try {
        await refresh();
      } catch {
        tokenRef.current = null;
        setToken(null);
        await saveSession(null);
      }
      if (alive) setReady(true);
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
    setNotice('');
    const session = await api('/v1/session', {
      method: 'POST',
      body: { provider: result.provider, subject: result.subject },
    });
    tokenRef.current = session.token;
    setToken(session.token);
    setUser(session.user);
    await saveSession(session.token);
    await refresh();
  }

  async function onAdd(raw) {
    const code = normalizeCode(raw);
    if (hasConfusingCharacter(code)) return '1, I, and L are not used.';
    if (!isCode(code)) return 'Enter a 3-character ID.';
    if (code === user?.id) return 'That is your ID.';
    try {
      const next = await api('/v1/contacts', { token, method: 'POST', body: { code } });
      applyInbox(next);
      setSearching(false);
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
  } else if (searching) {
    body = <PlusView code={user?.id} onClose={() => setSearching(false)} onAdd={onAdd} />;
  } else {
    body = (
      <ChatScreen
        token={token}
        inbox={inbox}
        onInbox={applyInbox}
        onSearch={() => setSearching(true)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.frame} edges={['top', 'bottom']}>
      {body}
    </SafeAreaView>
  );
}

function ChatScreen({ token, inbox, onInbox, onSearch }) {
  const [draft, setDraft] = useState('');
  const [intent, setIntent] = useState('anytime');
  const [menuOpen, setMenuOpen] = useState(false);
  const threadRef = useRef(null);
  const frameRef = useRef(null);
  const avatarRefs = useRef({});
  const [tailX, setTailX] = useState(null);
  const state = inbox?.state;
  const contacts = inbox?.contacts ?? [];
  const contact = contacts.find((item) => item.id === state?.contactId) ?? null;
  const messages = contact && state ? threadMessages(state.messages, contact.id) : [];
  const schedule = scheduleById(state?.scheduleId);
  const relaxed = state?.mode === 'relaxed';
  const label = scheduleLabel(schedule.id, relaxed);
  const canSend = Boolean(contact) && draft.trim().length > 0;

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
      await runNotificationEffects(next.effects);
      await api('/v1/effects/ack', { token, method: 'POST', body: {} });
    }
  }

  function send(text = draft) {
    const body = text.trim();
    if (!body || !contact) return;
    setDraft('');
    mutate('/v1/messages', { contactId: contact.id, body, intent }).catch(() => {});
  }

  function onChangeDraft(value) {
    if (Platform.OS === 'web' && value.endsWith('\n')) {
      const next = value.replace(/\n+$/, '');
      setDraft(next);
      if (next.trim()) send(next);
      return;
    }
    setDraft(value);
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.phone}>
        <View style={styles.top}>
          <View style={styles.header}>
            <Pressable
              testID="mode-toggle"
              accessibilityRole="button"
              accessibilityLabel={relaxed ? 'Relaxed' : 'Batched'}
              hitSlop={6}
              onPress={() => mutate('/v1/mode', { mode: relaxed ? 'batched' : 'relaxed' })}
              style={styles.toggle}
            >
              <View style={[styles.toggleRing, relaxed && styles.toggleRingOn]}>
                <Image source={LOGO} resizeMode="cover" style={styles.toggleImage} />
              </View>
            </Pressable>
            <View style={styles.headerRule} />
            <Pressable
              testID="schedule-button"
              accessibilityRole="button"
              accessibilityLabel={label}
              onPress={() => setMenuOpen((open) => !open)}
              style={styles.schedule}
            >
              <Text testID="schedule-label" numberOfLines={1} style={styles.scheduleLine}>
                {label}
              </Text>
              <Text style={styles.chevron}>{menuOpen ? '▴' : '▾'}</Text>
            </Pressable>
          </View>
          {menuOpen ? (
            <View testID="schedule-menu" style={styles.menu}>
              {SCHEDULES.map((option) => {
                const selected = option.id === state?.scheduleId;
                return (
                  <Pressable
                    key={option.id}
                    testID={`schedule-${option.id}`}
                    accessibilityRole="button"
                    onPress={() => {
                      setMenuOpen(false);
                      mutate('/v1/schedule', { scheduleId: option.id });
                    }}
                    style={[styles.menuRow, selected && styles.menuRowSelected]}
                  >
                    <Text style={[styles.menuText, selected && styles.menuTextSelected]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>

        {menuOpen ? <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} /> : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.contacts}
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
                accessibilityState={{ selected }}
                onPress={() => mutate('/v1/open', { contactId: item.id })}
                style={styles.contact}
              >
                <Image
                  ref={(node) => {
                    avatarRefs.current[item.id] = node;
                  }}
                  onLayout={syncTail}
                  source={PERSON_AVATAR}
                  resizeMode="cover"
                  style={styles.avatar}
                />
                <View style={[styles.contactMark, selected && styles.contactMarkOn]} />
                <Text style={[styles.contactName, selected && styles.contactNameSelected]}>{item.id}</Text>
              </Pressable>
            );
          })}
          <Pressable
            testID="add-person"
            accessibilityRole="button"
            accessibilityLabel="Add a person"
            onPress={onSearch}
            style={styles.contact}
          >
            <View style={styles.plus}>
              <Text style={styles.plusMark}>+</Text>
            </View>
            <View style={styles.contactMark} />
            <Text style={styles.contactName}>Add</Text>
          </Pressable>
        </ScrollView>

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
              const label = item.id === 'timely' ? 'timely but\nno rush' : item.label;
              return (
                <Pressable
                  key={item.id}
                  testID={`intent-${item.id}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setIntent(item.id)}
                  style={[styles.intent, index === INTENTS.length - 1 && styles.intentLast]}
                >
                  <Text style={[styles.intentText, selected && styles.intentTextSelected]}>{label}</Text>
                  {selected ? <View style={styles.intentBar} /> : null}
                </Pressable>
              );
            })}
          </View>
          <View style={styles.composer}>
            <TextInput
              testID="composer"
              value={draft}
              onChangeText={onChangeDraft}
              placeholder="Message"
              placeholderTextColor="#8a8a8a"
              multiline
              style={styles.input}
            />
            <Pressable
              testID="send"
              accessibilityRole="button"
              accessibilityLabel="Send"
              disabled={!canSend}
              onPress={() => send()}
              style={[styles.send, canSend && styles.sendReady]}
            >
              <Text style={[styles.sendText, canSend && styles.sendTextReady]}>Send</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ message, tailX }) {
  const incoming = message.direction === 'in';
  const [width, setWidth] = useState(0);
  if (!incoming) {
    return (
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{message.body}</Text>
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
      <Text style={styles.bubbleText}>{message.body}</Text>
    </View>
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
  toggle: { alignItems: 'center' },
  toggleRing: { borderWidth: 1, borderColor: ink, borderRadius: 22, padding: 2, backgroundColor: paper },
  toggleRingOn: { borderWidth: 2, backgroundColor: '#eadcc4' },
  toggleImage: { width: 36, height: 36, borderRadius: 18 },
  headerRule: { width: 1, alignSelf: 'stretch', backgroundColor: ink },
  schedule: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  scheduleLine: { flex: 1, color: ink, fontSize: 16, lineHeight: 20 },
  chevron: { color: ink, fontSize: 16, lineHeight: 20 },
  menu: { borderBottomWidth: 1, borderBottomColor: ink, backgroundColor: paper },
  menuRow: { paddingVertical: 13, paddingHorizontal: 18, borderTopWidth: 1, borderTopColor: ink },
  menuRowSelected: { backgroundColor: '#f6f3ee' },
  menuText: { color: ink, fontSize: 16, lineHeight: 21 },
  menuTextSelected: { fontWeight: '700' },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 1 },
  contactStrip: { flexGrow: 0, flexShrink: 0, borderBottomWidth: 1, borderBottomColor: ink, zIndex: 0 },
  contacts: { paddingHorizontal: 12, paddingTop: 14, paddingBottom: 10, gap: 18 },
  contact: { width: 68, alignItems: 'center' },
  avatar: { width: 54, height: 54, borderRadius: 27, borderWidth: 1, borderColor: ink, backgroundColor: paper },
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
  contactMark: { marginTop: 7, width: 44, height: 3, backgroundColor: 'transparent' },
  contactMarkOn: { backgroundColor: ink },
  contactName: { marginTop: 4, fontSize: 12, lineHeight: 15, color: ink },
  contactNameSelected: { fontWeight: '700' },
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
  composer: { flexDirection: 'row', alignItems: 'stretch', minHeight: 76 },
  input: {
    flex: 1,
    minHeight: 76,
    maxHeight: 140,
    borderWidth: 0,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 17,
    lineHeight: 22,
    color: ink,
    outlineStyle: 'none',
  },
  send: { width: 76, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: ink },
  sendReady: { backgroundColor: ink },
  sendText: { color: '#9a9a9a', fontSize: 15 },
  sendTextReady: { color: paper },
});
