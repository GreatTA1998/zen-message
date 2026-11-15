import { Image, StyleSheet, Text, View } from 'react-native';
import { avatarGlyph, avatarTone } from './people';

export const LOGO = require('../assets/logo.jpg');

export function PersonAvatar({ id, name, uri, size = 54, style, testID, dashed }) {
  const borderWidth = StyleSheet.flatten(style)?.borderWidth ?? 1;
  const disk = dashed ? size - 8 : size - borderWidth * 2;
  const { bg, fg } = avatarTone(id);
  const face = uri ? (
    <Image testID={testID} source={{ uri }} resizeMode="cover" style={{ width: disk, height: disk, borderRadius: disk / 2 }} />
  ) : (
    <View testID={testID} style={{ width: disk, height: disk, borderRadius: disk / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: fg, fontSize: Math.round(disk * 0.34), fontWeight: '600' }}>{avatarGlyph(name, id)}</Text>
    </View>
  );
  return (
    <View
      style={[
        dashed
          ? { width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderStyle: 'dashed', borderColor: '#1c1c1c', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }
          : { width: size, height: size, borderRadius: size / 2, borderWidth: 1, borderColor: '#1c1c1c', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
    >
      {face}
    </View>
  );
}
