import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeCode } from './people.js';

const KEY = 'zen-message.session';
const PICKED_KEY = 'zen-message.picked-contact';

export async function loadSession() {
  try {
    return await AsyncStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export async function saveSession(token) {
  if (!token) {
    await AsyncStorage.removeItem(KEY);
    return;
  }
  await AsyncStorage.setItem(KEY, token);
}

export async function loadPickedContact() {
  try {
    return normalizeCode(await AsyncStorage.getItem(PICKED_KEY)) || null;
  } catch {
    return null;
  }
}

export async function savePickedContact(contactId) {
  const id = normalizeCode(contactId);
  if (!id) {
    await AsyncStorage.removeItem(PICKED_KEY);
    return;
  }
  await AsyncStorage.setItem(PICKED_KEY, id);
}
