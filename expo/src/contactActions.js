import { Pressable, StyleSheet, Text, View } from 'react-native';

const ink = '#1c1c1c';

export function NotifyAllToggle({ contactId, notifyAll, onToggle }) {
  if (!contactId || !onToggle) return null;
  return (
    <Pressable testID={`notify-all-${contactId}`} accessibilityRole="switch" accessibilityLabel="Get all notifications" accessibilityState={{ checked: !!notifyAll }} onPress={() => onToggle(!notifyAll)} style={styles.toggle}>
      <Text style={styles.text}>Get all notifications</Text>
      <Text style={styles.text}>{notifyAll ? 'On' : 'Off'}</Text>
    </Pressable>
  );
}

export function ContactActionsMenu({ contactId, onReport, onBlock, onClose }) {
  if (!contactId) return null;
  const act = (id, label, onPress, alert) => (
    <Pressable key={id} testID={id} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.row}>
      <Text style={[styles.text, alert && styles.alert]}>{label}</Text>
    </Pressable>
  );
  return (
    <View testID="contact-actions-menu" style={styles.menu}>
      {act(`report-contact-${contactId}`, 'Report', () => { onReport(); onClose(); })}
      {act(`block-contact-${contactId}`, 'Block', () => { onBlock(); onClose(); }, true)}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: { borderWidth: 1, borderColor: ink, backgroundColor: '#fff', minWidth: 148 },
  row: { paddingVertical: 13, paddingHorizontal: 18, borderTopWidth: 1, borderTopColor: ink },
  toggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 8 },
  text: { color: ink, fontSize: 16, lineHeight: 21 },
  alert: { color: '#b3261e' },
});
