import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LOGO } from './contacts';
import { firstName } from './people';

export function OnboardingView({ userId, onSaveNickname, onContinue }) {
  const [step, setStep] = useState('nickname');
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const ready = firstName(value).length > 0;

  async function submitNickname() {
    if (!ready || busy) return;
    setBusy(true);
    setError('');
    try {
      await onSaveNickname(firstName(value));
      setStep('share');
    } catch {
      setError('Could not save your nickname.');
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    await Clipboard.setStringAsync(userId);
  }

  if (step === 'share') {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>You&apos;re {userId}</Text>
        <Text style={styles.hint}>Send this to your friend to add you.</Text>
        <View style={styles.shareRow}>
          <Text testID="onboarding-id" selectable style={styles.code}>
            {userId}
          </Text>
          <Pressable
            testID="onboarding-copy"
            accessibilityRole="button"
            accessibilityLabel="Copy your ID"
            onPress={copy}
            style={styles.copy}
          >
            <Feather name="copy" size={22} color={ink} />
          </Pressable>
        </View>
        <Pressable
          testID="onboarding-continue"
          accessibilityRole="button"
          accessibilityLabel="Continue"
          onPress={onContinue}
          style={styles.continue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Image source={LOGO} style={styles.mark} />
      <Text style={styles.title}>Choose a nickname</Text>
      <Text style={styles.hint}>This shows under your bird.</Text>
      <TextInput
        testID="onboarding-nickname"
        value={value}
        autoCorrect={false}
        autoCapitalize="words"
        maxLength={18}
        onChangeText={setValue}
        placeholder="Nickname"
        placeholderTextColor="#8a8a8a"
        style={styles.input}
        onSubmitEditing={submitNickname}
        returnKeyType="done"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        testID="onboarding-submit"
        accessibilityRole="button"
        accessibilityLabel="Submit nickname"
        accessibilityState={{ disabled: !ready || busy }}
        disabled={!ready || busy}
        onPress={submitNickname}
        style={[styles.submit, ready && styles.submitReady]}
      >
        <Text style={[styles.submitText, ready && styles.submitTextReady]}>Submit</Text>
      </Pressable>
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
    alignItems: 'stretch',
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
    alignSelf: 'center',
  },
  title: { color: ink, fontSize: 24, lineHeight: 30, fontWeight: '600', textAlign: 'center' },
  hint: { color: ink, fontSize: 16, lineHeight: 21, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: ink,
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 14,
    fontSize: 18,
    color: ink,
  },
  submit: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitReady: { backgroundColor: ink, borderColor: ink },
  submitText: { color: '#9a9a9a', fontSize: 17 },
  submitTextReady: { color: paper },
  error: { color: '#b00020', fontSize: 15, textAlign: 'center' },
  shareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  code: { color: ink, fontSize: 40, letterSpacing: 4, fontVariant: ['tabular-nums'] },
  copy: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  continue: {
    minHeight: 48,
    backgroundColor: ink,
    borderWidth: 1,
    borderColor: ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: { color: paper, fontSize: 17 },
});
