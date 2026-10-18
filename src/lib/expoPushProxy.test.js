import assert from 'node:assert/strict';
import test from 'node:test';
import { forwardExpoPush, sanitizePushMessages } from './expoPushProxy.js';

const TOKEN = 'ExponentPushToken[aaaaaaaaaaaaaaaaaaaa]';

function message(overrides = {}) {
  return {
    to: TOKEN,
    title: 'Ada',
    body: 'Hello',
    sound: 'default',
    priority: 'high',
    interruptionLevel: 'active',
    channelId: 'zen-normal',
    data: { kind: 'realtime', quiet: false, messageIds: ['m1'], extra: 'drop-me' },
    ...overrides,
  };
}

test('a browser push is reduced to one Expo message', () => {
  const messages = sanitizePushMessages([message()]);
  assert.equal(messages.length, 1);
  assert.equal(messages[0].to, TOKEN);
  assert.equal(messages[0].data.kind, 'realtime');
  assert.equal(messages[0].data.extra, undefined);
  assert.equal(JSON.stringify(messages).includes('relax'), false);
  assert.equal(JSON.stringify(messages).includes('batched'), false);
});

test('a digest and a timely notice are allowed through', () => {
  const messages = sanitizePushMessages([
    message({ title: 'Zen Message', body: '2 messages', data: { kind: 'digest', quiet: false, messageIds: ['a', 'b'] } }),
    message({ sound: null, priority: 'default', interruptionLevel: 'passive', channelId: 'zen-quiet', data: { kind: 'timely', quiet: true, messageIds: ['t'] } }),
  ]);
  assert.equal(messages.length, 2);
  assert.equal(messages[0].data.kind, 'digest');
  assert.equal(messages[1].sound, null);
});

test('anything that names relax or batched is refused', () => {
  assert.equal(sanitizePushMessages([message({ body: 'relax is on' })]), null);
  assert.equal(sanitizePushMessages([message({ title: 'batched' })]), null);
});

test('a token that is not an Expo push token is refused', () => {
  assert.equal(sanitizePushMessages([message({ to: 'not-a-token' })]), null);
  assert.equal(sanitizePushMessages([message({ data: { kind: 'secret', messageIds: [] } })]), null);
  assert.equal(sanitizePushMessages([]), null);
});

test('the proxy posts the filtered message to Expo and returns the ticket', async () => {
  let forwarded = null;
  const response = await forwardExpoPush(
    new Request('https://zen-messenger.vercel.app/api/push', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify([message()]),
    }),
    async (url, init) => {
      forwarded = { url, body: JSON.parse(init.body) };
      return new Response(JSON.stringify({ data: [{ status: 'ok', id: 'ticket' }] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
  );
  assert.equal(response.status, 200);
  assert.equal(forwarded.url, 'https://exp.host/--/api/v2/push/send');
  assert.equal(forwarded.body[0].to, TOKEN);
  assert.equal(forwarded.body[0].data.kind, 'realtime');
  const payload = await response.json();
  assert.equal(payload.data[0].status, 'ok');
});
