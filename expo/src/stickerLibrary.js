import AsyncStorage from '@react-native-async-storage/async-storage';
import { messageSticker } from './delivery.js';

const KEY = 'zen-message.stickers.v1';
const MAX = 28;

export async function loadStickerLibrary() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item === 'string' && messageSticker(item));
  } catch {
    return [];
  }
}

export async function rememberSticker(dataUri) {
  const sticker = messageSticker(dataUri);
  if (!sticker) return loadStickerLibrary();
  const current = await loadStickerLibrary();
  const next = [sticker, ...current.filter((item) => item !== sticker)].slice(0, MAX);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
