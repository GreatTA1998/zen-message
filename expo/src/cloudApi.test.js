import assert from 'node:assert/strict';
import test from 'node:test';
import { createCloudApi } from './cloudApi.js';

const DOC = 'suite';
const PROJECT = 'project-z-e00fd';
const API_KEY = 'AIzaSyCMj9SsNMKDI9EezOzg_jowsYUOfaCbivc';

test('a phone and a browser share one hosted store', async () => {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/%28default%29/documents/zenExpoState/${DOC}?key=${API_KEY}`;
  await fetch(url, { method: 'DELETE' });
  const phone = createCloudApi(DOC);
  const web = createCloudApi(DOC);
  const stamp = `hosted-${Date.now()}`;
  const apple = await phone('/v1/session', {
    method: 'POST',
    body: { provider: 'apple', subject: `${stamp}-apple` },
  });
  const google = await web('/v1/session', {
    method: 'POST',
    body: { provider: 'google', subject: `${stamp}-google` },
  });
  assert.match(apple.user.id, /^[023456789ABCDEFGHJKMNOPQRSTUVWXYZ]{3}$/);
  assert.match(google.user.id, /^[023456789ABCDEFGHJKMNOPQRSTUVWXYZ]{3}$/);
  assert.notEqual(apple.user.id, google.user.id);
  await phone('/v1/contacts', { token: apple.token, method: 'POST', body: { code: google.user.id } });
  await web('/v1/contacts', { token: google.token, method: 'POST', body: { code: apple.user.id } });
  await web('/v1/messages', {
    token: google.token,
    method: 'POST',
    body: { contactId: apple.user.id, body: 'hello from the laptop', intent: 'realtime' },
  });
  const inbox = await phone('/v1/inbox?offset=0', { token: apple.token });
  assert.equal(
    inbox.state.messages.some((message) => message.body === 'hello from the laptop' && message.visible),
    true
  );
  await fetch(url, { method: 'DELETE' });
});
