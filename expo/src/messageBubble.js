/** @returns {Array<'sticker'|'photo'|'text'>} */
export function messageBubbleParts(message) {
  const parts = [];
  if (message?.sticker) parts.push('sticker');
  else if (message?.photo) parts.push('photo');
  if (message?.body?.trim()) parts.push('text');
  return parts;
}

/** @returns {'zen'|'scheduled'|'normal'} */
export function bubbleTone(intent) {
  return intent === 'scheduled' ? 'scheduled' : intent === 'anytime' || intent === 'timely' ? 'zen' : 'normal';
}

export const ZEN_FILL = '#d4ecd9';
export const ZEN_LINE = '#2f7a52';
