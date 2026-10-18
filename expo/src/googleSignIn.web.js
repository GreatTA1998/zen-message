import { initializeApp, getApps } from 'firebase/app';
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';

const FIREBASE_AUTH_DOMAIN = 'project-z-e00fd.firebaseapp.com';
const APP_HOST = 'zen-messenger.vercel.app';

const firebaseConfig = {
  apiKey: 'AIzaSyCMj9SsNMKDI9EezOzg_jowsYUOfaCbivc',
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: 'project-z-e00fd',
  storageBucket: 'project-z-e00fd.appspot.com',
  messagingSenderId: '37588438028',
  appId: '1:37588438028:web:82c870a2fe6af985d67229',
};

function authFor(name, authDomain) {
  const existing = getApps().find((app) => app.name === name);
  const app = existing ?? initializeApp({ ...firebaseConfig, authDomain }, name);
  return getAuth(app);
}

function popupAuth() {
  return authFor('zen-google-popup', FIREBASE_AUTH_DOMAIN);
}

function redirectAuth() {
  return authFor('zen-google-redirect', APP_HOST);
}

function subjectFrom(user) {
  if (!user?.uid) return null;
  return { provider: 'google', subject: user.uid };
}

export async function completeGoogleRedirect() {
  const auths = [redirectAuth(), popupAuth()];
  for (const auth of auths) {
    try {
      const result = await getRedirectResult(auth);
      const subject = subjectFrom(result?.user);
      if (subject) return subject;
    } catch {
      // This auth instance has no pending redirect.
    }
  }
  return null;
}

function openSignInPopup() {
  const width = 500;
  const height = 700;
  const availHeight = window.screen?.availHeight ?? height;
  const availWidth = window.screen?.availWidth ?? width;
  const top = Math.max((availHeight - height) / 2, 0);
  const left = Math.max((availWidth - width) / 2, 0);
  const features = `popup=yes,width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`;
  try {
    const popup = window.open('about:blank', 'zen-google-sign-in', features);
    if (!popup || popup.closed) return null;
    try {
      popup.document.write('<!doctype html><title>Zen Message</title><p style="font:16px sans-serif">Signing in with Google…</p>');
      popup.document.close();
    } catch {
      // The popup can still navigate if the placeholder cannot be written.
    }
    return popup;
  } catch {
    return null;
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const popup = openSignInPopup();
  if (!popup) return firstPartyRedirect(provider);

  const originalOpen = window.open.bind(window);
  window.open = (url, name, specs) => {
    if (typeof url === 'string' && url.includes('/__/auth/handler')) {
      popup.location.replace(url);
      popup.focus?.();
      return popup;
    }
    return originalOpen(url, name, specs);
  };
  try {
    const result = await signInWithPopup(popupAuth(), provider);
    const subject = subjectFrom(result?.user);
    if (!subject) return { provider: 'google', missing: 'google_unavailable' };
    return subject;
  } catch (error) {
    const code = error?.code;
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return { provider: 'google', cancelled: true };
    }
    try {
      if (!popup.closed) popup.close();
    } catch {
      // The browser may already have closed the popup.
    }
    if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
      return firstPartyRedirect(provider);
    }
    return { provider: 'google', missing: 'google_unavailable' };
  } finally {
    window.open = originalOpen;
  }
}

async function firstPartyRedirect(provider) {
  if (window.location.hostname !== APP_HOST) {
    return { provider: 'google', missing: 'google_unavailable' };
  }
  try {
    await signInWithRedirect(redirectAuth(), provider);
    return { provider: 'google', pending: true };
  } catch {
    return { provider: 'google', missing: 'google_unavailable' };
  }
}
