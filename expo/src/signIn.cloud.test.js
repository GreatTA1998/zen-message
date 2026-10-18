import assert from 'node:assert/strict';
import test from 'node:test';
import { createDeviceApi, memoryStorage } from './deviceApi.js';
import { acceptAppleCredential } from './signIn.js';

test('a successful Apple credential saves the session and leaves the login screen', async () => {
  const previous = globalThis.crypto;
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      getRandomValues() {
        throw new TypeError('crypto.getRandomValues is not available');
      },
    },
    configurable: true,
  });
  const sessions = new Map();
  const request = createDeviceApi(memoryStorage());
  const credential = {
    user: '001234.stubapple.credential',
    email: null,
    fullName: null,
    identityToken: 'stub-identity-token',
    authorizationCode: 'stub-authorization-code',
  };
  try {
    const outcome = await acceptAppleCredential(credential, {
      request,
      async saveSession(token) {
        sessions.set('current', token);
      },
      async loadSession() {
        return sessions.get('current') ?? null;
      },
      async refresh(session) {
        const inbox = await request('/v1/inbox?offset=0', { token: session.token });
        if (inbox?.user?.id !== session.user.id) throw new Error('inbox_missing');
      },
    });
    assert.notEqual(outcome.screen, 'login');
    assert.notEqual(outcome.notice, 'Could not finish sign-in.');
    assert.equal(outcome.screen, 'main');
    assert.equal(typeof outcome.token, 'string');
    assert.ok(outcome.token.length > 0);
    assert.equal(sessions.get('current'), outcome.token);
    const saved = await request('/v1/inbox?offset=0', { token: sessions.get('current') });
    assert.equal(saved.user.id, outcome.user.id);
    assert.equal(saved.user.provider, 'apple');
  } finally {
    Object.defineProperty(globalThis, 'crypto', { value: previous, configurable: true });
  }
});
