import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import Constants from 'expo-constants';
import { firebaseAuth, googleSubjectFromUser } from './firebaseAuth.js';
import { GOOGLE_IOS_CLIENT_ID as ENV_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from './googleOAuth.js';

const GOOGLE_IOS_CLIENT_ID =
  ENV_IOS_CLIENT_ID || Constants.expoConfig?.extra?.googleIosClientId || '';

let configured = false;

function ensureConfigured() {
  if (configured || !GOOGLE_IOS_CLIENT_ID) return;
  GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID, iosClientId: GOOGLE_IOS_CLIENT_ID, offlineAccess: false });
  configured = true;
}

export const completeGoogleRedirect = async () => null;

export async function signInWithGoogle() {
  const auth = firebaseAuth();
  if (!auth || !GOOGLE_IOS_CLIENT_ID) return { provider: 'google', missing: 'google_unavailable' };
  ensureConfigured();
  try {
    const idToken = (await GoogleSignin.signIn())?.data?.idToken;
    if (!idToken) return { provider: 'google', missing: 'google_unavailable' };
    const subject = googleSubjectFromUser((await signInWithCredential(auth, GoogleAuthProvider.credential(idToken)))?.user);
    if (!subject) return { provider: 'google', missing: 'google_unavailable' };
    return subject;
  } catch (error) {
    const code = error?.code;
    if (code === 'SIGN_IN_CANCELLED' || code === '-5') return { provider: 'google', cancelled: true };
    return { provider: 'google', missing: 'google_unavailable' };
  }
}