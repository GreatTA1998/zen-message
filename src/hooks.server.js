import { isFirebaseAuthPath, proxyFirebaseAuth } from '$lib/firebaseAuthProxy.js';

export async function handle({ event, resolve }) {
  if (isFirebaseAuthPath(event.url.pathname)) {
    return proxyFirebaseAuth(event.request);
  }
  return resolve(event);
}
