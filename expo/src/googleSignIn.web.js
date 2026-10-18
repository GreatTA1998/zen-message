import { initializeApp, getApps } from 'firebase/app';
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

const APP_HOST = 'zen-messenger.vercel.app';
export const GOOGLE_REDIRECT_URI = 'https://zen-messenger.vercel.app/__/auth/handler';

const firebaseConfig = {
  apiKey: 'AIzaSyCMj9SsNMKDI9EezOzg_jowsYUOfaCbivc',
  authDomain: APP_HOST,
  projectId: 'project-z-e00fd',
  storageBucket: 'project-z-e00fd.appspot.com',
  messagingSenderId: '37588438028',
  appId: '1:37588438028:web:82c870a2fe6af985d67229',
};

function googleAuth() {
  const name = 'zen-google';
  const existing = getApps().find((app) => app.name === name);
  const app = existing ?? initializeApp(firebaseConfig, name);
  if (app.options.authDomain !== APP_HOST) return null;
  if (`https://${app.options.authDomain}/__/auth/handler` !== GOOGLE_REDIRECT_URI) return null;
  return getAuth(app);
}

function subjectFrom(user) {
  if (!user?.uid) return null;
  return { provider: 'google', subject: user.uid };
}

export async function completeGoogleRedirect() {
  const auth = googleAuth();
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth);
    return subjectFrom(result?.user);
  } catch {
    return null;
  }
}

export async function signInWithGoogle() {
  const auth = googleAuth();
  if (!auth || window.location.hostname !== APP_HOST) {
    return { provider: 'google', missing: 'google_unavailable' };
  }
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await signInWithRedirect(auth, provider);
    return { provider: 'google', pending: true };
  } catch {
    return { provider: 'google', missing: 'google_unavailable' };
  }
}
