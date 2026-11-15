import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cachedThread,
  canSelectContact,
  mergeInboxPreservingSelection,
  mergeOpenInbox,
  nextSelectionAfterRemoval,
  resolveSelectedContactId,
  seedContactId,
  simulateSelectionAuthority,
  stabilizeMessages,
  updateThreadCache,
} from './contactSelection.js';

const contacts = [
  { id: 'S36', firstName: 'Elton', status: 'active' },
  { id: 'GHV', firstName: 'zjf', status: 'active' },
];

test('local selection never falls back to server or contacts[0]', () => {
  assert.equal(resolveSelectedContactId(contacts, 'GHV', 'S36'), 'GHV');
  assert.equal(resolveSelectedContactId(contacts, 'ghv', 'S36'), 'GHV');
  // Local set but missing from strip — still keep local (no snap to Elton).
  assert.equal(resolveSelectedContactId(contacts, 'ZZZ', 'S36'), 'ZZZ');
  assert.equal(resolveSelectedContactId([], 'GHV', 'S36'), 'GHV');
  // Only null local yields null — never auto-Elton.
  assert.equal(resolveSelectedContactId(contacts, null, 'S36'), null);
});

test('seedContactId is cold-start only and may use server hint once', () => {
  assert.equal(seedContactId(contacts, 'S36'), 'S36');
  assert.equal(seedContactId(contacts, 'GHV'), 'GHV');
  assert.equal(seedContactId(contacts, null), 'S36');
  assert.equal(seedContactId([], 'S36'), null);
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

test('poll with server S36 cannot overwrite local GHV in the inbox blob', () => {
  const previous = {
    contacts,
    state: { contactId: 'GHV', messages: [{ id: 'a', contactId: 'GHV', body: 'hi', visible: true }] },
  };
  const poll = {
    contacts,
    state: { contactId: 'S36', messages: previous.state.messages },
  };
  const merged = mergeInboxPreservingSelection(poll, 'GHV', previous);
  assert.equal(merged.state.contactId, 'GHV');
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

test('mergeOpenInbox ignores server contactId; local selection wins', () => {
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
  // Open for GHV eventually returns — but even a stale open(S36) must not snap UI selection.
  const openS36 = {
    contacts,
    user: { id: 'PPX' },
    state: {
      contactId: 'S36',
      mode: 'batched',
      messages: [{ id: 'a', contactId: 'S36', body: 'hi', photo, visible: true }],
    },
  };
  const merged = mergeOpenInbox(current, openS36, 'GHV');
  assert.equal(merged.state.contactId, 'GHV');
  assert.equal(merged.state.messages[0], current.state.messages[0]);

  const openGhv = {
    ...openS36,
    state: { ...openS36.state, contactId: 'GHV' },
  };
  const mergedOpen = mergeOpenInbox(current, openGhv, 'GHV');
  assert.equal(mergedOpen.state.contactId, 'GHV');
});

test('stale open callback with wrong local cannot be used to invent selection — caller owns local', () => {
  // If a buggy caller passed S36 as local after user tapped GHV, merge would write S36.
  // UI must never take selection FROM merge — only from tap. This documents the contract:
  // setSelectedContactId is never called with merge results.
  const current = {
    contacts,
    state: { contactId: 'GHV', messages: [] },
  };
  const next = {
    contacts,
    state: { contactId: 'GHV', messages: [] },
  };
  const merged = mergeOpenInbox(current, next, 'S36');
  assert.equal(merged.state.contactId, 'S36');
  // Selection authority remains whatever React state holds; merge is not a selection API.
});

test('snap-back is impossible: tap GHV then polls/opens with S36 keep GHV', () => {
  const result = simulateSelectionAuthority({
    initialLocal: 'S36',
    taps: ['GHV'],
    polls: ['S36', 'S36', 'S36'],
    opens: ['S36', 'GHV'],
  });
  assert.equal(result.local, 'GHV');
  assert.equal(result.inboxContactId, 'GHV');
});

test('snap-back is impossible: rapid re-tap stays on last tap', () => {
  const result = simulateSelectionAuthority({
    initialLocal: 'S36',
    taps: ['GHV', 'S36', 'GHV'],
    polls: ['S36'],
    opens: ['S36', 'GHV', 'S36'],
  });
  assert.equal(result.local, 'GHV');
  assert.equal(result.inboxContactId, 'GHV');
});

test('thread cache returns prior thread without waiting on open', () => {
  const messages = [
    { id: '1', contactId: 'S36', body: 'elton', photo: 'data:x', visible: true },
    { id: '2', contactId: 'GHV', body: 'zjf', photo: null, visible: true },
  ];
  const cache = updateThreadCache(new Map(), messages, ['S36', 'GHV']);
  assert.equal(cachedThread(cache, [], 'GHV')[0].body, 'zjf');
  assert.equal(cachedThread(cache, [], 'S36')[0], messages[0]);
  // Switching to GHV does not require live messages array.
  assert.equal(cachedThread(cache, null, 'GHV').length, 1);
});

test('thread cache drops contacts no longer on the strip', () => {
  const messages = [
    { id: '1', contactId: 'S36', body: 'elton', photo: 'data:x', visible: true },
    { id: '2', contactId: 'GHV', body: 'zjf', photo: null, visible: true },
  ];
  const full = updateThreadCache(new Map(), messages, ['S36', 'GHV']);
  const pruned = updateThreadCache(full, messages, ['S36']);
  assert.equal(pruned.has('GHV'), false);
  assert.equal(pruned.has('S36'), true);
  assert.equal(cachedThread(pruned, messages, 'GHV')[0].body, 'zjf'); // live fallback only
});

test('cold seed is one-shot: null local gets hint, set local is never overwritten by polls', () => {
  assert.equal(seedContactId(contacts, 'S36'), 'S36');
  // After local is set, resolve ignores server entirely.
  assert.equal(resolveSelectedContactId(contacts, 'GHV', 'S36'), 'GHV');
  const afterPolls = simulateSelectionAuthority({
    initialLocal: null,
    taps: [],
    polls: ['S36', 'GHV'],
    opens: [],
  });
  // Without a tap, simulate keeps null local (seed is App-level); inbox may follow prior blob.
  assert.equal(afterPolls.local, null);
});

test('nextSelectionAfterRemoval only moves when selected contact was removed', () => {
  assert.equal(nextSelectionAfterRemoval(contacts, 'GHV', 'S36'), 'GHV');
  assert.equal(nextSelectionAfterRemoval(contacts.filter((c) => c.id !== 'GHV'), 'GHV', 'GHV'), 'S36');
  assert.equal(nextSelectionAfterRemoval([], 'GHV', 'GHV'), null);
});

test('canSelectContact accepts strip ids only', () => {
  assert.equal(canSelectContact(contacts, 'GHV'), true);
  assert.equal(canSelectContact(contacts, 'ghv'), true);
  assert.equal(canSelectContact(contacts, 'ZZZ'), false);
  assert.equal(canSelectContact(contacts, 'not-a-code'), false);
});
