import { OAuthProvider, signInWithPopup } from 'firebase/auth';
import { appleSubjectFromUser, firebaseAuth } from './firebaseAuth.js';

export async function signInWithApple() {
  const auth = firebaseAuth();
  if (!auth) return { provider: 'apple', missing: 'apple_unavailable' };
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  try {
    const result = await signInWithPopup(auth, provider);
    const subject = appleSubjectFromUser(result?.user);
    if (!subject) return { provider: 'apple', missing: 'apple_unavailable' };
    return subject;
  } catch (error) {
    const code = error?.code;
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return { provider: 'apple', cancelled: true };
    }
    return { provider: 'apple', missing: 'apple_unavailable' };
  }
}
