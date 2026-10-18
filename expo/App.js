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
import { LoginView, UsernameView } from './src/LoginView';
import { listenForDigest, prepareNotifications, runNotificationEffects } from './src/notify';
import { readExpoPushToken } from './src/push';
import { SearchView } from './src/SearchView';
import { loadSession, saveSession } from './src/session';

function scheduleLines(scheduleId) {
  if (scheduleId === 'daily-1-7') return ['Batched daily', '1pm, 7pm'];
  if (scheduleId === 'daily-8') return ['Daily', '8am'];
  if (scheduleId === 'hourly') return ['Hourly'];
  return ['Every 3 hours'];
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
      } catch (error) {
        if (error.code === 'username_required') {
          setUser({ username: '' });
        } else {
          tokenRef.current = null;
          setToken(null);
          await saveSession(null);
        }
      }
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [refresh]);

  useEffect(() => {
    if (!token || !user?.username) return undefined;
    const handle = setInterval(() => {
      refresh().catch(() => {});
    }, 4000);
    return () => clearInterval(handle);
  }, [refresh, token, user?.username]);

  useEffect(() => {
    if (!token || !user?.username) return undefined;
    let alive = true;
    (async () => {
      const pushToken = await readExpoPushToken();
      if (!alive || !pushToken) return;
      await api('/v1/push-token', { token, method: 'POST', body: { token: pushToken } });
    })();
    return () => {
      alive = false;
    };
  }, [token, user?.username]);

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
    if (session.user.username) await refresh();
  }

  async function onUsername(value) {
    try {
      const result = await api('/v1/username', { token, method: 'POST', body: { username: value } });
      setUser(result.user);
      await refresh();
      return '';
    } catch (error) {
      if (error.code === 'username_taken') return 'That username is taken.';
      return 'Use 3–20 letters, numbers, or underscores.';
    }
  }

  const onSearch = useCallback(
    async (query) => {
      if (!query.trim()) return [];
      const result = await api(`/v1/users?q=${encodeURIComponent(query)}`, { token });
      return result.people;
    },
    [token]
  );

  async function onAdd(username) {
    const next = await api('/v1/contacts', { token, method: 'POST', body: { username } });
    applyInbox(next);
    setSearching(false);
  }

  if (!ready) return <View style={styles.boot} />;

  let body = null;
  if (!token) {
    body = <LoginView onSubject={onSubject} notice={notice} />;
  } else if (!user?.username) {
    body = <UsernameView onSubmit={onUsername} />;
  } else if (searching) {
    body = <SearchView onClose={() => setSearching(false)} onSearch={onSearch} onAdd={onAdd} />;
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
  const state = inbox?.state;
  const contacts = inbox?.contacts ?? [];
  const contact = contacts.find((item) => item.id === state?.contactId) ?? null;
  const messages = contact && state ? threadMessages(state.messages, contact.id) : [];
  const schedule = scheduleById(state?.scheduleId);
  const relaxed = state?.mode === 'relaxed';
  const lines = scheduleLines(schedule.id);
  const canSend = Boolean(contact) && draft.trim().length > 0;

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
              <Text testID="mode-label" style={[styles.toggleLabel, relaxed && styles.toggleLabelOn]}>
                {relaxed ? 'Relaxed' : 'Batched'}
              </Text>
            </Pressable>
            <View style={styles.headerRule} />
            <Pressable
              testID="schedule-button"
              accessibilityRole="button"
              accessibilityLabel={schedule.label}
              onPress={() => setMenuOpen((open) => !open)}
              style={styles.schedule}
            >
              <View style={styles.scheduleCopy}>
                {lines.map((line) => (
                  <Text key={line} style={styles.scheduleLine}>
                    {line}
                  </Text>
                ))}
              </View>
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
        >
          {contacts.map((item) => {
            const selected = item.id === contact?.id;
            return (
              <Pressable
                key={item.id}
                testID={`contact-${item.username}`}
                accessibilityRole="button"
                accessibilityLabel={item.username}
                accessibilityState={{ selected }}
                onPress={() => mutate('/v1/open', { contactId: item.id })}
                style={styles.contact}
              >
                <Image source={PERSON_AVATAR} resizeMode="cover" style={styles.avatar} />
                <View style={[styles.contactMark, selected && styles.contactMarkOn]} />
                <Text style={[styles.contactName, selected && styles.contactNameSelected]}>{item.username}</Text>
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

        <ScrollView
          ref={threadRef}
          style={styles.thread}
          contentContainerStyle={styles.threadContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => threadRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((message) => (
            <View key={message.id} style={[styles.bubble, message.direction === 'in' && styles.bubbleIn]}>
              <Text style={styles.bubbleText}>{message.body}</Text>
            </View>
          ))}
        </ScrollView>

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
    paddingVertical: 12,
    gap: 14,
  },
  toggle: { width: 72, alignItems: 'center', gap: 5 },
  toggleRing: { borderWidth: 1, borderColor: ink, borderRadius: 22, padding: 2, backgroundColor: paper },
  toggleRingOn: { borderWidth: 2, backgroundColor: '#eadcc4' },
  toggleImage: { width: 36, height: 36, borderRadius: 18 },
  toggleLabel: { fontSize: 12, color: ink, letterSpacing: 0.2 },
  toggleLabelOn: { fontWeight: '700' },
  headerRule: { width: 1, alignSelf: 'stretch', backgroundColor: ink },
  schedule: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48 },
  scheduleCopy: { flex: 1, gap: 1 },
  scheduleLine: { color: ink, fontSize: 17, lineHeight: 21 },
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
  threadContent: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 20, gap: 12 },
  bubble: {
    alignSelf: 'flex-end',
    maxWidth: '84%',
    borderWidth: 1,
    borderColor: ink,
    borderRadius: 18,
    borderBottomRightRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: paper,
  },
  bubbleIn: { alignSelf: 'flex-start', borderBottomRightRadius: 18, borderBottomLeftRadius: 5 },
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
