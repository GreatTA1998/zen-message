import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseAuth, phoneSubjectFromUser } from './firebaseAuth';

let recaptchaVerifier = null;
let recaptchaHost = null;

function currentRecaptchaHost() {
  if (typeof document === 'undefined') return null;
  const host = document.getElementById('phone-recaptcha-anchor');
  return host && host.isConnected ? host : null;
}

function clearRecaptcha() {
  try {
    recaptchaVerifier?.clear?.();
  } catch {
    // ignore
  }
  recaptchaVerifier = null;
  recaptchaHost = null;
}

function ensureRecaptcha(auth) {
  const host = currentRecaptchaHost();
  if (recaptchaVerifier && host && recaptchaHost === host) return recaptchaVerifier;
  clearRecaptcha();
  recaptchaVerifier = new RecaptchaVerifier(auth, host || 'phone-recaptcha-anchor', {
    size: 'invisible',
  });
  recaptchaHost = host;
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
    clearRecaptcha();
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