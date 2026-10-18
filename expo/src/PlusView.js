import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { CODE_LENGTH, hasConfusingCharacter, isCode, normalizeCode } from './people';

export function PlusView({ code, onAdd }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const normalized = normalizeCode(value);
  const canAdd = isCode(normalized) && normalized !== code;

  async function copy() {
    await Clipboard.setStringAsync(code);
    setCopied(true);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <Text style={styles.label}>Your ID</Text>
        <View style={styles.share}>
          <Text testID="my-code" selectable style={styles.code}>
            {code}
          </Text>
          <Pressable
            testID="copy-code"
            accessibilityRole="button"
            accessibilityLabel="Copy your ID"
            onPress={copy}
            style={styles.copy}
          >
            <Text style={styles.copyText}>{copied ? 'Copied' : 'Copy'}</Text>
          </Pressable>
        </View>
        <Text style={styles.label}>Their ID</Text>
        <TextInput
          testID="person-code"
          value={value}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={CODE_LENGTH + 2}
          onChangeText={(next) => {
            const code = normalizeCode(next).slice(0, CODE_LENGTH);
            setValue(code);
            setError(hasConfusingCharacter(code) ? '1, I, and L are not used.' : '');
          }}
          placeholder="Paste their ID"
          placeholderTextColor="#8a8a8a"
          style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          testID="add-code"
          accessibilityRole="button"
          accessibilityLabel="Add person"
          disabled={!canAdd}
          onPress={async () => {
            const result = await onAdd(normalized);
            if (result) setError(result);
          }}
          style={[styles.add, canAdd && styles.addReady]}
        >
          <Text style={[styles.addText, canAdd && styles.addTextReady]}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

const ink = '#1c1c1c';
const paper = '#fff';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    backgroundColor: paper,
  },
  body: { padding: 20, gap: 12 },
  label: { color: ink, fontSize: 14 },
  share: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  code: {
    color: ink,
    fontSize: 36,
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
  copy: {
    borderWidth: 1,
    borderColor: ink,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  copyText: { color: ink, fontSize: 16 },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: ink,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 24,
    letterSpacing: 3,
    color: ink,
  },
  error: { color: ink, fontSize: 15 },
  add: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addReady: { backgroundColor: ink },
  addText: { color: ink, fontSize: 17 },
  addTextReady: { color: paper },
});
