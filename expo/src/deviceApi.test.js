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
    assert.match(session.user.id, /^[023456789ABCDEFGHJKMNOPQRSTUVWXYZ]{3}$/);
    const inbox = await api('/v1/inbox?offset=0', { token: session.token });
    assert.equal(inbox.user.id, session.user.id);
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

test('the same account gets the same ID on an empty store', async () => {
  const open = () =>
    createDeviceApi(memoryStorage())('/v1/session', {
      method: 'POST',
      body: { provider: 'apple', subject: 'apple-user-001', firstName: 'Ada Lovelace' },
    });
  const first = await open();
  const again = await open();
  assert.equal(again.user.id, first.user.id);
  assert.equal(first.user.firstName, 'Ada');
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
  await phone('/v1/messages', {
    token: apple.token,
    method: 'POST',
    body: { contactId: google.user.id, body: 'hello from the phone', intent: 'realtime' },
  });
  const inbox = await web('/v1/inbox?offset=0', { token: google.token });
  assert.equal(inbox.contacts.some((item) => item.id === apple.user.id), true);
  assert.equal(inbox.state.contactId, apple.user.id);
  assert.equal(
    inbox.state.messages.some((message) => message.body === 'hello from the phone' && message.visible),
    true
  );
});

function sharedStore() {
  let raw = null;
  const delivered = [];
  return {
    delivered,
    async transact(work) {
      const box = { value: raw };
      const result = await work({
        async getItem() {
          return box.value;
        },
        async setItem(_key, value) {
          box.value = value;
        },
        onDeliver(recipient, effects) {
          delivered.push({
            id: recipient.id,
            pushToken: recipient.pushToken,
            effects,
          });
        },
      });
      raw = box.value;
      return result;
    },
  };
}

function presents(delivered, id) {
  return delivered
    .filter((item) => item.id === id)
    .flatMap((item) => item.effects)
    .filter((effect) => effect.type === 'present');
}

test('a web realtime message alerts the signed-in phone once', async () => {
  const storage = sharedStore();
  const phone = createDeviceApi(storage, (length) => new Uint8Array(length).fill(4));
  const web = createDeviceApi(storage, (length) => new Uint8Array(length).fill(5));
  const apple = await phone('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-user-phone', firstName: 'Ada' },
  });
  const google = await web('/v1/session', {
    method: 'POST',
    body: { provider: 'google', subject: 'google-user-laptop' },
  });
  await phone('/v1/push-token', { token: apple.token, method: 'POST', body: { token: 'not-a-device-token' } });
  const registered = await phone('/v1/push-token', {
    token: apple.token,
    method: 'POST',
    body: { token: 'ExponentPushToken[phonephonephone]' },
  });
  assert.equal(registered.ok, true);
  await web('/v1/contacts', { token: google.token, method: 'POST', body: { code: apple.user.id } });
  const sent = await web('/v1/messages', {
    token: google.token,
    method: 'POST',
    body: { contactId: apple.user.id, body: 'hello from the web', intent: 'realtime' },
  });
  assert.equal(JSON.stringify(sent).includes('relax'), false);
  const alerts = presents(storage.delivered, apple.user.id);
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].plan.data.kind, 'realtime');
  assert.equal(alerts[0].plan.quiet, false);
  assert.equal(storage.delivered.find((item) => item.id === apple.user.id).pushToken, 'ExponentPushToken[phonephonephone]');
  const inbox = await phone('/v1/inbox?offset=0', { token: apple.token });
  assert.equal(inbox.state.messages.some((message) => message.body === 'hello from the web' && message.visible), true);
  assert.equal(presents(storage.delivered, apple.user.id).length, 1);
});

test('batched anytime and timely wait for one digest, and relaxed stays private', async () => {
  const storage = sharedStore();
  const phone = createDeviceApi(storage, (length) => new Uint8Array(length).fill(6));
  const web = createDeviceApi(storage, (length) => new Uint8Array(length).fill(7));
  const apple = await phone('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-user-phone' },
  });
  const google = await web('/v1/session', {
    method: 'POST',
    body: { provider: 'google', subject: 'google-user-laptop' },
  });
  await phone('/v1/push-token', {
    token: apple.token,
    method: 'POST',
    body: { token: 'ExponentPushToken[phonephonephone]' },
  });
  await web('/v1/contacts', { token: google.token, method: 'POST', body: { code: apple.user.id } });
  const anytime = await web('/v1/messages', {
    token: google.token,
    method: 'POST',
    body: { contactId: apple.user.id, body: 'later today', intent: 'anytime' },
  });
  const timely = await web('/v1/messages', {
    token: google.token,
    method: 'POST',
    body: { contactId: apple.user.id, body: 'no rush', intent: 'timely' },
  });
  assert.equal(JSON.stringify(anytime).includes('relax'), false);
  assert.equal(JSON.stringify(timely).includes('relax'), false);
  assert.equal(presents(storage.delivered, apple.user.id).length, 0);
  const hidden = await phone('/v1/inbox?offset=0', { token: apple.token });
  assert.equal(hidden.state.messages.every((message) => message.visible === false), true);
  assert.equal(presents(storage.delivered, apple.user.id).length, 0);

  await storage.transact(async (store) => {
    const state = JSON.parse(await store.getItem('zen-message.device'));
    state.users[apple.user.id].digest.at = Date.now() - 1000;
    await store.setItem('zen-message.device', JSON.stringify(state));
  });
  const opened = await web('/v1/inbox?offset=0', { token: google.token });
  assert.equal(JSON.stringify(opened).includes('relax'), false);
  const digests = presents(storage.delivered, apple.user.id);
  assert.equal(digests.length, 1);
  assert.equal(digests[0].plan.data.kind, 'digest');
  assert.equal(digests[0].plan.data.messageIds.length, 2);
  const revealed = await phone('/v1/inbox?offset=0', { token: apple.token });
  assert.equal(revealed.state.messages.every((message) => message.visible), true);
  assert.equal(presents(storage.delivered, apple.user.id).length, 1);

  await phone('/v1/mode', { token: apple.token, method: 'POST', body: { mode: 'relaxed' } });
  const quiet = await web('/v1/messages', {
    token: google.token,
    method: 'POST',
    body: { contactId: apple.user.id, body: 'readable now', intent: 'anytime' },
  });
  assert.equal(JSON.stringify(quiet).includes('relax'), false);
  assert.equal(presents(storage.delivered, apple.user.id).length, 1);
  const readable = await phone('/v1/inbox?offset=0', { token: apple.token });
  assert.equal(readable.state.messages.some((message) => message.body === 'readable now' && message.visible), true);
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
