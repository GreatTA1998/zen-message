/** @returns {Array<'sticker'|'photo'|'text'>} */
export function messageBubbleParts(message) {
  const parts = [];
  if (message?.sticker) parts.push('sticker');
  else if (message?.photo) parts.push('photo');
  if (message?.body?.trim()) parts.push('text');
  return parts;
}
