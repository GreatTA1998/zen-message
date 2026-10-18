import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const AUTH_DOMAIN = 'project-z-e00fd.firebaseapp.com';
export const GOOGLE_REDIRECT_URI = 'https://project-z-e00fd.firebaseapp.com/__/auth/handler';

const firebaseConfig = {
  apiKey: 'AIzaSyCMj9SsNMKDI9EezOzg_jowsYUOfaCbivc',
  authDomain: AUTH_DOMAIN,
  projectId: 'project-z-e00fd',
  storageBucket: 'project-z-e00fd.appspot.com',
  messagingSenderId: '37588438028',
  appId: '1:37588438028:web:82c870a2fe6af985d67229',
};

function googleAuth() {
  const name = 'zen-google';
  const existing = getApps().find((app) => app.name === name);
  const app = existing ?? initializeApp(firebaseConfig, name);
  if (app.options.authDomain !== AUTH_DOMAIN) return null;
  if (`https://${app.options.authDomain}/__/auth/handler` !== GOOGLE_REDIRECT_URI) return null;
  return getAuth(app);
}

function subjectFrom(user) {
  if (!user?.uid) return null;
  const word = String(user.displayName || '').trim().split(/\s+/)[0] || '';
  return { provider: 'google', subject: user.uid, firstName: word.slice(0, 18) };
}

export async function completeGoogleRedirect() {
  return null;
}

export async function signInWithGoogle() {
  const auth = googleAuth();
  if (!auth) return { provider: 'google', missing: 'google_unavailable' };
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await signInWithPopup(auth, provider);
    const subject = subjectFrom(result?.user);
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
