import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const AUTH_DOMAIN = 'project-z-e00fd.firebaseapp.com';
export const GOOGLE_REDIRECT_URI = `https://${AUTH_DOMAIN}/__/auth/handler`;

export const firebaseConfig = {
  apiKey: 'AIzaSyCMj9SsNMKDI9EezOzg_jowsYUOfaCbivc',
  authDomain: AUTH_DOMAIN,
  projectId: 'project-z-e00fd',
  storageBucket: 'project-z-e00fd.appspot.com',
  messagingSenderId: '37588438028',
  appId: '1:37588438028:web:82c870a2fe6af985d67229',
};

const APP_NAME = 'zen-auth';

export function firebaseAuth() {
  const existing = getApps().find((app) => app.name === APP_NAME);
  const app = existing ?? initializeApp(firebaseConfig, APP_NAME);
  if (app.options.authDomain !== AUTH_DOMAIN) return null;
  if (`https://${app.options.authDomain}/__/auth/handler` !== GOOGLE_REDIRECT_URI) return null;
  return getAuth(app);
}

export function firstNameFromDisplay(displayName) {
  const word = String(displayName || '').trim().split(/\s+/)[0] || '';
  return word.slice(0, 18);
}

export function appleSubjectFromUser(user) {
  if (!user) return null;
  const linked = user.providerData?.find((entry) => entry.providerId === 'apple.com');
  const subject = linked?.uid;
  if (!subject || subject.length < 4) return null;
  return {
    provider: 'apple',
    subject,
    firstName: firstNameFromDisplay(linked?.displayName || user.displayName),
  };
}

export function googleSubjectFromUser(user) {
  if (!user?.uid) return null;
  return {
    provider: 'google',
    subject: user.uid,
    firstName: firstNameFromDisplay(user.displayName),
  };
}

export function phoneSubjectFromUser(user) {
  if (!user?.uid) return null;
  return {
    provider: 'phone',
    subject: user.uid,
    firstName: firstNameFromDisplay(user.displayName),
  };
}
