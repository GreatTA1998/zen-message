import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DAY_HOURS, dayPhrase } from './delivery';
import { ink, paper } from './chatTheme';

const DELETE_ACCOUNT_CONSEQUENCE =
  'Your account, contacts, and messages are permanently removed from Zen Message and sign-in is cleared. This cannot be undone.';

export function AccountMenu({ userId, onLogout, onDeleteAccount }) {
  const [armingDelete, setArmingDelete] = useState(false);

  return (
    <View testID="account-menu" style={armingDelete ? styles.accountMenuWide : null}>
      <View style={styles.menuRow}>
        <Text testID="account-id" style={styles.menuText}>
          ID {userId}
        </Text>
      </View>
      <Pressable
        testID="logout-button"
        accessibilityRole="button"
        accessibilityLabel="Log out"
        onPress={onLogout}
        style={styles.menuRow}
      >
        <Text style={styles.menuText}>Log out</Text>
      </Pressable>
      {armingDelete ? (
        <View testID="delete-account-confirm-step" style={styles.menuFooter}>
          <Text style={styles.menuConsequence}>{DELETE_ACCOUNT_CONSEQUENCE}</Text>
          <Pressable
            testID="delete-account-confirm"
            accessibilityRole="button"
            accessibilityLabel="Delete account permanently"
            onPress={() => {
              setArmingDelete(false);
              onDeleteAccount();
            }}
            style={styles.menuRow}
          >
            <Text style={[styles.menuTextQuiet, styles.menuTextAlert]}>Delete account permanently</Text>
          </Pressable>
          <Pressable
            testID="delete-account-cancel"
            accessibilityRole="button"
            accessibilityLabel="Cancel delete account"
            onPress={() => setArmingDelete(false)}
            style={styles.menuRow}
          >
            <Text style={styles.menuTextQuiet}>Cancel</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.menuFooter}>
          <Pressable
            testID="delete-account-button"
            accessibilityRole="button"
            accessibilityLabel="Delete account"
            onPress={() => setArmingDelete(true)}
            style={styles.menuRowQuiet}
            hitSlop={4}
          >
            <Text style={styles.menuTextQuiet}>Delete account</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export function ScheduleSettings({ hour: selectedHour, minute: selectedMinute, onChoose }) {
  const [hour, setHour] = useState(selectedHour);
  const row = (testID, label, on, press) => (
    <Pressable
      key={testID}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      onPress={press}
      style={[styles.menuRow, on && styles.menuRowSelected]}
    >
      <Text style={[styles.menuText, on && styles.menuTextSelected]}>{label}</Text>
    </Pressable>
  );
  return (
    <View testID="schedule-menu" style={styles.choiceColumns}>
      <ScrollView style={styles.choiceCol} keyboardShouldPersistTaps="handled">
        {DAY_HOURS.map((value) => row(`schedule-hour-${value}`, dayPhrase(value), value === hour, () => setHour(value)))}
      </ScrollView>
      <ScrollView style={[styles.choiceCol, styles.choiceColRight]} keyboardShouldPersistTaps="handled">
        {Array.from({ length: 60 }, (_, minute) =>
          row(
            `schedule-minute-${minute}`,
            String(minute).padStart(2, '0'),
            hour === selectedHour && minute === selectedMinute,
            () => onChoose(hour, minute)
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  accountMenuWide: { width: 248 },
  menuFooter: { borderTopWidth: 1, borderTopColor: '#e6e3dc' },
  menuRowQuiet: { paddingVertical: 10, paddingHorizontal: 18 },
  menuTextQuiet: { color: '#6a6a6a', fontSize: 13, lineHeight: 17 },
  menuConsequence: { color: ink, fontSize: 13, lineHeight: 18, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 6 },
  menuTextAlert: { color: '#b3261e' },
  menuRow: { paddingVertical: 13, paddingHorizontal: 18, borderTopWidth: 1, borderTopColor: ink },
  menuRowSelected: { backgroundColor: '#f6f3ee' },
  menuText: { color: ink, fontSize: 16, lineHeight: 21 },
  menuTextSelected: { fontWeight: '700' },
  choiceColumns: { flexDirection: 'row' },
  choiceCol: { maxHeight: 220 },
  choiceColRight: { borderLeftWidth: 1, borderLeftColor: ink },
});