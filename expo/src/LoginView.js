import { useEffect } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { LOGO } from './contacts';
import { completeGoogleRedirect, signInWithGoogle } from './googleSignIn';

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

  return (
    <View style={styles.screen}>
      <Image source={LOGO} style={styles.mark} />
      <Text style={styles.title}>Zen Message</Text>
      {Platform.OS === 'web' ? <GoogleButton onSubject={onSubject} /> : <AppleButton onSubject={onSubject} />}
      {notice ? (
        <Text testID="login-notice" style={styles.notice}>
          {notice}
        </Text>
      ) : null}
    </View>
  );
}

function GoogleButton({ onSubject }) {
  return (
    <Pressable
      testID="google-login"
      accessibilityRole="button"
      accessibilityLabel="Sign in with Google"
      onPress={() => signInWithGoogle().then((result) => {
        if (result?.cancelled || result?.pending) return;
        onSubject(result);
      })}
      style={[styles.provider, styles.google]}
    >
      <Text style={styles.providerText}>Sign in with Google</Text>
    </Pressable>
  );
}

function AppleButton({ onSubject }) {
  return (
    <Pressable
      testID="apple-login"
      accessibilityRole="button"
      accessibilityLabel="Sign in with Apple"
      onPress={() => signInWithApple(onSubject)}
      style={[styles.provider, styles.apple]}
    >
      <Text style={[styles.providerText, styles.appleText]}>Sign in with Apple</Text>
    </Pressable>
  );
}

async function signInWithApple(onSubject) {
  try {
    const available = Platform.OS === 'ios' && (await AppleAuthentication.isAvailableAsync());
    if (!available) {
      onSubject({ provider: 'apple', missing: 'apple_capability' });
      return;
    }
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (credential?.user) onSubject({ provider: 'apple', subject: credential.user });
  } catch (error) {
    if (error?.code === 'ERR_REQUEST_CANCELED') return;
    onSubject({ provider: 'apple', missing: 'apple_capability' });
  }
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
