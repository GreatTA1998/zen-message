import assert from 'node:assert/strict';
import test from 'node:test';
import { createOutbox, mergeOutbox, slimOutboxItem } from './outbox.js';

const BIG = `data:image/jpeg;base64,${'A'.repeat(120000)}`;
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

function memoryMedia() {
  const map = new Map();
  return {
    put: async (id, media) => map.set(id, { photo: media?.photo || null, sticker: media?.sticker || null }),
    get: async (id) => map.get(id) || null,
    remove: async (id) => map.delete(id),
    has: (id) => map.has(id),
  };
}

test('mergeOutbox: memory wins same id', () => {
  assert.deepEqual(
    mergeOutbox([item('a'), item('b', { body: 'disk' })], [item('b', { body: 'mem' }), item('c')]).map((r) => [r.id, r.body]),
    [
      ['a', 'm-a'],
      ['b', 'mem'],
      ['c', 'm-c'],
    ]
  );
});

test('enqueue awaits save; disk has no data-URLs; media side-stored', async () => {
  let releaseSave;
  let releaseSend;
  const saveGate = new Promise((r) => {
    releaseSave = r;
  });
  const sendGate = new Promise((r) => {
    releaseSend = r;
  });
  let disk = [];
  const media = memoryMedia();
  const box = createOutbox({
    load: async () => disk,
    save: async (items) => {
      await saveGate;
      disk = items.map((row) => ({ ...row }));
    },
    media,
    send: async () => sendGate,
  });
  let done = false;
  const p = box.enqueue(item('x', { photo: BIG, body: '' })).then(() => {
    done = true;
  });
  await Promise.resolve();
  assert.equal(done, false);
  releaseSave();
  await p;
  assert.equal(JSON.stringify(disk).includes('data:image'), false);
  assert.ok(media.has('x'));
  assert.equal(box.snapshot()[0].photo, BIG);
  assert.equal(slimOutboxItem(box.snapshot()[0]).photo, null);
  releaseSend();
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(media.has('x'), false);
});

test('serialized persist; fail keeps media; retry acks remove', async () => {
  let active = 0;
  let max = 0;
  let fail = true;
  const sent = [];
  const media = memoryMedia();
  const box = createOutbox({
    load: async () => [],
    save: async () => {
      active += 1;
      max = Math.max(max, active);
      await new Promise((r) => setTimeout(r, 4));
      active -= 1;
    },
    media,
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
  await box.persist([item('a', { sticker: BIG }), item('b')]);
  await box.drain();
  assert.equal(box.snapshot()[0].failed, true);
  assert.ok(media.has('a'));
  box.retry('a');
  await new Promise((r) => setTimeout(r, 30));
  assert.deepEqual(sent, ['a', 'b']);
  assert.equal(media.has('a'), false);
});

test('hydrate restores media refs then drains', async () => {
  const media = memoryMedia();
  await media.put('disk', { photo: BIG, sticker: null });
  const sent = [];
  const box = createOutbox({
    load: async () => [slimOutboxItem(item('disk', { photo: BIG, body: '' }))],
    save: async () => {},
    media,
    send: async (row) => {
      sent.push(row.photo?.startsWith('data:image/') ? row.id : 'missing');
    },
  });
  await box.hydrate();
  await new Promise((r) => setTimeout(r, 20));
  assert.deepEqual(sent, ['disk']);
});
