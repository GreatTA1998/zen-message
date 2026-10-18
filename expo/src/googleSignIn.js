export async function signInWithGoogle() {
  return { provider: 'google', missing: 'google_unavailable' };
}

export async function completeGoogleRedirect() {
  return null;
}
