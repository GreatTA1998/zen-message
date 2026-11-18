import { GoogleAuthProvider } from 'firebase/auth';
import { authHandlerUrl } from './firebaseAuth.js';
import { popupFirebaseSignIn } from './popupFirebaseSignIn.js';

export const GOOGLE_REDIRECT_URI = authHandlerUrl;

export async function completeGoogleRedirect() {
  return null;
}

export async function signInWithGoogle() {
  const result = await popupFirebaseSignIn(() => new GoogleAuthProvider());
  if (result?.cancelled) return { provider: 'google', cancelled: true };
  if (result?.provider) return result;
  return { provider: 'google', missing: 'google_unavailable' };
}