import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { photoFromPickerAsset } from './delivery.js';

export { photoFromPickerAsset } from './delivery.js';

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
  if (typeof asset.uri === 'string' && asset.uri.startsWith('blob:')) {
    URL.revokeObjectURL(asset.uri);
  }
  return photoFromPickerAsset(asset);
}
