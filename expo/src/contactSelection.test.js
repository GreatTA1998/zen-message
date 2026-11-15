import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canSelectContact,
  mergeInboxPreservingSelection,
  mergeOpenInbox,
  resolveSelectedContactId,
  stabilizeMessages,
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

test('stabilizeMessages reuses photo-bearing message objects', () => {
  const photo = `data:image/jpeg;base64,${'A'.repeat(1000)}`;
  const prior = [
    { id: 'a', contactId: 'S36', body: 'hi', photo, visible: true, intent: 'realtime', releaseAt: null },
    { id: 'b', contactId: 'S36', body: 'yo', photo: null, visible: true, intent: 'realtime', releaseAt: null },
  ];
  const next = [
    { id: 'a', contactId: 'S36', body: 'hi', photo, visible: true, intent: 'realtime', releaseAt: null },
    { id: 'b', contactId: 'S36', body: 'yo', photo: null, visible: true, intent: 'realtime', releaseAt: null },
  ];
  const stabilized = stabilizeMessages(prior, next);
  assert.equal(stabilized[0], prior[0]);
  assert.equal(stabilized[1], prior[1]);
  assert.equal(stabilizeMessages(prior, prior), prior);
});

test('mergeOpenInbox keeps prior message refs while updating contactId', () => {
  const photo = `data:image/jpeg;base64,${'B'.repeat(500)}`;
  const current = {
    contacts,
    user: { id: 'PPX' },
    state: {
      contactId: 'GHV',
      mode: 'batched',
      messages: [{ id: 'a', contactId: 'S36', body: 'hi', photo, visible: true }],
    },
  };
  const next = {
    contacts,
    user: { id: 'PPX' },
    state: {
      contactId: 'S36',
      mode: 'batched',
      messages: [{ id: 'a', contactId: 'S36', body: 'hi', photo, visible: true }],
    },
  };
  const merged = mergeOpenInbox(current, next, 'S36');
  assert.equal(merged.state.contactId, 'S36');
  assert.equal(merged.state.messages[0], current.state.messages[0]);
});

test('canSelectContact accepts strip ids only', () => {
  assert.equal(canSelectContact(contacts, 'GHV'), true);
  assert.equal(canSelectContact(contacts, 'ghv'), true);
  assert.equal(canSelectContact(contacts, 'ZZZ'), false);
  assert.equal(canSelectContact(contacts, 'not-a-code'), false);
});
