import assert from 'node:assert/strict';
import test from 'node:test';
import { createCloudApi, createFirestoreStorage } from './cloudApi.js';
import { accountCode } from './people.js';

const DOC = 'live';

async function removeSubjects(subjects) {
  const storage = createFirestoreStorage(DOC);
  await storage.transact(async (store) => {
    const raw = await store.getItem('zen-message.device');
    const state = raw ? JSON.parse(raw) : { users: {}, sessions: {} };
    const drop = new Set(
      Object.entries(state.users)
        .filter(([, user]) => subjects.has(`${user.provider}:${user.subject}`))
        .map(([id]) => id)
    );
    if (!drop.size) return;
    for (const id of drop) delete state.users[id];
    for (const [token, id] of Object.entries(state.sessions || {})) {
      if (drop.has(id)) delete state.sessions[token];
    }
    for (const user of Object.values(state.users)) {
      user.contacts = (user.contacts || []).filter((item) => !drop.has(item.id));
      user.messages = (user.messages || []).filter((item) => !drop.has(item.contactId));
      if (drop.has(user.contactId)) user.contactId = user.contacts[0]?.id ?? null;
    }
    await store.setItem('zen-message.device', JSON.stringify(state));
  });
}

test('a phone and a browser share the live hosted store', async () => {
  const stamp = `hosted-${Date.now()}`;
  const appleSubject = `${stamp}-apple`;
  const googleSubject = `${stamp}-google`;
  const subjects = new Set([`apple:${appleSubject}`, `google:${googleSubject}`]);
  const phone = createCloudApi(DOC);
  const web = createCloudApi(DOC);
  try {
    const apple = await phone('/v1/session', {
      method: 'POST',
      body: { provider: 'apple', subject: appleSubject, firstName: 'Ada' },
    });
    const google = await web('/v1/session', {
      method: 'POST',
      body: { provider: 'google', subject: googleSubject },
    });
    const appleAgain = await phone('/v1/session', {
      method: 'POST',
      body: { provider: 'apple', subject: appleSubject },
    });
    assert.equal(apple.user.id, accountCode('apple', appleSubject));
    assert.equal(appleAgain.user.id, apple.user.id);
    assert.equal(google.user.id, accountCode('google', googleSubject));
    assert.notEqual(apple.user.id, google.user.id);
    await phone('/v1/contacts', { token: apple.token, method: 'POST', body: { code: google.user.id } });
    await phone('/v1/messages', {
      token: apple.token,
      method: 'POST',
      body: { contactId: google.user.id, body: 'hello from the phone', intent: 'realtime' },
    });
    const inbox = await web('/v1/inbox?offset=0', { token: google.token });
    assert.equal(inbox.contacts.some((item) => item.id === apple.user.id && item.firstName === 'Ada'), true);
    assert.equal(inbox.state.contactId, apple.user.id);
    assert.equal(
      inbox.state.messages.some((message) => message.body === 'hello from the phone' && message.visible),
      true
    );
  } finally {
    await removeSubjects(subjects);
  }
});
