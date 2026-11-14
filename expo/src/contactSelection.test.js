import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canSelectContact,
  mergeInboxPreservingSelection,
  resolveSelectedContactId,
} from './contactSelection.js';

const contacts = [
  { id: 'S36', firstName: 'Elton', status: 'active' },
  { id: 'GHV', firstName: 'zjf', status: 'active' },
];

test('local selection wins over server contactId', () => {
  assert.equal(resolveSelectedContactId(contacts, 'GHV', 'S36'), 'GHV');
  assert.equal(resolveSelectedContactId(contacts, 'ghv', 'S36'), 'GHV');
});

test('falls back to server then first contact when local is missing', () => {
  assert.equal(resolveSelectedContactId(contacts, null, 'S36'), 'S36');
  assert.equal(resolveSelectedContactId(contacts, 'ZZZ', 'S36'), 'S36');
  assert.equal(resolveSelectedContactId(contacts, 'ZZZ', null), 'S36');
  assert.equal(resolveSelectedContactId([], 'GHV', 'S36'), null);
});

test('mergeInboxPreservingSelection keeps tapped contact across poll payloads', () => {
  const inbox = {
    contacts,
    state: { contactId: 'S36', messages: [], mode: 'batched' },
  };
  const merged = mergeInboxPreservingSelection(inbox, 'GHV');
  assert.equal(merged.state.contactId, 'GHV');
  assert.equal(merged.state.mode, 'batched');
  assert.equal(mergeInboxPreservingSelection(inbox, 'S36'), inbox);
});

test('canSelectContact accepts strip ids only', () => {
  assert.equal(canSelectContact(contacts, 'GHV'), true);
  assert.equal(canSelectContact(contacts, 'ghv'), true);
  assert.equal(canSelectContact(contacts, 'ZZZ'), false);
  assert.equal(canSelectContact(contacts, 'not-a-code'), false);
});
