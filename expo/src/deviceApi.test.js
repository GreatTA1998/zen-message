import assert from 'node:assert/strict';
import test from 'node:test';
import { createDeviceApi, memoryStorage } from './deviceApi.js';

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
