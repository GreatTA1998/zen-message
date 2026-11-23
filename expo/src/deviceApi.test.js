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
  assert.equal(inbox.state.dayHour, 19);
  assert.equal(inbox.state.dayMinute, 0);
  assert.deepEqual(inbox.contacts, []);
});

test('the same account gets the same ID on an empty store', async () => {
  const api = createDeviceApi(memoryStorage());
  const open = () =>
    api('/v1/session', {
      method: 'POST',
      body: { provider: 'apple', subject: 'apple-user-001' },
    });
  const first = await open();
  const again = await open();
  assert.equal(again.user.id, first.user.id);
  const profile = await api('/v1/profile', {
    token: first.token,
    method: 'POST',
    body: { nickname: 'Ada Lovelace' },
  });
  assert.equal(profile.user.firstName, 'Ada');
  assert.equal(profile.user.onboarded, true);
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
  await phone('/v1/profile', { token: apple.token, method: 'POST', body: { nickname: 'Ada' } });
  await web('/v1/profile', { token: google.token, method: 'POST', body: { nickname: 'Gus' } });
  await phone('/v1/contacts', { token: apple.token, method: 'POST', body: { code: google.user.id } });
  let blocked = false;
  try {
    await phone('/v1/messages', {
      token: apple.token,
      method: 'POST',
      body: { contactId: google.user.id, body: 'hello from the phone', intent: 'realtime' },
    });
  } catch {
    blocked = true;
  }
  assert.equal(blocked, true);
  let pending = await web('/v1/inbox?offset=0', { token: google.token });
  assert.equal(
    pending.contacts.some((item) => item.id === apple.user.id && item.status === 'pending-in'),
    true
  );
  await web('/v1/friend-request/accept', { token: google.token, method: 'POST', body: { contactId: apple.user.id } });
  await phone('/v1/messages', {
    token: apple.token,
    method: 'POST',
    body: { contactId: google.user.id, body: 'hello from the phone', intent: 'realtime' },
  });
  const inbox = await web('/v1/inbox?offset=0', { token: google.token });
  assert.equal(inbox.contacts.some((item) => item.id === apple.user.id && item.status === 'active'), true);
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

test('notify-all persists per contact and alerts on zen replies', async () => {
  const storage = sharedStore();
  const phone = createDeviceApi(storage, (length) => new Uint8Array(length).fill(4));
  const web = createDeviceApi(storage, (length) => new Uint8Array(length).fill(5));
  const apple = await phone('/v1/session', { method: 'POST', body: { provider: 'apple', subject: 'apple-notify-all' } });
  const google = await web('/v1/session', { method: 'POST', body: { provider: 'google', subject: 'google-notify-all' } });
  await phone('/v1/profile', { token: apple.token, method: 'POST', body: { nickname: 'Ada' } });
  await web('/v1/profile', { token: google.token, method: 'POST', body: { nickname: 'Gus' } });
  await phone('/v1/push-token', { token: apple.token, method: 'POST', body: { token: 'ExponentPushToken[notifyallphone]' } });
  await web('/v1/contacts', { token: google.token, method: 'POST', body: { code: apple.user.id } });
  await phone('/v1/friend-request/accept', { token: apple.token, method: 'POST', body: { contactId: google.user.id } });
  const on = await phone('/v1/notify-all', { token: apple.token, method: 'POST', body: { contactId: google.user.id, on: true } });
  assert.equal(on.contacts.find((item) => item.id === google.user.id).notifyAll, true);
  for (const mode of ['relaxed', 'batched']) {
    const next = await phone('/v1/mode', { token: apple.token, method: 'POST', body: { mode } });
    assert.equal(next.contacts.find((item) => item.id === google.user.id).notifyAll, true);
  }
  storage.delivered.length = 0;
  await web('/v1/messages', { token: google.token, method: 'POST', body: { contactId: apple.user.id, body: 'zen back', intent: 'anytime' } });
  const alerts = presents(storage.delivered, apple.user.id);
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].plan.quiet, false);
});

