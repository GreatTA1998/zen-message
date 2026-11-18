const SESSION_PROVIDERS = new Set(['apple', 'google']);
const signInFail = (notice = 'Could not finish sign-in.') => ({ screen: 'login', notice, token: null, user: null });

export const acceptAppleCredential = (credential, deps) => finishSignIn('apple', credential, deps);

export async function finishSignIn(provider, credential, { request, saveSession, loadSession, refresh }) {
  if (!credential?.user) return signInFail('Sign-in could not be completed on this device.');
  if (!SESSION_PROVIDERS.has(provider)) return signInFail();
  try {
    const session = await request('/v1/session', {
      method: 'POST',
      body: {
        provider,
        subject: credential.user,
        firstName: credential.firstName || '',
        email: credential.email || '',
      },
    });
    if (!session?.token) throw new Error('session_missing');
    await saveSession(session.token);
    if ((await loadSession()) !== session.token) throw new Error('session_not_saved');
    await refresh(session);
    return { screen: session.user?.onboarded ? 'main' : 'onboarding', notice: '', token: session.token, user: session.user };
  } catch {
    return signInFail();
  }
}