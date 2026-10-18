import assert from 'node:assert/strict';
import test from 'node:test';
import { createDeviceApi, memoryStorage } from './deviceApi.js';

test('an Apple credential opens a session when the phone has no Web Crypto', async () => {
  const api = createDeviceApi(memoryStorage(), (length) => new Uint8Array(length).fill(4));
  const previous = globalThis.crypto;
  Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true });
  try {
    const session = await api('/v1/session', {
      method: 'POST',
      body: { provider: 'apple', subject: 'apple-user-001' },
    });
    assert.equal(session.token, '04'.repeat(24));
    assert.equal(session.user.id, '555');
    const inbox = await api('/v1/inbox?offset=0', { token: session.token });
    assert.equal(inbox.user.id, '555');
  } finally {
    Object.defineProperty(globalThis, 'crypto', { value: previous, configurable: true });
  }
});

test('an Apple credential opens a session on the device', async () => {
  const api = createDeviceApi(memoryStorage());
  const session = await api('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-user-001' },
  });
  assert.equal(typeof session.token, 'string');
  assert.equal(session.token.length, 48);
  assert.equal(session.user.provider, 'apple');
  assert.match(session.user.id, /^[023456789ABCDEFGHJKMNOPQRSTUVWXYZ]{3}$/);

  const inbox = await api(`/v1/inbox?offset=${new Date().getTimezoneOffset()}`, { token: session.token });
  assert.equal(inbox.user.id, session.user.id);
  assert.equal(inbox.state.mode, 'batched');
  assert.equal(inbox.state.scheduleId, 'daily-1-7');
  assert.deepEqual(inbox.contacts, []);
});

test('the same Apple credential keeps the same person after a relaunch', async () => {
  const storage = memoryStorage();
  const first = createDeviceApi(storage);
  const created = await first('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-user-001' },
  });
  const second = createDeviceApi(storage);
  const again = await second('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-user-001' },
  });
  assert.equal(again.user.id, created.user.id);
  assert.notEqual(again.token, created.token);
  const inbox = await second('/v1/inbox?offset=0', { token: again.token });
  assert.equal(inbox.user.id, created.user.id);
});

test('two clients on one store can add each other and exchange a message', async () => {
  let raw = null;
  const storage = {
    async transact(work) {
      const box = { value: raw };
      const result = await work({
        async getItem() {
          return box.value;
        },
        async setItem(_key, value) {
          box.value = value;
        },
      });
      raw = box.value;
      return result;
    },
  };
  const phone = createDeviceApi(storage, (length) => new Uint8Array(length).fill(4));
  const web = createDeviceApi(storage, (length) => new Uint8Array(length).fill(5));
  const apple = await phone('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-user-phone' },
  });
  const google = await web('/v1/session', {
    method: 'POST',
    body: { provider: 'google', subject: 'google-user-laptop' },
  });
  assert.equal(apple.user.provider, 'apple');
  assert.equal(google.user.provider, 'google');
  assert.notEqual(apple.user.id, google.user.id);
  await phone('/v1/contacts', { token: apple.token, method: 'POST', body: { code: google.user.id } });
  await web('/v1/contacts', { token: google.token, method: 'POST', body: { code: apple.user.id } });
  await phone('/v1/messages', {
    token: apple.token,
    method: 'POST',
    body: { contactId: google.user.id, body: 'hello from the phone', intent: 'realtime' },
  });
  const inbox = await web('/v1/inbox?offset=0', { token: google.token });
  assert.equal(inbox.contacts.some((item) => item.id === apple.user.id), true);
  assert.equal(
    inbox.state.messages.some((message) => message.body === 'hello from the phone' && message.visible),
    true
  );
});

test('a token from a previous install still opens the inbox', async () => {
  const storage = memoryStorage();
  const api = createDeviceApi(storage);
  const session = await api('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-user-001' },
  });
  const reopened = createDeviceApi(storage);
  const inbox = await reopened('/v1/inbox?offset=0', { token: session.token });
  assert.equal(inbox.user.id, session.user.id);
});
