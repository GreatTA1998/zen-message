import { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { INTENTS, choiceLabel, composerPlaceholder, dayPhrase } from './delivery';
import { ink, paper, web, side } from './chatTheme';

export function ComposerFooter({
  testID,
  intent,
  onIntent,
  choiceAt,
  onChoice,
  columns,
  now,
  photo,
  onClearPhoto,
  sticker,
  onClearSticker,
  onDraw,
  draft,
  onChangeDraft,
  onInputSize,
  inputHeight,
  contactName,
  selectedAt,
  canSend,
  onSend,
  onAttach,
  onAttachCamera,
}) {
  const [timesOpen, setTimesOpen] = useState(false);
  const drawEnabled = Platform.OS === 'web' || Platform.OS === 'ios';

  function chooseIntent(id) {
    onIntent(id);
    setTimesOpen(id === 'scheduled');
  }

  function choiceCell(at, index) {
    const on = (choiceAt ?? selectedAt?.getTime()) === at.getTime();
    return (
      <Pressable
        key={at.getTime()}
        testID={`choice-${index}`}
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
        onPress={() => { onChoice(at.getTime()); setTimesOpen(false); }}
        style={[styles.choiceRow, on && styles.choiceRowOn]}
      >
        <Text numberOfLines={1} style={[styles.choiceText, on && styles.choiceTextOn]}>
          {dayPhrase(at.getHours()).replace(' ', '')}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.composerWrap}>
      {timesOpen ? (
        <View testID="scheduled-choices" style={[styles.choicePopover, web && styles.webChoices]}>
          <View style={styles.choiceColumns}>
            {[['Today', columns.today, 0], ['Tomorrow', columns.tomorrow, columns.today.length]].map(([title, slots, offset], col) => (
              <View key={title} style={[{ flex: 1 }, col > 0 && styles.choiceColRight]}>
                <Text style={[styles.choiceText, styles.choiceTextOn, styles.choiceRow, styles.choiceRowFirst]}>{title}</Text>
                <ScrollView style={styles.choiceCol} keyboardShouldPersistTaps="handled">{slots.map((at, i) => choiceCell(at, offset + i))}</ScrollView>
              </View>
            ))}
          </View>
        </View>
      ) : null}
      <View testID="composer-bar" style={[styles.composer, web && styles.webComposer]}>
        {photo || sticker ? (
          <View style={styles.previewWrap}>
            <Image
              testID={photo ? 'photo-preview' : 'draw-preview'}
              source={{ uri: photo || sticker }}
              resizeMode={photo ? 'cover' : 'contain'}
              style={styles.preview}
            />
            <Pressable
              testID={photo ? 'photo-clear' : 'draw-clear'}
              accessibilityRole="button"
              accessibilityLabel={photo ? 'Remove photo' : 'Remove drawing'}
              onPress={photo ? onClearPhoto : onClearSticker}
              style={styles.previewClear}
            >
              <Feather name="x" size={14} color={ink} />
            </Pressable>
          </View>
        ) : null}
        <TextInput
          testID={testID}
          value={draft}
          onChangeText={onChangeDraft}
          onContentSizeChange={onInputSize}
          placeholder={composerPlaceholder(contactName, intent, selectedAt)}
          placeholderTextColor="#8a8a8a"
          multiline
          numberOfLines={2}
          style={[styles.input, { height: inputHeight }]}
        />
        <View style={styles.boxTools}>
          {drawEnabled ? (
            <Pressable
              testID="attach-draw"
              accessibilityRole="button"
              accessibilityLabel="Draw"
              onPress={onDraw}
              style={styles.photoButton}
            >
              <MaterialCommunityIcons name="draw-pen" size={22} color={ink} />
            </Pressable>
          ) : null}
          {[
            ['attach-camera', 'Camera', onAttachCamera, 'camera'],
            ['attach-photo', 'Photo', onAttach, 'image'],
          ].map(([id, label, press, icon]) => (
            <Pressable
              key={id}
              testID={id}
              accessibilityRole="button"
              accessibilityLabel={label}
              onPress={press}
              style={styles.photoButton}
            >
              <Feather name={icon} size={22} color={ink} />
            </Pressable>
          ))}
          <View style={styles.intentSlot}>
            {INTENTS.map((item) => {
              const selected = item.id === intent;
              return (
                <Pressable
                  key={item.id}
                  testID={`intent-${item.id}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected, expanded: item.id === 'scheduled' ? timesOpen : undefined }}
                  onPress={() => chooseIntent(item.id)}
                  style={styles.intentWord}
                >
                  <Text numberOfLines={1} style={[styles.intentText, selected && styles.intentTextSelected]}>
                    {item.id === 'scheduled' && selected ? choiceLabel(selectedAt, now) : item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            testID="send"
            accessibilityRole="button"
            accessibilityLabel="Send"
            disabled={!canSend}
            onPress={onSend}
            style={[styles.send, canSend && styles.sendReady]}
          >
            <Feather name="send" size={18} color={canSend ? paper : '#9a9a9a'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  composerWrap: { position: 'relative', zIndex: 2 },
  intentSlot: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 },
  intentWord: { paddingVertical: 6, paddingHorizontal: 2 },
  intentText: { color: ink, fontSize: 14, lineHeight: 18 },
  intentTextSelected: { fontWeight: '700' },
  choicePopover: { position: 'absolute', left: 24, right: 24, bottom: '100%', marginBottom: 6, backgroundColor: paper, borderWidth: 1, borderColor: ink, zIndex: 6 },
  choiceColumns: { flexDirection: 'row' },
  choiceCol: { maxHeight: 220 },
  choiceColRight: { borderLeftWidth: 1, borderLeftColor: ink },
  choiceRow: { paddingVertical: 11, paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: ink },
  choiceRowFirst: { borderTopWidth: 0 },
  choiceRowOn: { backgroundColor: '#f6f3ee' },
  choiceText: { color: ink, fontSize: 15, lineHeight: 20 },
  choiceTextOn: { fontWeight: '700' },
  composer: { marginHorizontal: 12, marginTop: 10, marginBottom: 10, borderWidth: 1, borderColor: ink, borderRadius: 22, backgroundColor: paper, overflow: 'hidden' },
  webComposer: { marginHorizontal: side },
  webChoices: { left: side, right: side, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' },
  previewWrap: { paddingTop: 12, paddingHorizontal: 12 },
  preview: { width: 120, height: 88, borderRadius: 12, backgroundColor: '#f3f3f3' },
  previewClear: { position: 'absolute', top: 18, left: 104, width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: ink, backgroundColor: paper, alignItems: 'center', justifyContent: 'center' },
  input: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, fontSize: 17, lineHeight: 22, color: ink, borderWidth: 0, outlineStyle: 'none' },
  boxTools: { flexDirection: 'row', alignItems: 'center', paddingLeft: 6, paddingRight: 8, paddingBottom: 8 },
  photoButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  send: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f2f2f2' },
  sendReady: { backgroundColor: ink },
});