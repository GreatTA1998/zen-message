import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'zen-message.session';
const PICKED = 'zen-message.picked-contact';
const DRAFT = 'zen-message.draft';

export async function loadSession() {
  try {
    return await AsyncStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export async function saveSession(token) {
  if (!token) await AsyncStorage.removeItem(KEY);
  else await AsyncStorage.setItem(KEY, token);
}

export async function loadPickedContact() {
  try {
    return ((await AsyncStorage.getItem(PICKED)) || '').replace(/\s+/g, '').toUpperCase() || null;
  } catch {
    return null;
  }
}

export async function savePickedContact(id) {
  const next = String(id ?? '').replace(/\s+/g, '').toUpperCase();
  if (!next) await AsyncStorage.removeItem(PICKED);
  else await AsyncStorage.setItem(PICKED, next);
}

export async function loadDraft() {
  try {
    return (await AsyncStorage.getItem(DRAFT)) || '';
  } catch {
    return '';
  }
}

export async function saveDraft(text) {
  if (!text) await AsyncStorage.removeItem(DRAFT);
  else await AsyncStorage.setItem(DRAFT, text);
}
