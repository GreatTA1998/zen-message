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
import { CONTACTS, LOGO } from './src/contacts';
import {
  INTENTS,
  SCHEDULES,
  createState,
  digestPlan,
  reduce,
  sanitize,
  scheduleById,
  threadMessages,
} from './src/delivery';
import { listenForDigest, prepareNotifications, runNotificationEffects } from './src/notify';
import { loadState, saveState } from './src/storage';

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function scheduleLines(scheduleId) {
  if (scheduleId === 'daily-1-7') return ['Batched daily', '1pm, 7pm'];
  if (scheduleId === 'daily-8') return ['Daily', '8am'];
  if (scheduleId === 'hourly') return ['Hourly'];
  return ['Every 3 hours'];
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.provider}>
      <StatusBar style="dark" />
      <ChatScreen />
    </SafeAreaProvider>
  );
}

function ChatScreen() {
  const [state, setState] = useState(createState);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState('');
  const [intent, setIntent] = useState('anytime');
  const [menuOpen, setMenuOpen] = useState(false);
  const stateRef = useRef(state);
  const threadRef = useRef(null);
  const queue = useRef(Promise.resolve());

  const commit = useCallback((next) => {
    stateRef.current = next;
    setState(next);
    return saveState(next);
  }, []);

  const apply = useCallback(
    async (action) => {
      const run = queue.current.then(async () => {
        const current = stateRef.current;
        const { state: next, effects } = reduce(current, { ...action, now: Date.now() });
        await commit(next);
        const { scheduled } = await runNotificationEffects(effects);
        if (!scheduled) return;
        const latest = stateRef.current;
        if (!latest.digest || latest.digest.presented || latest.digest.at !== next.digest?.at) return;
        await commit({
          ...latest,
          digest: { ...latest.digest, platformScheduled: true },
        });
      });
      queue.current = run.catch(() => {});
      return run;
    },
    [commit]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      await prepareNotifications();
      const loaded = sanitize(await loadState());
      if (!CONTACTS.some((contact) => contact.id === loaded.contactId)) {
        loaded.contactId = CONTACTS[0].id;
      }
      const { state: released, effects } = reduce(loaded, { type: 'release', now: Date.now() });
      const extra = [];
      if (released.digest && !released.digest.presented && !released.digest.platformScheduled) {
        const held = released.messages.filter((item) => released.digest.messageIds.includes(item.id));
        if (held.length) extra.push({ type: 'schedule-digest', at: released.digest.at, plan: digestPlan(held) });
      }
      if (!alive) return;
      await commit(released);
      const { scheduled } = await runNotificationEffects([...effects, ...extra]);
      if (scheduled && alive) {
        const latest = stateRef.current;
        if (latest.digest && !latest.digest.presented) {
          await commit({ ...latest, digest: { ...latest.digest, platformScheduled: true } });
        }
      }
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [commit]);

  useEffect(() => {
    const subscription = listenForDigest(() => {
      apply({ type: 'shown' });
    });
    return () => subscription.remove();
  }, [apply]);

  useEffect(() => {
    if (!state.digest || state.digest.presented) return undefined;
    const delay = Math.max(0, state.digest.at - Date.now());
    const handle = setTimeout(() => {
      apply({ type: 'release' });
    }, delay);
    return () => clearTimeout(handle);
  }, [apply, state.digest]);

  const contact = CONTACTS.find((item) => item.id === state.contactId) ?? CONTACTS[0];
  const messages = threadMessages(state.messages, contact.id);
  const schedule = scheduleById(state.scheduleId);
  const relaxed = state.mode === 'relaxed';
  const lines = scheduleLines(schedule.id);
  const canSend = draft.trim().length > 0;

  function send(text = draft) {
    const body = text.trim();
    if (!body) return;
    setDraft('');
    apply({
      type: 'send',
      id: uid(),
      body,
      intent,
      contactId: contact.id,
      contactName: contact.name,
    });
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

  if (!ready) {
    return <View style={styles.boot} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.phone} edges={['top', 'bottom']}>
        <View style={styles.top}>
          <View style={styles.header}>
            <Pressable
              testID="mode-toggle"
              accessibilityRole="button"
              accessibilityLabel={relaxed ? 'Relaxed' : 'Batched'}
              hitSlop={6}
              onPress={() => apply({ type: 'set-mode', mode: relaxed ? 'batched' : 'relaxed' })}
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
                const selected = option.id === state.scheduleId;
                return (
                  <Pressable
                    key={option.id}
                    testID={`schedule-${option.id}`}
                    accessibilityRole="button"
                    onPress={() => {
                      setMenuOpen(false);
                      apply({ type: 'set-schedule', scheduleId: option.id });
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
          {CONTACTS.map((item) => {
            const selected = item.id === contact.id;
            return (
              <Pressable
                key={item.id}
                testID={`contact-${item.id}`}
                accessibilityRole="button"
                accessibilityLabel={item.name}
                accessibilityState={{ selected }}
                onPress={() => apply({ type: 'select-contact', contactId: item.id })}
                style={styles.contact}
              >
                <Image source={item.avatar} resizeMode="cover" style={styles.avatar} />
                <View style={[styles.contactMark, selected && styles.contactMarkOn]} />
                <Text style={[styles.contactName, selected && styles.contactNameSelected]}>{item.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView
          ref={threadRef}
          style={styles.thread}
          contentContainerStyle={styles.threadContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => threadRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((message) => (
            <View key={message.id} style={styles.bubble}>
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const ink = '#1c1c1c';
const paper = '#fff';

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: paper,
  },
  provider: {
    flex: 1,
    backgroundColor: paper,
  },
  root: {
    flex: 1,
    backgroundColor: paper,
    alignItems: 'center',
  },
  phone: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: paper,
  },
  top: {
    zIndex: 2,
    backgroundColor: paper,
  },
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
  toggle: {
    width: 72,
    alignItems: 'center',
    gap: 5,
  },
  toggleRing: {
    borderWidth: 1,
    borderColor: ink,
    borderRadius: 22,
    padding: 2,
    backgroundColor: paper,
  },
  toggleRingOn: {
    borderWidth: 2,
    backgroundColor: '#eadcc4',
  },
  toggleImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  toggleLabel: {
    fontSize: 12,
    color: ink,
    letterSpacing: 0.2,
  },
  toggleLabelOn: {
    fontWeight: '700',
  },
  headerRule: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: ink,
  },
  schedule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
  },
  scheduleCopy: {
    flex: 1,
    gap: 1,
  },
  scheduleLine: {
    color: ink,
    fontSize: 17,
    lineHeight: 21,
  },
  chevron: {
    color: ink,
    fontSize: 16,
    lineHeight: 20,
  },
  menu: {
    borderBottomWidth: 1,
    borderBottomColor: ink,
    backgroundColor: paper,
  },
  menuRow: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: ink,
  },
  menuRowSelected: {
    backgroundColor: '#f6f3ee',
  },
  menuText: {
    color: ink,
    fontSize: 16,
    lineHeight: 21,
  },
  menuTextSelected: {
    fontWeight: '700',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  contactStrip: {
    flexGrow: 0,
    flexShrink: 0,
    borderBottomWidth: 1,
    borderBottomColor: ink,
    zIndex: 0,
  },
  contacts: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 18,
  },
  contact: {
    width: 68,
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: ink,
    backgroundColor: paper,
  },
  contactMark: {
    marginTop: 7,
    width: 44,
    height: 3,
    backgroundColor: 'transparent',
  },
  contactMarkOn: {
    backgroundColor: ink,
  },
  contactName: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 15,
    color: ink,
  },
  contactNameSelected: {
    fontWeight: '700',
  },
  thread: {
    flex: 1,
  },
  threadContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
    gap: 12,
  },
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
  bubbleText: {
    color: ink,
    fontSize: 17,
    lineHeight: 22,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: ink,
    backgroundColor: paper,
  },
  intents: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: ink,
  },
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
  intentLast: {
    borderRightWidth: 0,
  },
  intentBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: ink,
  },
  intentText: {
    color: ink,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
  },
  intentTextSelected: {
    fontWeight: '700',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 76,
  },
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
  send: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: ink,
  },
  sendReady: {
    backgroundColor: ink,
  },
  sendText: {
    color: '#9a9a9a',
    fontSize: 15,
  },
  sendTextReady: {
    color: paper,
  },
});
