import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { firebaseAuth, googleSubjectFromUser } from './firebaseAuth.js';
import { GOOGLE_WEB_CLIENT_ID } from './googleOAuth.js';

let configured = false;

function ensureConfigured() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });
  configured = true;
}

export async function completeGoogleRedirect() {
  return null;
}

export async function signInWithGoogle() {
  const auth = firebaseAuth();
  if (!auth) return { provider: 'google', missing: 'google_unavailable' };
  ensureConfigured();
  try {
    if (await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false }).catch(() => true)) {
      // iOS ignores Play Services; Android should not use this module per product scope.
    }
    const result = await GoogleSignin.signIn();
    const idToken = result?.data?.idToken;
    if (!idToken) return { provider: 'google', missing: 'google_unavailable' };
    const credential = GoogleAuthProvider.credential(idToken);
    const userResult = await signInWithCredential(auth, credential);
    const subject = googleSubjectFromUser(userResult?.user);
    if (!subject) return { provider: 'google', missing: 'google_unavailable' };
    return subject;
  } catch (error) {
    const code = error?.code;
    if (code === 'SIGN_IN_CANCELLED' || code === '-5') {
      return { provider: 'google', cancelled: true };
    }
    return { provider: 'google', missing: 'google_unavailable' };
  }
}
