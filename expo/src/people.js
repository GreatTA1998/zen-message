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

export function firstName(value) {
  const word = String(value ?? '').trim().split(/\s+/)[0] || '';
  return word.slice(0, 18);
}

export function accountCode(provider, subject, taken = () => false) {
  const material = `${provider}:${subject}`;
  let hash = 2166136261;
  for (let index = 0; index < material.length; index += 1) {
    hash ^= material.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  let value = hash >>> 0;
  for (let attempt = 0; attempt < 64; attempt += 1) {
    let code = '';
    let mixed = value;
    for (let index = 0; index < CODE_LENGTH; index += 1) {
      code += CODE_ALPHABET[mixed % CODE_ALPHABET.length];
      mixed = (Math.imul(mixed, 33) + attempt + index + 1) >>> 0;
    }
    if (isCode(code) && !taken(code)) return code;
    value = Math.imul(value ^ 0x9e3779b9, 16777619) >>> 0;
  }
  return null;
}
