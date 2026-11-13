import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

export async function signInWithApple() {
  try {
    const available = Platform.OS === 'ios' && (await AppleAuthentication.isAvailableAsync());
    if (!available) {
      return { provider: 'apple', missing: 'apple_capability' };
    }
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential?.user) return { provider: 'apple', missing: 'apple_capability' };
    return {
      provider: 'apple',
      subject: credential.user,
      firstName: credential.fullName?.givenName || '',
    };
  } catch (error) {
    if (error?.code === 'ERR_REQUEST_CANCELED') return { provider: 'apple', cancelled: true };
    return { provider: 'apple', missing: 'apple_capability' };
  }
}
