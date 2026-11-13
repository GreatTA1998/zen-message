import { getApps } from 'firebase/app';
import { deleteUser, getAuth } from 'firebase/auth';

export async function deleteFirebaseUser() {
  const app = getApps().find((item) => item.name === 'zen-auth');
  if (!app) return { ok: true, skipped: true };
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (!user) return { ok: true, skipped: true };
  try {
    await deleteUser(user);
    return { ok: true };
  } catch (error) {
    const code = error?.code;
    if (code === 'auth/requires-recent-login') {
      return { ok: false, code: 'recent_login' };
    }
    return { ok: false, code: code || 'delete_failed' };
  }
}