test('a web realtime message alerts the signed-in phone once', async () => {
  const storage = sharedStore();
  const phone = createDeviceApi(storage, (length) => new Uint8Array(length).fill(4));
  const web = createDeviceApi(storage, (length) => new Uint8Array(length).fill(5));
  const apple = await phone('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-user-phone' },
  });
  await phone('/v1/profile', { token: apple.token, method: 'POST', body: { nickname: 'Ada' } });
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
  await web('/v1/profile', { token: google.token, method: 'POST', body: { nickname: 'Gus' } });
  await web('/v1/contacts', { token: google.token, method: 'POST', body: { code: apple.user.id } });
  await web('/v1/friend-request/accept', { token: apple.token, method: 'POST', body: { contactId: google.user.id } });
  const sent = await web('/v1/messages', {
    token: google.token,
    method: 'POST',
    body: { contactId: apple.user.id, body: 'hello from the web', intent: 'realtime' },
  });
  assert.equal(JSON.stringify(sent).includes('relax'), false);
  const alerts = presents(storage.delivered, apple.user.id);
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].plan.data.kind, 'realtime');
  assert.equal(alerts[0].plan.title, 'Gus');
  assert.equal(alerts[0].plan.quiet, false);
  assert.equal(storage.delivered.find((item) => item.id === apple.user.id).pushToken, 'ExponentPushToken[phonephonephone]');
  const inbox = await phone('/v1/inbox?offset=0', { token: apple.token });
  assert.equal(inbox.state.messages.some((message) => message.body === 'hello from the web' && message.visible), true);
  assert.equal(presents(storage.delivered, apple.user.id).length, 1);
});

test('batched anytime waits for one digest, and relaxed stays private', async () => {
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
  await web('/v1/profile', { token: google.token, method: 'POST', body: { nickname: 'Gus' } });
  await phone('/v1/profile', { token: apple.token, method: 'POST', body: { nickname: 'Ada' } });
  await web('/v1/contacts', { token: google.token, method: 'POST', body: { code: apple.user.id } });
  await phone('/v1/friend-request/accept', { token: apple.token, method: 'POST', body: { contactId: google.user.id } });
  const anytime = await web('/v1/messages', {
    token: google.token,
    method: 'POST',
    body: { contactId: apple.user.id, body: 'later today', intent: 'anytime' },
  });
  const timely = await web('/v1/messages', {
    token: google.token,
    method: 'POST',
    body: {
      contactId: apple.user.id,
      body: 'no rush',
      intent: 'anytime',
    },
  });
  assert.equal(JSON.stringify(anytime).includes('relax'), false);
  assert.equal(JSON.stringify(timely).includes('relax'), false);
  assert.equal(presents(storage.delivered, apple.user.id).length, 0);
  const hidden = await phone('/v1/inbox?offset=0', { token: apple.token });
  assert.equal(hidden.state.messages.every((message) => message.visible === false), true);
  assert.equal(hidden.effects.some((e) => e.type === 'schedule-digest'), true);
  assert.equal(presents(storage.delivered, apple.user.id).length, 0);
  await phone('/v1/effects/ack', { token: apple.token, method: 'POST', body: { armedDigest: true } });

  await storage.transact(async (store) => {
    const state = JSON.parse(await store.getItem('zen-message.device'));
    assert.equal(state.users[apple.user.id].digest.platformScheduled, true);
    state.users[apple.user.id].digest.at = Date.now() - 1000;
    await store.setItem('zen-message.device', JSON.stringify(state));
  });
  const opened = await web('/v1/inbox?offset=0', { token: google.token });
  assert.equal(JSON.stringify(opened).includes('relax'), false);
  // Local DATE armed → release reveals without a second Expo digest push.
  assert.equal(presents(storage.delivered, apple.user.id).length, 0);
  const revealed = await phone('/v1/inbox?offset=0', { token: apple.token });
  assert.equal(revealed.state.messages.every((message) => message.visible), true);
  assert.equal(presents(storage.delivered, apple.user.id).length, 0);

  await phone('/v1/mode', { token: apple.token, method: 'POST', body: { mode: 'relaxed' } });
  const quiet = await web('/v1/messages', {
    token: google.token,
    method: 'POST',
    body: { contactId: apple.user.id, body: 'readable now', intent: 'anytime' },
  });
  assert.equal(JSON.stringify(quiet).includes('relax'), false);
  assert.equal(presents(storage.delivered, apple.user.id).length, 0);
  const readable = await phone('/v1/inbox?offset=0', { token: apple.token });
  assert.equal(readable.state.messages.some((message) => message.body === 'readable now' && message.visible), true);
});

