import { signInWithPopup } from 'firebase/auth';
import { firebaseAuth, sessionSubjectFromUser } from './firebaseAuth.js';

const POPUP_CANCEL = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request']);

export async function popupFirebaseSignIn(createProvider) {
  const auth = firebaseAuth();
  if (!auth) return null;
  try {
    return sessionSubjectFromUser((await signInWithPopup(auth, createProvider()))?.user);
  } catch (error) {
    return POPUP_CANCEL.has(error?.code) ? { cancelled: true } : null;
  }
}