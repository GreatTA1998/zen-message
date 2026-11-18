import { Alert, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { bubbleTone, messageBubbleParts, ZEN_FILL, ZEN_LINE } from './messageBubble';
import { ink, paper, web, photoMaxWidth } from './chatTheme';

function onLongPressIncoming(message, onReportIncoming, onBlockIncoming) {
  if (Platform.OS === 'web') {
    if (window.confirm('Report this message?')) {
      onReportIncoming?.(message.id);
      return;
    }
    if (window.confirm('Block this contact?')) onBlockIncoming?.();
    return;
  }
  Alert.alert('Message', 'Choose an action.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Report', onPress: () => onReportIncoming?.(message.id) },
    { text: 'Block contact', style: 'destructive', onPress: () => onBlockIncoming?.() },
  ]);
}

export function ThreadMessage({ message, onRetry, onOpenPhoto, onReportIncoming, onBlockIncoming }) {
  const incoming = message.direction === 'in';
  const parts = messageBubbleParts(message);
  if (parts.length === 0) return null;

  return (
    <Pressable
      onLongPress={incoming ? () => onLongPressIncoming(message, onReportIncoming, onBlockIncoming) : undefined}
      delayLongPress={420}
      onPress={message.failed ? onRetry : undefined}
      style={[styles.messageStack, incoming ? styles.messageStackIn : styles.messageStackOut, message._out && { opacity: 0.72 }]}
    >
      {parts.map((kind) =>
        kind === 'text' ? (
          <TextBubble key={`${message.id}-text`} message={message} incoming={incoming} />
        ) : (
          <MediaBubble key={`${message.id}-${kind}`} kind={kind} uri={kind === 'sticker' ? message.sticker : message.photo} incoming={incoming} onOpenPhoto={onOpenPhoto} />
        )
      )}
      {message._out ? (
        <Text testID={`outbox-${message.id}`} style={[styles.menuTextQuiet, { alignSelf: 'flex-end' }]}>
          {message.failed ? 'Not sent · Tap to retry' : 'Sending…'}
        </Text>
      ) : null}
    </Pressable>
  );
}

function TextBubble({ message, incoming }) {
  const tone = bubbleTone(message.intent);
  const zen = tone === 'zen';
  const fill = zen ? ZEN_FILL : paper;
  return (
    <View testID={incoming ? 'bubble-in' : 'bubble-out'} style={[styles.bubble, incoming ? styles.bubbleIn : styles.bubbleOut, zen && styles.bubbleZen, tone === 'scheduled' && styles.bubbleScheduled, web && styles.bubbleRead]}>
      <View pointerEvents="none" testID={incoming ? 'tail-in' : 'tail-own'} style={[styles.tail, incoming ? styles.tailIn : styles.tailOut]}>
        <View style={styles.tailStem} />
        <View style={[styles.tailFill, { borderBottomColor: fill }]} />
        <View style={[styles.tailJoin, { backgroundColor: fill }]} />
        <View style={styles.tailClip}><View style={styles.tailEdge} /></View>
      </View>
      {zen ? <View pointerEvents="none" testID="zen-mark" style={styles.zenMark} /> : null}
      <Text style={styles.bubbleText}>{message.body}</Text>
    </View>
  );
}

function MediaBubble({ kind, uri, incoming, onOpenPhoto }) {
  const sticker = kind === 'sticker';
  return (
    <Pressable testID={incoming ? `${kind}-in` : `${kind}-out`} accessibilityRole="button" accessibilityLabel={sticker ? 'View drawing' : 'View photo'} onPress={() => onOpenPhoto?.(uri)} style={[styles.mediaBubble, sticker && styles.stickerBubble, incoming ? styles.mediaBubbleIn : styles.mediaBubbleOut]}>
      <Image testID={sticker ? 'bubble-sticker' : 'bubble-photo'} source={{ uri }} resizeMode={sticker ? 'contain' : 'cover'} style={styles.mediaImage} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  messageStack: { gap: 6, maxWidth: '100%' },
  messageStackIn: { alignSelf: 'flex-start', marginTop: 10 },
  messageStackOut: { alignSelf: 'flex-end' },
  menuTextQuiet: { color: '#6a6a6a', fontSize: 13, lineHeight: 17 },
  mediaBubble: { width: photoMaxWidth, maxWidth: '84%', aspectRatio: 4 / 3, borderRadius: 16, overflow: 'hidden', backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  stickerBubble: { width: 148, height: 148, aspectRatio: 1, backgroundColor: 'transparent', borderWidth: 0 },
  mediaBubbleIn: { alignSelf: 'flex-start' },
  mediaBubbleOut: { alignSelf: 'flex-end' },
  mediaImage: { width: '100%', height: '100%' },
  bubble: { alignSelf: 'flex-end', maxWidth: '84%', borderWidth: 1, borderColor: ink, borderRadius: 18, backgroundColor: paper, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 4 },
  bubbleOut: { borderBottomRightRadius: 2 },
  bubbleIn: { alignSelf: 'flex-start', maxWidth: '78%', marginTop: 10, marginBottom: 0, borderTopLeftRadius: 2 },
  bubbleZen: { backgroundColor: ZEN_FILL, borderColor: ZEN_LINE },
  bubbleScheduled: { borderStyle: 'dashed' },
  bubbleRead: { maxWidth: 'min(560px, 100%)' },
  zenMark: { position: 'absolute', right: 9, bottom: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: ZEN_LINE, opacity: 0.55 },
  tail: { position: 'absolute', width: 24, height: 20 },
  tailIn: { left: -1, top: -12 },
  tailOut: { right: -1, bottom: -12, transform: [{ rotate: '180deg' }] },
  tailStem: { position: 'absolute', left: 0, top: 0, width: 1, height: 14, backgroundColor: ink },
  tailFill: { position: 'absolute', left: 1, top: 0, width: 0, height: 0, borderRightWidth: 16, borderBottomWidth: 13, borderRightColor: 'transparent', borderBottomColor: paper },
  tailJoin: { position: 'absolute', left: 1, top: 11, width: 16, height: 8, backgroundColor: paper },
  tailClip: { position: 'absolute', left: 0, top: 0, width: 24, height: 12, overflow: 'hidden' },
  tailEdge: { position: 'absolute', left: 0, top: 0, width: 28, height: 1, backgroundColor: ink, transformOrigin: 'left center', transform: [{ rotate: '36deg' }] },
  bubbleText: { color: ink, fontSize: 17, lineHeight: 22 },
});