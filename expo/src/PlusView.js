import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { CODE_LENGTH, normalizeCode } from './people';

export function PlusView({ code, onLookup, onAdd }) {
  const [value, setValue] = useState('');
  const [match, setMatch] = useState(null);
  const normalized = normalizeCode(value).slice(0, CODE_LENGTH);
  const ready = Boolean(match?.found);

  useEffect(() => {
    if (normalized.length < CODE_LENGTH) {
      setMatch(null);
      return undefined;
    }
    let alive = true;
    setMatch(undefined);
    Promise.resolve(onLookup(normalized)).then((result) => {
      if (alive) setMatch(result?.found ? result : { found: false });
    });
    return () => {
      alive = false;
    };
  }, [normalized, onLookup]);

  async function copy() {
    await Clipboard.setStringAsync(code);
  }

  const lookup = normalized.length < CODE_LENGTH ? '' : match?.found ? match.name : match ? 'not found' : '';

  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <Text style={styles.title}>Add contact by ID</Text>
        <View style={styles.row}>
          <TextInput
            testID="person-code"
            value={value}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={CODE_LENGTH}
            onChangeText={(next) => setValue(normalizeCode(next).slice(0, CODE_LENGTH))}
            placeholder="3-digit"
            placeholderTextColor="#8a8a8a"
            style={styles.input}
          />
          <Text testID="person-lookup" numberOfLines={1} style={styles.lookup}>
            {lookup}
          </Text>
        </View>
        <Pressable
          testID="add-code"
          accessibilityRole="button"
          accessibilityLabel="ADD"
          accessibilityState={{ disabled: !ready }}
          disabled={!ready}
          onPress={async () => {
            if (!ready) return;
            await onAdd(normalized);
          }}
          style={[styles.add, ready && styles.addReady]}
        >
          <Text style={[styles.addText, ready && styles.addTextReady]}>ADD</Text>
        </Pressable>
        <View style={styles.own}>
          <Text style={styles.title}>Your ID</Text>
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
              <Feather name="copy" size={22} color={ink} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const ink = '#1c1c1c';
const paper = '#fff';

const styles = StyleSheet.create({
  screen: { flex: 1, width: '100%', backgroundColor: paper },
  body: { padding: 20, gap: 12 },
  title: { color: ink, fontSize: 18, lineHeight: 24, fontWeight: '600' },
  row: { height: 44, flexDirection: 'row', alignItems: 'stretch', gap: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: ink,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 24,
    letterSpacing: 3,
    color: ink,
  },
  lookup: { flex: 1, color: ink, fontSize: 18, lineHeight: 24 },
  add: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addReady: { backgroundColor: ink, borderColor: ink },
  addText: { color: '#9a9a9a', fontSize: 17, letterSpacing: 1 },
  addTextReady: { color: paper },
  own: { marginTop: 36, gap: 8 },
  share: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  code: { color: ink, fontSize: 40, letterSpacing: 4, fontVariant: ['tabular-nums'] },
  copy: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
