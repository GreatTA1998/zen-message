import { Pressable, StyleSheet, Text, View } from 'react-native';

const ink = '#1c1c1c';
const paper = '#fff';
const alert = '#b3261e';

export function ContactActionsMenu({ contactId, onReport, onBlock, onClose }) {
  if (!contactId) return null;
  return (
    <View testID="contact-actions-menu" style={styles.menu}>
      <Pressable
        testID={`report-contact-${contactId}`}
        accessibilityRole="button"
        accessibilityLabel="Report contact"
        onPress={() => {
          onReport();
          onClose();
        }}
        style={styles.row}
      >
        <Text style={styles.text}>Report</Text>
      </Pressable>
      <Pressable
        testID={`block-contact-${contactId}`}
        accessibilityRole="button"
        accessibilityLabel="Block contact"
        onPress={() => {
          onBlock();
          onClose();
        }}
        style={styles.row}
      >
        <Text style={[styles.text, styles.alert]}>Block</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    borderWidth: 1,
    borderColor: ink,
    backgroundColor: paper,
    minWidth: 148,
  },
  row: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: ink,
  },
  text: { color: ink, fontSize: 16, lineHeight: 21 },
  alert: { color: alert },
});
