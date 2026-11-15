import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'zen-message.session';
const PICKED = 'zen-message.picked-contact';

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
