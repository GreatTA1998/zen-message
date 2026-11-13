import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth, googleSubjectFromUser } from './firebaseAuth.js';

export { GOOGLE_REDIRECT_URI } from './firebaseAuth.js';

export async function completeGoogleRedirect() {
  return null;
}

export async function signInWithGoogle() {
  const auth = firebaseAuth();
  if (!auth) return { provider: 'google', missing: 'google_unavailable' };
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await signInWithPopup(auth, provider);
    const subject = googleSubjectFromUser(result?.user);
    if (!subject) return { provider: 'google', missing: 'google_unavailable' };
    return subject;
  } catch (error) {
    const code = error?.code;
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return { provider: 'google', cancelled: true };
    }
    return { provider: 'google', missing: 'google_unavailable' };
  }
}
