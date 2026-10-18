import { Platform } from 'react-native';
import { createDeviceApi } from './deviceApi.js';

const configured = process.env.EXPO_PUBLIC_API_URL || '';
let device = null;

function loopback(url) {
  return /^https?:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/.test(url);
}

function remoteBase() {
  if (configured && !loopback(configured)) return configured;
  if (Platform.OS === 'web') return configured || 'http://127.0.0.1:8787';
  return null;
}

async function deviceRequest(path, options) {
  if (!device) {
    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
    device = createDeviceApi(AsyncStorage);
  }
  return device(path, options);
}

export async function api(path, options = {}) {
  const base = remoteBase();
  if (!base) return deviceRequest(path, options);
  return remoteApi(base, path, options);
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
