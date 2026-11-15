export const CODE_LENGTH = 3;
export const CODE_ALPHABET = '023456789ABCDEFGHJKMNOPQRSTUVWXYZ';
const CONFUSING = new Set(['1', 'I', 'L']);
const TONES = [
  ['#3d6b5a', '#e7f1ec'],
  ['#5a4f3d', '#f3eee6'],
  ['#3d556b', '#e6eef4'],
  ['#6b4a3d', '#f4ebe6'],
  ['#4a5a3d', '#eef2e6'],
  ['#55405a', '#f0e8f2'],
  ['#3d5a5a', '#e6f0f0'],
  ['#6b5a3d', '#f4f0e6'],
];

function fnv(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

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

export const avatarSeed = (id) => fnv(String(id ?? ''));

export function avatarTone(id) {
  const [fg, bg] = TONES[avatarSeed(id) % TONES.length];
  return { bg, fg };
}

export function avatarGlyph(name, id) {
  const nick = firstName(name);
  return nick ? nick.slice(0, 2).toUpperCase() : (normalizeCode(id) || String(id || '?')).slice(0, 2);
}

export function accountCode(provider, subject, taken = () => false) {
  let value = fnv(`${provider}:${subject}`);
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