test('three characters show a nickname or not found before add', async () => {
  const api = createDeviceApi(memoryStorage(), (length) => new Uint8Array(length).fill(4));
  const ada = await api('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-user-ada' },
  });
  await api('/v1/profile', { token: ada.token, method: 'POST', body: { nickname: 'Ada' } });
  const bea = await api('/v1/session', {
    method: 'POST',
    body: { provider: 'google', subject: 'google-user-bea' },
  });
  const found = await api(`/v1/person?code=${ada.user.id}`, { token: bea.token });
  assert.equal(found.found, true);
  assert.equal(found.name, 'Ada');
  assert.equal(JSON.stringify(found).includes('relax'), false);
  const missing = await api('/v1/person?code=ZZZ', { token: bea.token });
  assert.deepEqual(missing, { found: false });
  const self = await api(`/v1/person?code=${bea.user.id}`, { token: bea.token });
  assert.deepEqual(self, { found: false });
});

test('account deletion removes the user and their data', async () => {
  const storage = sharedStore();
  const leftApi = createDeviceApi(storage, (length) => new Uint8Array(length).fill(4));
  const rightApi = createDeviceApi(storage, (length) => new Uint8Array(length).fill(5));
  const left = await leftApi('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-user-delete' },
  });
  const right = await rightApi('/v1/session', {
    method: 'POST',
    body: { provider: 'google', subject: 'google-user-delete' },
  });
  await leftApi('/v1/profile', { token: left.token, method: 'POST', body: { nickname: 'Left' } });
  await rightApi('/v1/profile', { token: right.token, method: 'POST', body: { nickname: 'Right' } });
  await leftApi('/v1/contacts', { token: left.token, method: 'POST', body: { code: right.user.id } });
  await rightApi('/v1/friend-request/accept', { token: right.token, method: 'POST', body: { contactId: left.user.id } });
  await leftApi('/v1/messages', {
    token: left.token,
    method: 'POST',
    body: { contactId: right.user.id, body: 'bye', intent: 'realtime' },
  });
  const deleted = await leftApi('/v1/account/delete', { token: left.token, method: 'POST', body: {} });
  assert.equal(deleted.ok, true);
  let blocked = false;
  try {
    await leftApi('/v1/inbox?offset=0', { token: left.token });
  } catch {
    blocked = true;
  }
  assert.equal(blocked, true);
  const survivor = await rightApi('/v1/inbox?offset=0', { token: right.token });
  assert.equal(survivor.contacts.some((item) => item.id === left.user.id), false);
  assert.equal(survivor.state.messages.some((message) => message.body === 'bye'), false);
});

test('blocking removes a contact and stops delivery both ways', async () => {
  const storage = sharedStore();
  const leftApi = createDeviceApi(storage, (length) => new Uint8Array(length).fill(4));
  const rightApi = createDeviceApi(storage, (length) => new Uint8Array(length).fill(5));
  const left = await leftApi('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-user-block' },
  });
  const right = await rightApi('/v1/session', {
    method: 'POST',
    body: { provider: 'google', subject: 'google-user-block' },
  });
  await leftApi('/v1/contacts', { token: left.token, method: 'POST', body: { code: right.user.id } });
  await rightApi('/v1/friend-request/accept', { token: right.token, method: 'POST', body: { contactId: left.user.id } });
  const blocked = await leftApi('/v1/block', { token: left.token, method: 'POST', body: { contactId: right.user.id } });
  assert.equal(blocked.contacts.some((item) => item.id === right.user.id), false);
  let stopped = false;
  try {
    await leftApi('/v1/messages', {
      token: left.token,
      method: 'POST',
      body: { contactId: right.user.id, body: 'nope', intent: 'realtime' },
    });
  } catch {
    stopped = true;
  }
  assert.equal(stopped, true);
  const other = await rightApi('/v1/inbox?offset=0', { token: right.token });
  assert.equal(other.contacts.some((item) => item.id === left.user.id), false);
  let stoppedOther = false;
  try {
    await rightApi('/v1/messages', {
      token: right.token,
      method: 'POST',
      body: { contactId: left.user.id, body: 'nope', intent: 'realtime' },
    });
  } catch {
    stoppedOther = true;
  }
  assert.equal(stoppedOther, true);
});

