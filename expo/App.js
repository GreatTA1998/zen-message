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

export default function App() {
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

  function send() {
    const body = draft.trim();
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

  if (!ready) {
    return <View style={styles.boot} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <View style={styles.phone}>
        <View style={styles.top}>
          <View style={styles.header}>
            <Pressable
              testID="mode-toggle"
              accessibilityRole="button"
              accessibilityLabel={state.mode === 'relaxed' ? 'Relaxed' : 'Batched'}
              onPress={() => apply({ type: 'set-mode', mode: state.mode === 'relaxed' ? 'batched' : 'relaxed' })}
              style={[styles.toggle, state.mode === 'relaxed' && styles.toggleRelaxed]}
            >
              <Image source={LOGO} style={styles.toggleImage} />
              <Text testID="mode-label" style={styles.toggleLabel}>
                {state.mode === 'relaxed' ? 'Relaxed' : 'Batched'}
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
              <Text style={styles.scheduleLabel}>{schedule.label}</Text>
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
                style={[styles.contact, selected && styles.contactSelected]}
              >
                <Image source={item.avatar} style={styles.avatar} />
                <Text style={[styles.contactName, selected && styles.contactNameSelected]}>{item.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView
          ref={threadRef}
          style={styles.thread}
          contentContainerStyle={styles.threadContent}
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
                  style={[
                    styles.intent,
                    index === INTENTS.length - 1 && styles.intentLast,
                    selected && styles.intentSelected,
                  ]}
                >
                  <Text style={[styles.intentText, selected && styles.intentTextSelected]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.composer}>
            <TextInput
              testID="composer"
              value={draft}
              onChangeText={setDraft}
              placeholder="Message"
              placeholderTextColor="#8d8d8d"
              multiline
              style={styles.input}
              onKeyPress={(event) => {
                if (event.nativeEvent.key === 'Enter' && !event.nativeEvent.shiftKey) {
                  send();
                }
              }}
            />
            <Pressable
              testID="send"
              accessibilityRole="button"
              accessibilityLabel="Send"
              disabled={!draft.trim()}
              onPress={send}
              style={[styles.send, !draft.trim() && styles.sendDisabled]}
            >
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const ink = '#1c1c1c';

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: '#fff',
  },
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  phone: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
  },
  top: {
    zIndex: 2,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: ink,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  toggle: {
    width: 64,
    alignItems: 'center',
    gap: 4,
  },
  toggleRelaxed: {
    opacity: 1,
  },
  toggleImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: ink,
    backgroundColor: '#fff',
  },
  toggleLabel: {
    fontSize: 11,
    color: ink,
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
    gap: 8,
  },
  scheduleLabel: {
    flex: 1,
    color: ink,
    fontSize: 16,
    lineHeight: 20,
  },
  chevron: {
    color: ink,
    fontSize: 14,
  },
  menu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: ink,
    zIndex: 3,
  },
  menuRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: ink,
  },
  menuRowSelected: {
    backgroundColor: '#f3f3f3',
  },
  menuText: {
    color: ink,
    fontSize: 16,
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
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 16,
  },
  contact: {
    alignItems: 'center',
    width: 64,
    paddingBottom: 6,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  contactSelected: {
    borderBottomColor: ink,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: ink,
    backgroundColor: '#fff',
  },
  contactName: {
    marginTop: 4,
    fontSize: 12,
    color: ink,
  },
  contactNameSelected: {
    fontWeight: '700',
  },
  thread: {
    flex: 1,
  },
  threadContent: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  bubble: {
    alignSelf: 'flex-end',
    maxWidth: '78%',
    borderWidth: 1,
    borderColor: ink,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  bubbleText: {
    color: ink,
    fontSize: 16,
    lineHeight: 21,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: ink,
    backgroundColor: '#fff',
  },
  intents: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: ink,
  },
  intent: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRightWidth: 1,
    borderRightColor: ink,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  intentLast: {
    borderRightWidth: 0,
  },
  intentSelected: {
    borderBottomColor: ink,
  },
  intentText: {
    color: ink,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 16,
  },
  intentTextSelected: {
    fontWeight: '700',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: ink,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: ink,
    outlineStyle: 'none',
  },
  send: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: ink,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ink,
  },
  sendDisabled: {
    opacity: 0.35,
  },
  sendText: {
    color: '#fff',
    fontSize: 15,
  },
});
