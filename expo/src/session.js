import AsyncStorage from '@react-native-async-storage/async-storage';

const S = 'zen-message.session';
const P = 'zen-message.picked-contact';
const D = 'zen-message.draft';
const O = 'zen-message.opened-at';

async function get(key, fallback = null) {
  try {
    return (await AsyncStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

async function put(key, value) {
  if (value == null || value === '') await AsyncStorage.removeItem(key);
  else await AsyncStorage.setItem(key, value);
}

export const loadSession = () => get(S);
export const saveSession = (token) => put(S, token || null);

export async function loadPickedContact() {
  return String((await get(P, '')) || '').replace(/\s+/g, '').toUpperCase() || null;
}
export const savePickedContact = (id) =>
  put(P, String(id ?? '').replace(/\s+/g, '').toUpperCase() || null);

export async function loadDraft() {
  return (await get(D, '')) || '';
}
export const saveDraft = (text) => put(D, text || null);

export async function loadOpenedAt() {
  try {
    const parsed = JSON.parse((await get(O, '{}')) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
export const saveOpenedAt = (map) => put(O, JSON.stringify(map || {}));
