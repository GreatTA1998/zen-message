import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { messagePhoto, photoFromPickerAsset } from './delivery.js';

async function webUriToDataUrl(uri, mimeType) {
  try {
    const blob = await (await fetch(uri)).blob();
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    let subtype = String(mimeType || blob.type || 'image/jpeg').slice(6).split(';')[0].trim().toLowerCase() || 'jpeg';
    if (subtype === 'heic' || subtype === 'heif' || subtype === 'jpg') subtype = 'jpeg';
    if (!['jpeg', 'png', 'webp'].includes(subtype)) subtype = 'jpeg';
    return messagePhoto(`data:image/${subtype};base64,${btoa(binary)}`);
  } catch {
    return null;
  }
}

const pickerOptions = (forCamera) => {
  const options = { mediaTypes: ['images'], quality: 0.4, base64: true, exif: false };
  if (!forCamera && Platform.OS === 'ios') {
    options.preferredAssetRepresentationMode = ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible;
  }
  return options;
};

async function photoFromResult(result) {
  const asset = result.canceled ? null : result.assets?.[0];
  if (!asset) return null;
  let dataUrl = photoFromPickerAsset(asset);
  if (!dataUrl && Platform.OS === 'web' && typeof asset.uri === 'string') dataUrl = await webUriToDataUrl(asset.uri, asset.mimeType);
  if (typeof asset.uri === 'string' && asset.uri.startsWith('blob:')) URL.revokeObjectURL(asset.uri);
  return dataUrl;
}

export async function pickLibraryPhoto() {
  return (await ImagePicker.requestMediaLibraryPermissionsAsync()).granted
    ? photoFromResult(await ImagePicker.launchImageLibraryAsync(pickerOptions(false)))
    : null;
}

export async function pickCameraPhoto() {
  return (await ImagePicker.requestCameraPermissionsAsync()).granted
    ? photoFromResult(await ImagePicker.launchCameraAsync(pickerOptions(true)))
    : null;
}