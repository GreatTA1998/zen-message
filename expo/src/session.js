import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'zen-message.session';

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
