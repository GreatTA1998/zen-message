import assert from 'node:assert/strict';
import test from 'node:test';
import { createState } from './delivery.js';
import { deliverMessage, changeMode, releaseDue } from './deliver.js';
import { expoPushEndpoint, pushMessage, pushesFor } from './expoPush.js';

function person(fields) {
  return {
    ...createState(),
    id: fields.id,
    firstName: fields.firstName ?? fields.username ?? '',
    mode: fields.mode ?? 'batched',
    pushToken: fields.pushToken ?? null,
    offsetMinutes: fields.offsetMinutes ?? 0,
  };
}

const now = Date.UTC(2026, 9, 17, 17, 15);

test('batched anytime schedules one digest and does not tell the sender', () => {
  const result = deliverMessage(person({ id: 'ada', username: 'ada' }), person({ id: 'bea', username: 'bea', pushToken: 'ExponentPushToken[bea]' }), {
    id: 'm1',
    body: 'Hello',
    intent: 'anytime',
    now,
  });
  assert.equal(result.sender.messages[0].visible, true);
  assert.equal(result.sender.messages[0].direction, 'out');
  assert.deepEqual(result.senderEffects, []);
  assert.equal(result.recipient.messages[0].visible, false);
  assert.equal(result.recipientEffects[0].type, 'schedule-digest');
  assert.deepEqual(result.pushes, []);
  assert.equal(JSON.stringify(result.senderEffects).includes('relax'), false);
  assert.equal(JSON.stringify(result.sender.messages).includes('batched'), false);
});

test('relaxed anytime is silent and private', () => {
  const result = deliverMessage(
    person({ id: 'ada', username: 'ada' }),
    person({ id: 'bea', username: 'bea', mode: 'relaxed', pushToken: 'ExponentPushToken[bea]' }),
    { id: 'm1', body: 'Hello', intent: 'anytime', now }
  );
  assert.equal(result.recipient.messages[0].visible, true);
  assert.deepEqual(result.recipientEffects, []);
  assert.deepEqual(result.pushes, []);
  assert.equal(JSON.stringify({ effects: result.senderEffects, message: result.sender.messages[0] }).includes('relax'), false);
});

test('scheduled waits for the chosen time and realtime is one normal push', () => {
  const bea = person({ id: 'bea', firstName: 'Bea', pushToken: 'ExponentPushToken[bea]' });
  const ada = person({ id: 'ada', firstName: 'Ada' });
  const timely = deliverMessage(ada, bea, {
    id: 't',
    body: 'Soon',
    intent: 'scheduled',
    releaseAt: now + 2 * 60 * 60 * 1000,
    now,
  });
  const first = deliverMessage(ada, bea, { id: 'r1', body: 'Now', intent: 'realtime', now });
  const second = deliverMessage(ada, { ...bea, ...first.recipient, pushToken: bea.pushToken, firstName: 'Bea', id: 'bea' }, {
    id: 'r2',
    body: 'Again',
    intent: 'realtime',
    now: now + 1000,
  });
  assert.equal(timely.recipient.messages[0].visible, false);
  assert.equal(timely.recipientEffects[0].type, 'schedule-digest');
  assert.deepEqual(timely.pushes, []);
  assert.equal(first.pushes.length, 1);
  assert.equal(second.pushes.length, 1);
  assert.equal(first.pushes[0].title, 'Ada');
  assert.equal(first.pushes[0].collapseId, 'r1');
  assert.equal(second.pushes[0].collapseId, 'r2');
  assert.equal(first.pushes[0].sound, 'default');
  assert.equal(first.pushes[0].interruptionLevel, 'active');
  const sooner = deliverMessage(ada, { ...bea, mode: changeMode(bea, 'relaxed').state.mode }, {
    id: 't2',
    body: 'Soon',
    intent: 'scheduled',
    releaseAt: now + 2 * 60 * 60 * 1000,
    now,
  });
  assert.equal(sooner.recipient.messages[0].visible, true);
  assert.deepEqual(sooner.pushes, []);
});

test('the window sends one digest push', () => {
  const bea = person({ id: 'bea', username: 'bea', pushToken: 'ExponentPushToken[bea]' });
  const first = deliverMessage(person({ id: 'ada', username: 'ada' }), bea, {
    id: 'a',
    body: 'Hello',
    intent: 'anytime',
    now,
  });
  const second = deliverMessage(person({ id: 'cay', username: 'cay' }), { ...bea, ...first.recipient }, {
    id: 'b',
    body: 'Later',
    intent: 'anytime',
    now: now + 1000,
  });
  const due = releaseDue({ ...bea, ...second.recipient }, second.recipient.digest.at);
  const pushes = pushesFor(due.effects, bea.pushToken);
  assert.equal(pushes.length, 1);
  assert.deepEqual(pushes[0].data.messageIds, ['a', 'b']);
  assert.equal(pushes[0].interruptionLevel, 'active');
});

test('a push payload does not mention relax or batched', () => {
  const message = pushMessage('ExponentPushToken[bea]', {
    title: 'Ada',
    body: 'Hello',
    quiet: true,
    data: { kind: 'timely', quiet: true, messageIds: ['t'] },
  });
  assert.equal(message.collapseId, 't');
  const encoded = JSON.stringify(message);
  assert.equal(encoded.includes('relax'), false);
  assert.equal(encoded.includes('batched'), false);
});

test('the browser posts pushes to this site and the phone posts them to Expo', () => {
  const previousDocument = globalThis.document;
  const previousLocation = globalThis.location;
  try {
    assert.equal(expoPushEndpoint(), 'https://exp.host/--/api/v2/push/send');
    globalThis.document = {};
    globalThis.location = { origin: 'https://zen-messenger.vercel.app' };
    assert.equal(expoPushEndpoint(), 'https://zen-messenger.vercel.app/api/push');
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
    if (previousLocation === undefined) delete globalThis.location;
    else globalThis.location = previousLocation;
  }
});
