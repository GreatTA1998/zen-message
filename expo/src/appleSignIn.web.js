import { OAuthProvider } from 'firebase/auth';
import { popupFirebaseSignIn } from './popupFirebaseSignIn.js';

export async function signInWithApple() {
  const result = await popupFirebaseSignIn(() => {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    return provider;
  });
  if (result?.cancelled) return { provider: 'apple', cancelled: true };
  if (result?.provider) return result;
  return { provider: 'apple', missing: 'apple_unavailable' };
}