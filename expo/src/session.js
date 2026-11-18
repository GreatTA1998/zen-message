import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeCode } from './people.js';

const S = 'zen-message.session';
const P = 'zen-message.picked-contact';
const D = 'zen-message.draft';
const O = 'zen-message.opened-at';
const X = 'zen-message.outbox';

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
export const loadPickedContact = async () => normalizeCode(await get(P, '')) || null;
export const savePickedContact = (id) => put(P, normalizeCode(id) || null);
export const loadDraft = async () => (await get(D, '')) || '';
export const saveDraft = (text) => put(D, text || null);
export const saveOutbox = (items) => put(X, items?.length ? JSON.stringify(items) : null);

export async function loadOutbox() {
  try {
    const parsed = JSON.parse((await get(X, '[]')) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.contactId === 'string' &&
        typeof item.createdAt === 'number' &&
        (typeof item.body === 'string' || item.photo || item.sticker)
    );
  } catch {
    return [];
  }
}

export async function loadOpenedAt() {
  try {
    const parsed = JSON.parse((await get(O, '{}')) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
export const saveOpenedAt = (map) => put(O, JSON.stringify(map || {}));
