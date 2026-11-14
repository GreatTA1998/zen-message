import { signInWithPhoneNumber } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseAuth, firebaseConfig, phoneSubjectFromUser } from './firebaseAuth';

export function PhoneRecaptcha({ recaptchaRef }) {
  return (
    <FirebaseRecaptchaVerifierModal
      ref={recaptchaRef}
      firebaseConfig={firebaseConfig}
      attemptInvisibleVerification
    />
  );
}

export async function sendPhoneVerification(phoneNumber, recaptchaRef) {
  const auth = firebaseAuth();
  const verifier = recaptchaRef?.current;
  if (!auth || !verifier) return { provider: 'phone', missing: 'phone_unavailable' };
  try {
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    return { provider: 'phone', phase: 'code', confirmation };
  } catch (error) {
    if (error?.code === 'auth/invalid-phone-number') {
      return { provider: 'phone', missing: 'phone_invalid' };
    }
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