import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LOGO } from './contacts';
import { completeGoogleRedirect, signInWithGoogle } from './googleSignIn';
import { signInWithApple } from './appleSignIn';
import {
  PhoneRecaptcha,
  confirmPhoneVerification,
  sendPhoneVerification,
} from './phoneSignIn';
import { normalizePhoneInput } from './phoneNumber';

const dualLogin = Platform.OS === 'web' || Platform.OS === 'ios';

export function LoginView({ onSubject, notice }) {
  const [mode, setMode] = useState('providers');
  const [phoneStep, setPhoneStep] = useState('number');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [busy, setBusy] = useState(false);
  const [phoneNotice, setPhoneNotice] = useState('');
  const recaptchaRef = useRef(null);

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

  function resetPhone() {
    setMode('providers');
    setPhoneStep('number');
    setPhoneRaw('');
    setCode('');
    setConfirmation(null);
    setPhoneNotice('');
    setBusy(false);
  }

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

  async function handlePhoneContinue() {
    const phoneNumber = normalizePhoneInput(phoneRaw);
    if (!phoneNumber) {
      setPhoneNotice('Enter a valid phone number with country code.');
      return;
    }
    setBusy(true);
    setPhoneNotice('');
    const verifier = Platform.OS === 'ios' ? recaptchaRef : undefined;
    const result = await sendPhoneVerification(phoneNumber, verifier);
    setBusy(false);
    if (result?.missing === 'phone_invalid') {
      setPhoneNotice('That phone number could not be used.');
      return;
    }
    if (result?.missing || !result?.confirmation) {
      setPhoneNotice('Phone sign-in is not available right now.');
      return;
    }
    setConfirmation(result.confirmation);
    setPhoneStep('code');
  }

  async function handlePhoneVerify(nextCode) {
    const digits = String(nextCode ?? code).replace(/\D/g, '');
    if (digits.length < 6) return;
    setBusy(true);
    setPhoneNotice('');
    const result = await confirmPhoneVerification(confirmation, digits);
    setBusy(false);
    if (result?.missing === 'phone_code_invalid') {
      setPhoneNotice('That code did not work. Try again.');
      return;
    }
    if (result?.missing || !result?.subject) {
      setPhoneNotice('Could not verify the code.');
      return;
    }
    onSubject(result);
  }

  useEffect(() => {
    if (phoneStep !== 'code' || busy || !confirmation) return undefined;
    const digits = code.replace(/\D/g, '');
    if (digits.length !== 6) return undefined;
    const handle = setTimeout(() => {
      handlePhoneVerify(digits);
    }, 120);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, phoneStep, busy, confirmation]);

  const displayNotice = mode === 'phone' ? phoneNotice || notice : notice;

  return (
    <View style={styles.screen}>
      {Platform.OS === 'ios' ? <PhoneRecaptcha recaptchaRef={recaptchaRef} /> : null}
      {Platform.OS === 'web' ? (
        <View nativeID="phone-recaptcha-anchor" style={styles.recaptchaHost} accessibilityElementsHidden />
      ) : null}
      <Image source={LOGO} style={styles.mark} />
      <Text style={styles.title}>Zen Message</Text>
      {dualLogin && mode === 'providers' ? (
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
          <Pressable
            testID="phone-login"
            accessibilityRole="button"
            accessibilityLabel="Sign in with phone"
            onPress={() => {
              setMode('phone');
              setPhoneStep('number');
              setPhoneNotice('');
            }}
            style={[styles.provider, styles.google]}
          >
            <Text style={styles.providerText}>Sign in with phone</Text>
          </Pressable>
        </View>
      ) : null}
      {dualLogin && mode === 'phone' ? (
        <View style={styles.stack}>
          <Pressable
            testID="phone-back"
            accessibilityRole="button"
            accessibilityLabel="Back to sign-in options"
            onPress={resetPhone}
            style={styles.back}
          >
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          {phoneStep === 'number' ? (
            <>
              <TextInput
                testID="phone-number-input"
                value={phoneRaw}
                onChangeText={setPhoneRaw}
                placeholder="+1 555 000 0000"
                placeholderTextColor="#9a9a9a"
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                autoComplete="tel"
                style={styles.field}
                editable={!busy}
              />
              <Pressable
                testID="phone-continue"
                accessibilityRole="button"
                accessibilityLabel="Continue with phone number"
                onPress={handlePhoneContinue}
                disabled={busy}
                style={[styles.provider, styles.google, busy ? styles.disabled : null]}
              >
                <Text style={styles.providerText}>{busy ? 'Sending…' : 'Continue'}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.hint}>Enter the 6-digit code we texted you.</Text>
              <TextInput
                testID="phone-code-input"
                value={code}
                onChangeText={setCode}
                placeholder="000000"
                placeholderTextColor="#9a9a9a"
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                maxLength={6}
                style={styles.field}
                editable={!busy}
              />
              <Pressable
                testID="phone-verify"
                accessibilityRole="button"
                accessibilityLabel="Verify code"
                onPress={() => handlePhoneVerify(code)}
                disabled={busy}
                style={[styles.provider, styles.google, busy ? styles.disabled : null]}
              >
                <Text style={styles.providerText}>{busy ? 'Verifying…' : 'Verify'}</Text>
              </Pressable>
            </>
          )}
        </View>
      ) : null}
      {displayNotice ? (
        <Text testID="login-notice" style={styles.notice}>
          {displayNotice}
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
  back: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  backText: {
    color: ink,
    fontSize: 15,
    opacity: 0.65,
  },
  field: {
    width: '100%',
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ink,
    paddingHorizontal: 14,
    fontSize: 17,
    color: ink,
    backgroundColor: paper,
  },
  hint: {
    color: ink,
    fontSize: 15,
    lineHeight: 20,
    opacity: 0.75,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.55,
  },
  notice: {
    color: ink,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  recaptchaHost: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    overflow: 'hidden',
  },
});