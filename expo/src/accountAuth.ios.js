import { deleteUser } from 'firebase/auth';
import { firebaseAuth } from './firebaseAuth';

export async function deleteFirebaseUser() {
  const auth = firebaseAuth();
  const user = auth?.currentUser;
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