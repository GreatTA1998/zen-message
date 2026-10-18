export const CODE_LENGTH = 3;
export const CODE_ALPHABET = '023456789ABCDEFGHJKMNOPQRSTUVWXYZ';
const CONFUSING = new Set(['1', 'I', 'L']);

export function normalizeCode(value) {
  return String(value ?? '')
    .replace(/\s+/g, '')
    .toUpperCase();
}

export function hasConfusingCharacter(value) {
  return [...normalizeCode(value)].some((char) => CONFUSING.has(char));
}

export function isCode(value) {
  const code = normalizeCode(value);
  return code.length === CODE_LENGTH && [...code].every((char) => CODE_ALPHABET.includes(char));
}
