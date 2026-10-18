export const CODE_LENGTH = 3;
export const CODE_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function normalizeCode(value) {
  return String(value ?? '')
    .replace(/\s+/g, '')
    .toUpperCase();
}

export function isCode(value) {
  const code = normalizeCode(value);
  return code.length === CODE_LENGTH && [...code].every((char) => CODE_ALPHABET.includes(char));
}
