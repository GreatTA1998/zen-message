export async function acceptAppleCredential(credential, { request, saveSession, loadSession, refresh }) {
  if (!credential?.user) {
    return {
      screen: 'login',
      notice: 'Apple sign-in needs the Apple capability on this device.',
      token: null,
      user: null,
    };
  }
  try {
    const session = await request('/v1/session', {
      method: 'POST',
      body: { provider: 'apple', subject: credential.user },
    });
    if (!session?.token) throw new Error('session_missing');
    await saveSession(session.token);
    const saved = await loadSession();
    if (saved !== session.token) throw new Error('session_not_saved');
    await refresh(session);
    return { screen: 'main', notice: '', token: session.token, user: session.user };
  } catch {
    return { screen: 'login', notice: 'Could not finish sign-in.', token: null, user: null };
  }
}
