export function PhoneRecaptcha() {
  return null;
}

export async function sendPhoneVerification() {
  return { provider: 'phone', missing: 'phone_unavailable' };
}

export async function confirmPhoneVerification() {
  return { provider: 'phone', missing: 'phone_unavailable' };
}