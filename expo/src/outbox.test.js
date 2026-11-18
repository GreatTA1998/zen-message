import assert from 'node:assert/strict';
import test from 'node:test';
import { createOutbox, mergeOutbox } from './outbox.js';

const item = (id, extra = {}) => ({
  id,
  contactId: 'ADA',
  contactName: 'Ada',
  body: `m-${id}`,
  photo: null,
  sticker: null,
  intent: 'anytime',
  createdAt: 1000,
  visible: true,
  releaseAt: null,
  direction: 'out',
  ...extra,
});

test('mergeOutbox: memory wins same id', () => {
  assert.deepEqual(
    mergeOutbox([item('a'), item('b', { body: 'disk' })], [item('b', { body: 'mem' }), item('c')]).map((r) => [
      r.id,
      r.body,
    ]),
    [
      ['a', 'm-a'],
      ['b', 'mem'],
      ['c', 'm-c'],
    ]
  );
});

test('enqueue awaits save before resolve (disk before composer clear)', async () => {
  let release;
  const blocked = new Promise((r) => {
    release = r;
  });
  const box = createOutbox({
    load: async () => [],
    save: async () => blocked,
    send: async () => {},
  });
  let done = false;
  const p = box.enqueue(item('x')).then(() => {
    done = true;
  });
  await Promise.resolve();
  assert.equal(done, false);
  release();
  await p;
  assert.equal(done, true);
});

test('persist serialized; fail marks kept; retry acks remove', async () => {
  let active = 0;
  let max = 0;
  let fail = true;
  const sent = [];
  const box = createOutbox({
    load: async () => [],
    save: async () => {
      active += 1;
      max = Math.max(max, active);
      await new Promise((r) => setTimeout(r, 4));
      active -= 1;
    },
    send: async (row) => {
      if (fail && row.id === 'a') {
        fail = false;
        throw new Error('net');
      }
      sent.push(row.id);
    },
  });
  await Promise.all([box.persist([item('1')]), box.persist([item('1'), item('2')])]);
  assert.equal(max, 1);
  await box.persist([item('a'), item('b')]);
  await box.drain();
  assert.equal(box.snapshot()[0].failed, true);
  box.retry('a');
  await new Promise((r) => setTimeout(r, 30));
  assert.deepEqual(sent, ['a', 'b']);
  assert.deepEqual(box.snapshot(), []);
});

test('hydrate merges disk∪memory then drains; resume retries failed', async () => {
  const seed = [item('disk')];
  const sent = [];
  const box = createOutbox({
    load: async () => seed.map((r) => ({ ...r })),
    save: async () => {},
    send: async (row) => {
      sent.push(row.id);
    },
  });
  await box.persist([item('mem')]);
  await box.hydrate();
  await new Promise((r) => setTimeout(r, 20));
  assert.deepEqual(sent.sort(), ['disk', 'mem']);
  await box.persist([{ ...item('z'), failed: true }]);
  box.resume();
  await new Promise((r) => setTimeout(r, 20));
  assert.ok(sent.includes('z'));
  assert.deepEqual(box.snapshot(), []);
});
