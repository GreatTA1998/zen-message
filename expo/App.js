import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { api, inboxPath } from './src/api';
import { LoginView } from './src/LoginView';
import { OnboardingView } from './src/OnboardingView';
import { listenForDigest, prepareNotifications, runNotificationEffects } from './src/notify';
import { paper } from './src/chatTheme';
import { ChatScreen } from './src/ChatScreen';
import { hasConfusingCharacter, isCode, normalizeCode } from './src/people';
import {
  clearOutbox,
  loadSession,
  saveDraft,
  savePickedContact,
  saveSession,
} from './src/session';
import { deleteFirebaseUser } from './src/accountAuth';
import { restoreAuthSubject } from './src/firebaseAuth';
import { finishSignIn } from './src/signIn';
import { readExpoPushToken } from './src/push';

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

const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: paper },
  provider: { flex: 1, backgroundColor: paper },
  frame: { flex: 1, backgroundColor: paper },
});
