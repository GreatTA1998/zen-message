import assert from 'node:assert/strict';
import test from 'node:test';
import { createState } from '../src/delivery.js';
import { deliverMessage, changeMode, releaseDue } from './deliver.js';
import { pushMessage, pushesFor } from './push.js';

function person(fields) {
  return {
    ...createState(),
    id: fields.id,
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

test('timely is one quiet push and realtime is one normal push', () => {
  const bea = person({ id: 'bea', username: 'bea', pushToken: 'ExponentPushToken[bea]' });
  const timely = deliverMessage(person({ id: 'ada', username: 'ada' }), bea, {
    id: 't',
    body: 'Soon',
    intent: 'timely',
    now,
  });
  const realtime = deliverMessage(person({ id: 'ada', username: 'ada' }), bea, {
    id: 'r',
    body: 'Now',
    intent: 'realtime',
    now,
  });
  assert.equal(timely.pushes.length, 1);
  assert.equal(timely.pushes[0].sound, null);
  assert.equal(timely.pushes[0].interruptionLevel, 'passive');
  assert.equal(timely.pushes[0].data.kind, 'timely');
  assert.equal(realtime.pushes.length, 1);
  assert.equal(realtime.pushes[0].sound, 'default');
  assert.equal(realtime.pushes[0].interruptionLevel, 'active');
  assert.equal(realtime.recipientEffects[0].plan.quiet, false);
  const relaxed = changeMode(bea, 'relaxed').state;
  const still = deliverMessage(person({ id: 'ada', username: 'ada' }), { ...bea, mode: relaxed.mode }, {
    id: 't2',
    body: 'Soon',
    intent: 'timely',
    now,
  });
  assert.equal(still.pushes[0].interruptionLevel, 'passive');
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
    title: 'ada',
    body: 'Hello',
    quiet: true,
    data: { kind: 'timely', quiet: true, messageIds: ['t'] },
  });
  const encoded = JSON.stringify(message);
  assert.equal(encoded.includes('relax'), false);
  assert.equal(encoded.includes('batched'), false);
});
