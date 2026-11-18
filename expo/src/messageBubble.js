export function messageBubbleParts(message) {
  const parts = [];
  if (message?.sticker) parts.push('sticker');
  else if (message?.photo) parts.push('photo');
  if (message?.body?.trim()) parts.push('text');
  return parts;
}

export function bubbleTone(intent) {
  return intent === 'scheduled' ? 'scheduled' : intent === 'anytime' || intent === 'timely' ? 'zen' : 'normal';
}

export const ZEN_FILL = '#d8eee2';
export const ZEN_LINE = '#3f7a5c';
