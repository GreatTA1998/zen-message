export async function acceptAppleCredential(credential, deps) {
  return finishSignIn('apple', credential, deps);
}

const SESSION_PROVIDERS = new Set(['apple', 'google', 'phone']);

export async function finishSignIn(provider, credential, { request, saveSession, loadSession, refresh }) {
  if (!credential?.user) {
    return {
      screen: 'login',
      notice: 'Sign-in could not be completed on this device.',
      token: null,
      user: null,
    };
  }
  const sessionProvider = SESSION_PROVIDERS.has(provider) ? provider : null;
  if (!sessionProvider) {
    return { screen: 'login', notice: 'Could not finish sign-in.', token: null, user: null };
  }
  try {
    const session = await request('/v1/session', {
      method: 'POST',
      body: {
        provider: sessionProvider,
        subject: credential.user,
        firstName: credential.firstName || '',
      },
    });
    if (!session?.token) throw new Error('session_missing');
    await saveSession(session.token);
    const saved = await loadSession();
    if (saved !== session.token) throw new Error('session_not_saved');
    await refresh(session);
    const screen = session.user?.onboarded ? 'main' : 'onboarding';
    return { screen, notice: '', token: session.token, user: session.user };
  } catch {
    return { screen: 'login', notice: 'Could not finish sign-in.', token: null, user: null };
  }
}