test('reporting records a report quietly', async () => {
  const storage = sharedStore();
  const leftApi = createDeviceApi(storage, (length) => new Uint8Array(length).fill(4));
  const rightApi = createDeviceApi(storage, (length) => new Uint8Array(length).fill(5));
  const left = await leftApi('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-user-report' },
  });
  const right = await rightApi('/v1/session', {
    method: 'POST',
    body: { provider: 'google', subject: 'google-user-report' },
  });
  await leftApi('/v1/contacts', { token: left.token, method: 'POST', body: { code: right.user.id } });
  await rightApi('/v1/friend-request/accept', { token: right.token, method: 'POST', body: { contactId: left.user.id } });
  const sent = await rightApi('/v1/messages', {
    token: right.token,
    method: 'POST',
    body: { contactId: left.user.id, body: 'rude', intent: 'realtime' },
  });
  const message = sent.state.messages.find((item) => item.body === 'rude');
  const reported = await leftApi('/v1/report', {
    token: left.token,
    method: 'POST',
    body: { contactId: right.user.id, messageId: message.id },
  });
  assert.equal(reported.ok, true);
  await storage.transact(async (store) => {
    const state = JSON.parse(await store.getItem('zen-message.device'));
    assert.equal(state.reports.length, 1);
    assert.equal(state.reports[0].reporterId, left.user.id);
    assert.equal(state.reports[0].reportedId, right.user.id);
    assert.equal(state.reports[0].messageId, message.id);
  });
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

test('opening a contact accepts a normalized id and delivering uses the same id', async () => {
  const storage = sharedStore();
  const left = createDeviceApi(storage, (length) => new Uint8Array(length).fill(4));
  const right = createDeviceApi(storage, (length) => new Uint8Array(length).fill(5));
  const ada = await left('/v1/session', { method: 'POST', body: { provider: 'apple', subject: 'apple-open-a' } });
  const gus = await right('/v1/session', { method: 'POST', body: { provider: 'google', subject: 'google-open-b' } });
  await left('/v1/contacts', { token: ada.token, method: 'POST', body: { code: gus.user.id } });
  await right('/v1/friend-request/accept', {
    token: gus.token,
    method: 'POST',
    body: { contactId: ada.user.id },
  });
  const opened = await left('/v1/open', {
    token: ada.token,
    method: 'POST',
    body: { contactId: gus.user.id.toLowerCase() },
  });
  assert.equal(opened.state.contactId, gus.user.id);
  await left('/v1/messages', {
    token: ada.token,
    method: 'POST',
    body: { contactId: gus.user.id.toLowerCase(), body: 'normalized send', intent: 'realtime' },
  });
  const inbox = await right('/v1/inbox?offset=0', { token: gus.token });
  assert.equal(inbox.state.contactId, ada.user.id);
  assert.equal(
    inbox.state.messages.some((message) => message.body === 'normalized send' && message.visible),
    true
  );
});

test('messages fail closed on bad intent and clientId retries stay idempotent', async () => {
  const storage = sharedStore();
  const left = createDeviceApi(storage, (length) => new Uint8Array(length).fill(2));
  const right = createDeviceApi(storage, (length) => new Uint8Array(length).fill(3));
  const ada = await left('/v1/session', { method: 'POST', body: { provider: 'apple', subject: 'apple-send-guard' } });
  const gus = await right('/v1/session', { method: 'POST', body: { provider: 'google', subject: 'google-send-guard' } });
  await left('/v1/contacts', { token: ada.token, method: 'POST', body: { code: gus.user.id } });
  await right('/v1/friend-request/accept', { token: gus.token, method: 'POST', body: { contactId: ada.user.id } });
  await assert.rejects(
    () =>
      left('/v1/messages', {
        token: ada.token,
        method: 'POST',
        body: { contactId: gus.user.id, body: 'nope', intent: 'not-a-real-intent' },
      }),
    (error) => error.code === 'message_invalid'
  );
  const payload = { clientId: 'local-retry-1', contactId: gus.user.id, body: 'once', intent: 'realtime' };
  await left('/v1/messages', { token: ada.token, method: 'POST', body: payload });
  await left('/v1/messages', { token: ada.token, method: 'POST', body: payload });
  const inbox = await left('/v1/inbox?offset=0', { token: ada.token });
  assert.equal(inbox.state.messages.filter((message) => message.body === 'once').length, 1);
});

