const BASE = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8787';

export async function api(path, { token, method = 'GET', body } = {}) {
  const offsetMinutes = new Date().getTimezoneOffset();
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: method === 'GET' ? undefined : JSON.stringify({ ...body, offsetMinutes }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || 'request_failed');
    error.code = payload.error || 'request_failed';
    throw error;
  }
  return payload;
}

export function inboxPath() {
  return `/v1/inbox?offset=${new Date().getTimezoneOffset()}`;
}
