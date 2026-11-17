import { Pressable, StyleSheet, Text, View } from 'react-native';

const ink = '#1c1c1c';

export function ContactActionsMenu({ contactId, notifyAll, onToggleNotifyAll, onReport, onBlock, onClose }) {
  if (!contactId) return null;
  const act = (id, label, onPress, { alert, ...a11y } = {}) => (
    <Pressable key={id} testID={id} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.row} {...a11y}>
      <Text style={[styles.text, alert && styles.alert]}>{label}</Text>
    </Pressable>
  );
  return (
    <View testID="contact-actions-menu" style={styles.menu}>
      {onToggleNotifyAll
        ? act(`notify-all-${contactId}`, notifyAll ? 'All alerts on' : 'All alerts', () => onToggleNotifyAll(!notifyAll), {
            accessibilityRole: 'switch',
            accessibilityState: { checked: Boolean(notifyAll) },
          })
        : null}
      {act(`report-contact-${contactId}`, 'Report', () => {
        onReport();
        onClose();
      })}
      {act(`block-contact-${contactId}`, 'Block', () => {
        onBlock();
        onClose();
      }, { alert: true })}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: { borderWidth: 1, borderColor: ink, backgroundColor: '#fff', minWidth: 148 },
  row: { paddingVertical: 13, paddingHorizontal: 18, borderTopWidth: 1, borderTopColor: ink },
  text: { color: ink, fontSize: 16, lineHeight: 21 },
  alert: { color: '#b3261e' },
});
