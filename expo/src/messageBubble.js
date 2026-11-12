/** @returns {Array<'photo'|'text'>} */
export function messageBubbleParts(message) {
  const parts = [];
  if (message?.photo) parts.push('photo');
  if (message?.body?.trim()) parts.push('text');
  return parts;
}