test('inbox polls skip store writes when nothing changed', async () => {
  const values = new Map();
  let writes = 0;
  const storage = {
    async getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    async setItem(key, value) {
      writes += 1;
      values.set(key, value);
    },
  };
  const api = createDeviceApi(storage, (length) => new Uint8Array(length).fill(9));
  const session = await api('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-poll-light' },
  });
  const afterSession = writes;
  assert.equal(afterSession >= 1, true);
  await api('/v1/inbox?offset=0', { token: session.token });
  await api('/v1/inbox?offset=0', { token: session.token });
  await api('/v1/inbox?offset=0', { token: session.token });
  assert.equal(writes, afterSession);
});

test('opening switches between contacts even when a poll still has the previous id', async () => {
  const storage = sharedStore();
  const left = createDeviceApi(storage, (length) => new Uint8Array(length).fill(6));
  const mid = createDeviceApi(storage, (length) => new Uint8Array(length).fill(7));
  const right = createDeviceApi(storage, (length) => new Uint8Array(length).fill(8));
  const elton = await left('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-elton-s36' },
  });
  const zjf = await mid('/v1/session', {
    method: 'POST',
    body: { provider: 'google', subject: 'google-zjf-ghv' },
  });
  const self = await right('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-self-viewer' },
  });
  await right('/v1/contacts', { token: self.token, method: 'POST', body: { code: elton.user.id } });
  await left('/v1/friend-request/accept', {
    token: elton.token,
    method: 'POST',
    body: { contactId: self.user.id },
  });
  await right('/v1/contacts', { token: self.token, method: 'POST', body: { code: zjf.user.id } });
  await mid('/v1/friend-request/accept', {
    token: zjf.token,
    method: 'POST',
    body: { contactId: self.user.id },
  });
  const onElton = await right('/v1/open', {
    token: self.token,
    method: 'POST',
    body: { contactId: elton.user.id },
  });
  assert.equal(onElton.state.contactId, elton.user.id);
  const onZjf = await right('/v1/open', {
    token: self.token,
    method: 'POST',
    body: { contactId: zjf.user.id },
  });
  assert.equal(onZjf.state.contactId, zjf.user.id);
  assert.equal(
    onZjf.contacts.some((item) => item.id === zjf.user.id && item.status === 'active'),
    true
  );
});

test('Google web duplicate of an Apple phone account absorbs into the Apple id', async () => {
  const api = createDeviceApi(memoryStorage());
  const apple = await api('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-elton-subject' },
  });
  await api('/v1/profile', { token: apple.token, method: 'POST', body: { nickname: 'Elton' } });
  const google = await api('/v1/session', {
    method: 'POST',
    body: { provider: 'google', subject: 'google-elton-firebase-uid' },
  });
  await api('/v1/profile', { token: google.token, method: 'POST', body: { nickname: 'Elton' } });
  assert.notEqual(apple.user.id, google.user.id);

  const friend = await api('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: 'apple-friend-subject' },
  });
  await api('/v1/profile', { token: friend.token, method: 'POST', body: { nickname: 'zjf' } });
  await api('/v1/contacts', { token: apple.token, method: 'POST', body: { code: friend.user.id } });
  await api('/v1/friend-request/accept', {
    token: friend.token,
    method: 'POST',
    body: { contactId: apple.user.id },
  });

  // Self-friend the duplicate pair the way production did (PPX ↔ S36).
  await api('/v1/contacts', { token: apple.token, method: 'POST', body: { code: google.user.id } });
  await api('/v1/friend-request/accept', {
    token: google.token,
    method: 'POST',
    body: { contactId: apple.user.id },
  });

  const again = await api('/v1/session', {
    method: 'POST',
    body: { provider: 'google', subject: 'google-elton-firebase-uid' },
  });
  assert.equal(again.user.id, apple.user.id);
  assert.equal(again.user.provider, 'apple');
  const inbox = await api('/v1/inbox?offset=0', { token: again.token });
  assert.equal(
    inbox.contacts.some((item) => item.id === friend.user.id && item.status === 'active'),
    true
  );
  assert.equal(
    inbox.contacts.some((item) => item.id === google.user.id),
    false
  );
});

test('email links a Google sign-in onto an existing Apple account', async () => {
  const api = createDeviceApi(memoryStorage());
  const apple = await api('/v1/session', {
    method: 'POST',
    body: {
      provider: 'apple',
      subject: 'apple-with-email',
      email: 'same@example.com',
    },
  });
  const google = await api('/v1/session', {
    method: 'POST',
    body: {
      provider: 'google',
      subject: 'google-with-same-email',
      email: 'same@example.com',
    },
  });
  assert.equal(google.user.id, apple.user.id);
});
