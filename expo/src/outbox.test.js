import assert from 'node:assert/strict';
import test from 'node:test';
import { outboxThreadRows, parseOutbox } from './outbox.js';

test('parseOutbox keeps only sendable rows', () => {
  assert.deepEqual(
    parseOutbox(
      JSON.stringify([
        { id: 'local-1', contactId: 'GHV', body: 'hi', createdAt: 1 },
        { nope: true },
        null,
      ])
    ),
    [{ id: 'local-1', contactId: 'GHV', body: 'hi', createdAt: 1 }]
  );
  assert.deepEqual(parseOutbox(''), []);
  assert.deepEqual(parseOutbox('not-json'), []);
});

test('outboxThreadRows maps persisted sends onto a thread', () => {
  const rows = outboxThreadRows(
    [
      {
        id: 'local-1',
        contactId: 'ghv',
        contactName: 'Zjf',
        body: 'still here',
        photo: null,
        sticker: null,
        intent: 'realtime',
        createdAt: 42,
      },
      { id: 'local-2', contactId: 'PPX', body: 'other', createdAt: 9 },
    ],
    'GHV'
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, 'local-1');
  assert.equal(rows[0].direction, 'out');
  assert.equal(rows[0].visible, true);
  assert.equal(rows[0].body, 'still here');
});
