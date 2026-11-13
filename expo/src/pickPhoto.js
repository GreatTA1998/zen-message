import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { messagePhoto, photoFromPickerAsset } from './delivery.js';

export { photoFromPickerAsset } from './delivery.js';

async function webUriToDataUrl(uri, mimeType) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const base64 = btoa(binary);
    const mime = String(mimeType || blob.type || 'image/jpeg');
    let subtype = mime.slice('image/'.length).split(';')[0].trim().toLowerCase() || 'jpeg';
    if (subtype === 'heic' || subtype === 'heif' || subtype === 'jpg') subtype = 'jpeg';
    if (!['jpeg', 'png', 'webp'].includes(subtype)) subtype = 'jpeg';
    return messagePhoto(`data:image/${subtype};base64,${base64}`);
  } catch {
    return null;
  }
}

export async function pickLibraryPhoto() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;
  const options = {
    mediaTypes: ['images'],
    quality: 0.4,
    base64: true,
    exif: false,
  };
  if (Platform.OS === 'ios') {
    options.preferredAssetRepresentationMode =
      ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible;
  }
  const result = await ImagePicker.launchImageLibraryAsync(options);
  const asset = result.canceled ? null : result.assets?.[0];
  if (!asset) return null;
  let dataUrl = photoFromPickerAsset(asset);
  if (!dataUrl && Platform.OS === 'web' && typeof asset.uri === 'string') {
    dataUrl = await webUriToDataUrl(asset.uri, asset.mimeType);
  }
  if (typeof asset.uri === 'string' && asset.uri.startsWith('blob:')) {
    URL.revokeObjectURL(asset.uri);
  }
  return dataUrl;
}
