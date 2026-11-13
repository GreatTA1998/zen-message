import { useEffect } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LOGO } from './contacts';
import { completeGoogleRedirect, signInWithGoogle } from './googleSignIn';
import { signInWithApple } from './appleSignIn';

const dualLogin = Platform.OS === 'web' || Platform.OS === 'ios';

export function LoginView({ onSubject, notice }) {
  useEffect(() => {
    if (Platform.OS !== 'web') return undefined;
    let alive = true;
    completeGoogleRedirect()
      .then((result) => {
        if (alive && result?.subject) onSubject(result);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [onSubject]);

  async function handleGoogle() {
    const result = await signInWithGoogle();
    if (result?.cancelled || result?.pending || result?.missing) {
      if (result?.missing) onSubject(result);
      return;
    }
    onSubject(result);
  }

  async function handleApple() {
    const result = await signInWithApple();
    if (result?.cancelled || result?.missing) {
      if (result?.missing) onSubject(result);
      return;
    }
    onSubject(result);
  }

  return (
    <View style={styles.screen}>
      <Image source={LOGO} style={styles.mark} />
      <Text style={styles.title}>Zen Message</Text>
      {dualLogin ? (
        <View style={styles.stack}>
          <Pressable
            testID="google-login"
            accessibilityRole="button"
            accessibilityLabel="Sign in with Google"
            onPress={handleGoogle}
            style={[styles.provider, styles.google]}
          >
            <Text style={styles.providerText}>Sign in with Google</Text>
          </Pressable>
          <Pressable
            testID="apple-login"
            accessibilityRole="button"
            accessibilityLabel="Sign in with Apple"
            onPress={handleApple}
            style={[styles.provider, styles.apple]}
          >
            <Text style={[styles.providerText, styles.appleText]}>Sign in with Apple</Text>
          </Pressable>
        </View>
      ) : null}
      {notice ? (
        <Text testID="login-notice" style={styles.notice}>
          {notice}
        </Text>
      ) : null}
    </View>
  );
}

const ink = '#1c1c1c';
const paper = '#fff';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: paper,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 14,
  },
  stack: {
    width: '100%',
    gap: 12,
  },
  mark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: ink,
  },
  title: {
    color: ink,
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 8,
  },
  provider: {
    width: '100%',
    minHeight: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  google: {
    backgroundColor: paper,
    borderColor: ink,
  },
  apple: {
    backgroundColor: ink,
    borderColor: ink,
  },
  providerText: {
    color: ink,
    fontSize: 17,
  },
  appleText: {
    color: paper,
  },
  notice: {
    color: ink,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
});
