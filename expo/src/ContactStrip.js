import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PersonAvatar } from './contacts';
import { notificationPolicy, starColor } from './notificationPolicy';
import { contactUnread } from './delivery';
import { normalizeCode } from './people';
import { ink, web, side } from './chatTheme';

export function ContactStrip({
  contacts,
  selectedContactId,
  panel,
  mode,
  pendingNotify,
  openedAt,
  messages,
  hideChrome,
  onPick,
  onLongPress,
  onToggleAdd,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.contacts, web && styles.webPad]}
      testID="contact-strip"
      style={[styles.contactStrip, hideChrome && styles.chromeGone]}
    >
      {contacts.map((item) => {
        const id = normalizeCode(item.id);
        const selected = id === selectedContactId;
        const pending = item.status === 'pending-in' || item.status === 'pending-out';
        const override = pendingNotify?.id === item.id ? pendingNotify.on : !!item.notifyAll;
        const starKind = notificationPolicy({ mode, notifyAll: override, pending }).starKind;
        const glow =
          openedAt && !pending && !selected && contactUnread(messages, id, openedAt[id])
            ? styles.avatarHalo
            : null;
        return (
          <Pressable
            key={item.id}
            testID={`contact-${item.id}`}
            accessibilityRole="button"
            accessibilityLabel={item.firstName || item.id}
            accessibilityState={{ selected: (panel === 'chat' || panel === 'request') && selected }}
            onPress={() => onPick(item)}
            onLongPress={() => onLongPress(item.id)}
            style={styles.contact}
          >
            <View>
              <PersonAvatar
                id={id}
                name={item.firstName}
                uri={item.avatar}
                size={54}
                dashed={pending}
                style={[panel !== 'add' && selected && styles.circleOn, glow]}
              />
              {starKind ? <Ionicons testID={`notify-star-${item.id}`} name="star" size={11} color={starColor(starKind)} style={styles.contactStar} importantForAccessibility="no" /> : null}
            </View>
            <Text numberOfLines={1} style={styles.contactLabel}>{item.firstName || item.id}</Text>
          </Pressable>
        );
      })}
      <Pressable
        testID="add-person"
        accessibilityRole="button"
        accessibilityLabel="new contact"
        accessibilityState={{ selected: panel === 'add' }}
        onPress={onToggleAdd}
        style={styles.contact}
      >
        <View style={[styles.plus, panel === 'add' && styles.circleOn]}>
          <Text style={styles.plusMark}>+</Text>
        </View>
        <Text numberOfLines={1} style={styles.contactLabel}>
          new contact
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contactStrip: { flexGrow: 0, flexShrink: 0, borderBottomWidth: 1, borderBottomColor: ink, zIndex: 0 },
  contacts: { paddingHorizontal: 12, paddingTop: 14, paddingBottom: 10, gap: 8 },
  contact: { alignItems: 'center' },
  contactStar: { position: 'absolute', top: -1, right: -1 },
  avatarHalo: { borderColor: 'rgba(72, 158, 118, 0.7)', shadowColor: '#3f9a6e', shadowOpacity: 0.5, shadowRadius: 9, shadowOffset: { width: 0, height: 0 } },
  circleOn: { borderWidth: 2, borderColor: ink },
  contactLabel: { marginTop: 4, color: ink, fontSize: 11, lineHeight: 14, textAlign: 'center' },
  plus: { width: 54, height: 54, borderRadius: 27, borderWidth: 1, borderColor: ink, alignItems: 'center', justifyContent: 'center' },
  plusMark: { color: ink, fontSize: 32, lineHeight: 34 },
  webPad: { paddingLeft: side, paddingRight: side },
  chromeGone: { display: 'none' },
});