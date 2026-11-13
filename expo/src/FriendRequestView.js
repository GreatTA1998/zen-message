import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { PERSON_AVATAR } from './contacts';

export function FriendRequestView({ contact, onAccept, onDecline, busy }) {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Image source={PERSON_AVATAR} style={styles.avatar} resizeMode="cover" />
        <Text style={styles.name}>{contact.firstName || contact.id}</Text>
        <Text style={styles.id}>{contact.id}</Text>
        <Text style={styles.lead}>wants to be your contact</Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          testID="friend-decline"
          accessibilityRole="button"
          accessibilityLabel="Decline"
          disabled={busy}
          onPress={onDecline}
          style={[styles.button, styles.decline]}
        >
          <Text style={styles.declineText}>Decline</Text>
        </Pressable>
        <Pressable
          testID="friend-accept"
          accessibilityRole="button"
          accessibilityLabel="Accept"
          disabled={busy}
          onPress={onAccept}
          style={[styles.button, styles.accept]}
        >
          <Text style={styles.acceptText}>Accept</Text>
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
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 24,
    alignItems: 'center',
  },
  card: { alignItems: 'center', gap: 8 },
  avatar: { width: 88, height: 88, borderRadius: 44, borderWidth: 1, borderColor: ink },
  name: { color: ink, fontSize: 22, lineHeight: 28, fontWeight: '600' },
  id: { color: ink, fontSize: 16, lineHeight: 20, letterSpacing: 2 },
  lead: { color: ink, fontSize: 17, lineHeight: 22, marginTop: 4 },
  actions: { width: '100%', maxWidth: 360, flexDirection: 'row', gap: 12 },
  button: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decline: { backgroundColor: paper },
  accept: { backgroundColor: ink },
  declineText: { color: ink, fontSize: 17 },
  acceptText: { color: paper, fontSize: 17 },
});
