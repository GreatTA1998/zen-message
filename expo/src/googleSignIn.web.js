import { initializeApp, getApps } from 'firebase/app';
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCMj9SsNMKDI9EezOzg_jowsYUOfaCbivc',
  authDomain: 'project-z-e00fd.firebaseapp.com',
  projectId: 'project-z-e00fd',
  storageBucket: 'project-z-e00fd.appspot.com',
  messagingSenderId: '37588438028',
  appId: '1:37588438028:web:82c870a2fe6af985d67229',
};

function auth() {
  const app = getApps()[0] ?? initializeApp(firebaseConfig);
  return getAuth(app);
}

function subjectFrom(user) {
  if (!user?.uid) return null;
  return { provider: 'google', subject: user.uid };
}

export async function completeGoogleRedirect() {
  const result = await getRedirectResult(auth());
  return subjectFrom(result?.user);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await signInWithPopup(auth(), provider);
    const subject = subjectFrom(result?.user);
    if (!subject) return { provider: 'google', missing: 'google_unavailable' };
    return subject;
  } catch (error) {
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      return { provider: 'google', cancelled: true };
    }
    if (
      error?.code === 'auth/popup-blocked' ||
      error?.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      await signInWithRedirect(auth(), provider);
      return { provider: 'google', pending: true };
    }
    return { provider: 'google', missing: 'google_unavailable' };
  }
}
