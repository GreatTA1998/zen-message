import assert from 'node:assert/strict';
import test from 'node:test';
import { notificationPolicy, starColor } from './notificationPolicy.js';

test('Focus on: zen digests; urgent/notifyAll immediate; star only for override', () => {
  assert.equal(notificationPolicy({ intent: 'anytime', mode: 'batched' }).path, 'digest');
  assert.equal(notificationPolicy({ intent: 'scheduled', mode: 'batched' }).path, 'digest');
  assert.equal(notificationPolicy({ intent: 'realtime', mode: 'batched' }).path, 'immediate');
  assert.equal(notificationPolicy({ intent: 'anytime', mode: 'batched', notifyAll: true }).path, 'immediate');
  assert.equal(notificationPolicy({ intent: 'anytime', mode: 'batched', notifyAll: true }).loud, true);
  assert.equal(notificationPolicy({ intent: 'realtime', mode: 'batched' }).loud, false);
  assert.equal(notificationPolicy({ intent: 'anytime', mode: 'batched' }).starKind, null);
  assert.equal(notificationPolicy({ intent: 'anytime', mode: 'batched', notifyAll: true }).starKind, 'override');
  assert.equal(starColor('override'), '#b3261e');
});

test('Focus off: zen silent+visible; yellow open stars; override stays red', () => {
  const silent = notificationPolicy({ intent: 'anytime', mode: 'relaxed' });
  assert.equal(silent.path, 'silent');
  assert.equal(silent.visible, true);
  assert.equal(silent.starKind, 'open');
  assert.equal(starColor('open'), '#c9a227');
  assert.equal(notificationPolicy({ intent: 'anytime', mode: 'relaxed', notifyAll: true }).starKind, 'override');
  assert.equal(notificationPolicy({ intent: 'realtime', mode: 'relaxed' }).path, 'immediate');
});

test('pending contacts never show a star', () => {
  assert.equal(notificationPolicy({ intent: 'anytime', mode: 'relaxed', pending: true }).starKind, null);
  assert.equal(notificationPolicy({ intent: 'anytime', mode: 'batched', notifyAll: true, pending: true }).starKind, null);
});
