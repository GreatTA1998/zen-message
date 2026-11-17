import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const FIREBASE_AUTH_HOST = 'project-z-e00fd.firebaseapp.com';
const APP_AUTH_HOSTS = new Set([
  'zen-messenger.vercel.app',
  'zen-message.com',
  'www.zen-message.com',
]);

export function resolveAuthDomain(hostname = '') {
  return APP_AUTH_HOSTS.has(hostname) ? hostname : FIREBASE_AUTH_HOST;
}

export function authDomain() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  return resolveAuthDomain(hostname);
}

export function authHandlerUrl(domain = authDomain()) {
  return `https://${domain}/__/auth/handler`;
}

export const firebaseConfig = {
  apiKey: 'AIzaSyCMj9SsNMKDI9EezOzg_jowsYUOfaCbivc',
  projectId: 'project-z-e00fd',
  storageBucket: 'project-z-e00fd.appspot.com',
  messagingSenderId: '37588438028',
  appId: '1:37588438028:web:82c870a2fe6af985d67229',
};

const APP_NAME = 'zen-auth';

export function firebaseAuth() {
  const domain = authDomain();
  const existing = getApps().find((app) => app.name === APP_NAME);
  const app = existing ?? initializeApp({ ...firebaseConfig, authDomain: domain }, APP_NAME);
  if (app.options.authDomain !== domain) return null;
  return getAuth(app);
}

export function firstNameFromDisplay(displayName) {
  const word = String(displayName || '').trim().split(/\s+/)[0] || '';
  return word.slice(0, 18);
}

function withEmail(subject, user) {
  const email = typeof user?.email === 'string' ? user.email.trim().toLowerCase() : '';
  return email ? { ...subject, email } : subject;
}

export function appleSubjectFromUser(user) {
  if (!user) return null;
  const linked = user.providerData?.find((entry) => entry.providerId === 'apple.com');
  const subject = linked?.uid;
  if (!subject || subject.length < 4) return null;
  return withEmail(
    {
      provider: 'apple',
      subject,
      firstName: firstNameFromDisplay(linked?.displayName || user.displayName),
    },
    user
  );
}

export function googleSubjectFromUser(user) {
  if (!user?.uid) return null;
  return withEmail(
    {
      provider: 'google',
      subject: user.uid,
      firstName: firstNameFromDisplay(user.displayName),
    },
    user
  );
}

export function phoneSubjectFromUser(user) {
  if (!user?.uid) return null;
  return withEmail(
    {
      provider: 'phone',
      subject: user.uid,
      firstName: firstNameFromDisplay(user.displayName),
    },
    user
  );
}

export function sessionSubjectFromUser(user) {
  return appleSubjectFromUser(user) || googleSubjectFromUser(user) || phoneSubjectFromUser(user);
}

export async function restoreAuthSubject() {
  const auth = firebaseAuth();
  if (!auth?.authStateReady) return null;
  try {
    await auth.authStateReady();
    return sessionSubjectFromUser(auth.currentUser);
  } catch {
    return null;
  }
}

/** @deprecated use authHandlerUrl() — kept for older web tests */
export const AUTH_DOMAIN = FIREBASE_AUTH_HOST;
export const GOOGLE_REDIRECT_URI = `https://${FIREBASE_AUTH_HOST}/__/auth/handler`;
