import { createCloudApi } from './cloudApi.js';

const configured = process.env.EXPO_PUBLIC_API_URL || '';
let cloud = null;

function loopback(url) {
  return /^https?:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/.test(url);
}

function hostedBase() {
  if (configured && !loopback(configured) && configured !== 'firestore') return configured;
  return null;
}

export async function api(path, options = {}) {
  const base = hostedBase();
  if (base) return remoteApi(base, path, options);
  if (!cloud) cloud = createCloudApi();
  return cloud(path, options);
}

async function remoteApi(base, path, { token, method = 'GET', body } = {}) {
  const offsetMinutes = new Date().getTimezoneOffset();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  let response;
  try {
    response = await fetch(`${base}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: method === 'GET' ? undefined : JSON.stringify({ ...body, offsetMinutes }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
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
