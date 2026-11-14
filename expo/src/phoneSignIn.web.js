import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseAuth, phoneSubjectFromUser } from './firebaseAuth';

let recaptchaVerifier = null;

function ensureRecaptcha(auth) {
  if (recaptchaVerifier) return recaptchaVerifier;
  recaptchaVerifier = new RecaptchaVerifier(auth, 'phone-recaptcha-anchor', {
    size: 'invisible',
  });
  return recaptchaVerifier;
}

export function PhoneRecaptcha() {
  return null;
}

export async function sendPhoneVerification(phoneNumber) {
  const auth = firebaseAuth();
  if (!auth) return { provider: 'phone', missing: 'phone_unavailable' };
  try {
    const verifier = ensureRecaptcha(auth);
    await verifier.render().catch(() => {});
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    return { provider: 'phone', phase: 'code', confirmation };
  } catch (error) {
    if (error?.code === 'auth/invalid-phone-number') {
      return { provider: 'phone', missing: 'phone_invalid' };
    }
    try {
      recaptchaVerifier?.clear?.();
    } catch {
      // ignore
    }
    recaptchaVerifier = null;
    return { provider: 'phone', missing: 'phone_unavailable' };
  }
}

export async function confirmPhoneVerification(confirmation, code) {
  if (!confirmation || !code) return { provider: 'phone', missing: 'phone_unavailable' };
  try {
    const result = await confirmation.confirm(String(code).trim());
    const subject = phoneSubjectFromUser(result?.user);
    if (!subject) return { provider: 'phone', missing: 'phone_unavailable' };
    return subject;
  } catch (error) {
    if (error?.code === 'auth/invalid-verification-code') {
      return { provider: 'phone', missing: 'phone_code_invalid' };
    }
    return { provider: 'phone', missing: 'phone_unavailable' };
  }
}