import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { LOGO } from './contacts';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';

export function LoginView({ onSubject, notice }) {
  return (
    <View style={styles.screen}>
      <Image source={LOGO} style={styles.mark} />
      <Text style={styles.title}>Zen Message</Text>
      <AppleButton onSubject={onSubject} />
      <GoogleButton onSubject={onSubject} />
      {notice ? (
        <Text testID="login-notice" style={styles.notice}>
          {notice}
        </Text>
      ) : null}
    </View>
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

function GoogleButton({ onSubject }) {
  if (!GOOGLE_WEB_CLIENT_ID && !GOOGLE_IOS_CLIENT_ID && !GOOGLE_ANDROID_CLIENT_ID) {
    return (
      <Pressable
        testID="google-login"
        accessibilityRole="button"
        accessibilityLabel="Sign in with Google"
        onPress={() => onSubject({ provider: 'google', missing: 'google_oauth_client' })}
        style={[styles.provider, styles.google]}
      >
        <Text style={styles.providerText}>Sign in with Google</Text>
      </Pressable>
    );
  }
  return <ConfiguredGoogleButton onSubject={onSubject} />;
}

function ConfiguredGoogleButton({ onSubject }) {
  const [request, , promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID || undefined,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || undefined,
  });
  return (
    <Pressable
      testID="google-login"
      accessibilityRole="button"
      accessibilityLabel="Sign in with Google"
      disabled={!request}
      onPress={async () => {
        const result = await promptAsync();
        const subject = result?.authentication?.idToken || result?.params?.id_token;
        if (result?.type === 'success' && subject) onSubject({ provider: 'google', subject });
      }}
      style={[styles.provider, styles.google]}
    >
      <Text style={styles.providerText}>Sign in with Google</Text>
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
  apple: {
    backgroundColor: ink,
    borderColor: ink,
  },
  google: {
    backgroundColor: paper,
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
