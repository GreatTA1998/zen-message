import { isCode, normalizeCode } from './people.js';
import { threadMessages } from './delivery.js';

/**
 * Contact selection invariants (snap-back must be impossible):
 *
 * 1. `selectedContactId` React state + `selectedContactRef` are the ONLY UI authority.
 * 2. Selection may change only from: user tap (`pickContact`), logout clear, cold seed
 *    when local is still null, or explicit user actions that remove the selected contact
 *    (block / decline) via `nextSelectionAfterRemoval`.
 * 3. Poll / `/v1/open` / mutate inbox applies update messages/contacts/mode only.
 *    They MUST NOT call setSelectedContactId and MUST NOT rewrite selection from
 *    `state.contactId`.
 * 4. `resolveSelectedContactId` never falls back to server `contactId` or contacts[0]
 *    when a local id is already set — that fallback was the snap-back to Elton/S36.
 */

/** Cold-start only: pick an initial id when the user has not tapped yet. */
export function seedContactId(contacts, serverHint) {
  const list = Array.isArray(contacts) ? contacts : [];
  const hint = normalizeCode(serverHint);
  if (hint && list.some((item) => normalizeCode(item.id) === hint)) return hint;
  return list[0] ? normalizeCode(list[0].id) : null;
}

/**
 * UI ring / composer / thread id.
 * Local id wins always when set — even if briefly missing from the strip.
 * Never adopts server contactId. Never falls back to contacts[0] while local is set.
 */
export function resolveSelectedContactId(contacts, localId, _serverIdIgnored) {
  const local = normalizeCode(localId);
  if (local) return local;
  return null;
}

/** True when this id is an openable row in the strip. */
export function canSelectContact(contacts, contactId) {
  const id = normalizeCode(contactId);
  return Boolean(id && isCode(id) && (contacts || []).some((item) => normalizeCode(item.id) === id));
}

/**
 * After block/decline removes a contact: only then may selection move, and only to
 * another strip id (or null) — never "back" to a server hint.
 */
export function nextSelectionAfterRemoval(contacts, selectedContactId, removedId) {
  const selected = normalizeCode(selectedContactId);
  const removed = normalizeCode(removedId);
  if (!selected || selected !== removed) return selected;
  const list = Array.isArray(contacts) ? contacts : [];
  const remaining = list.find((item) => normalizeCode(item.id) !== removed);
  return remaining ? normalizeCode(remaining.id) : null;
}

/** Reuse prior message object identity when content is unchanged (avoids photo re-decode). */
export function stabilizeMessages(previous, next) {
  const prev = Array.isArray(previous) ? previous : [];
  const incoming = Array.isArray(next) ? next : [];
  if (!incoming.length) return incoming;
  if (!prev.length) return incoming;
  const prior = new Map(prev.map((item) => [item.id, item]));
  let changed = incoming.length !== prev.length;
  const stabilized = incoming.map((item, index) => {
    const old = prior.get(item.id);
    if (
      old &&
      old.body === item.body &&
      old.photo === item.photo &&
      old.sticker === item.sticker &&
      old.visible === item.visible &&
      old.contactId === item.contactId &&
      old.intent === item.intent &&
      old.releaseAt === item.releaseAt
    ) {
      if (prev[index] !== old) changed = true;
      return old;
    }
    changed = true;
    return item;
  });
  if (!changed) {
    for (let index = 0; index < prev.length; index += 1) {
      if (prev[index] !== stabilized[index]) {
        changed = true;
        break;
      }
    }
  }
  return changed ? stabilized : prev;
}

/**
 * Merge poll/mutate inbox payloads.
 * Keeps `state.contactId` aligned with local selection when provided, but NEVER
 * adopts the server's contactId into selection authority (caller must not setState from this).
 */
export function mergeInboxPreservingSelection(inbox, selectedContactId, previousInbox = null) {
  if (!inbox?.state) return inbox;
  const local = normalizeCode(selectedContactId);
  // Prefer prior blob's contactId over server so a slow open cannot reintroduce S36
  // into the inbox object while the user is on GHV.
  const contactId =
    local ||
    normalizeCode(previousInbox?.state?.contactId) ||
    normalizeCode(inbox.state.contactId) ||
    null;
  const messages = stabilizeMessages(previousInbox?.state?.messages, inbox.state.messages);
  const sameContact = contactId === inbox.state.contactId;
  const sameMessages = messages === inbox.state.messages;
  if (sameContact && sameMessages) return inbox;
  return {
    ...inbox,
    state: {
      ...inbox.state,
      contactId,
      messages,
    },
  };
}

/**
 * Apply a /v1/open response: refresh messages/contacts/mode only.
 * Selection chrome is already local; do not let next.state.contactId drive UI.
 */
export function mergeOpenInbox(current, next, selectedContactId) {
  if (!next?.state) return current;
  if (!current?.state) {
    return mergeInboxPreservingSelection(next, selectedContactId, null);
  }
  const local = normalizeCode(selectedContactId);
  return {
    ...current,
    user: next.user || current.user,
    contacts: next.contacts || current.contacts,
    effects: next.effects,
    state: {
      ...current.state,
      mode: next.state.mode ?? current.state.mode,
      dayHour: next.state.dayHour ?? current.state.dayHour,
      dayMinute: next.state.dayMinute ?? current.state.dayMinute,
      digest: next.state.digest ?? current.state.digest,
      // Local selection wins; never next.state.contactId (that was the open-callback snap-back).
      contactId: local || current.state.contactId || next.state.contactId,
      messages: stabilizeMessages(current.state.messages, next.state.messages),
    },
  };
}

/** Partition stabilized messages into a per-contact cache (switching must not wait on open). */
export function updateThreadCache(cache, messages) {
  const next = cache instanceof Map ? cache : new Map();
  const list = Array.isArray(messages) ? messages : [];
  const seen = new Set();
  for (const item of list) {
    const id = normalizeCode(item?.contactId);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const thread = threadMessages(list, id);
    const prior = next.get(id);
    next.set(id, stabilizeMessages(prior, thread));
  }
  return next;
}

/** Cached thread for a contact, or filter live messages as a fallback. */
export function cachedThread(cache, messages, contactId) {
  const id = normalizeCode(contactId);
  if (!id) return [];
  const hit = cache instanceof Map ? cache.get(id) : null;
  if (hit) return hit;
  return threadMessages(messages, id);
}

/**
 * Prove snap-back is impossible for a simulated poll/open sequence.
 * Returns the selection after applying events; used by tests.
 */
export function simulateSelectionAuthority({ initialLocal, taps = [], polls = [], opens = [] }) {
  let local = normalizeCode(initialLocal);
  let inbox = {
    contacts: [
      { id: 'S36', firstName: 'Elton', status: 'active' },
      { id: 'GHV', firstName: 'zjf', status: 'active' },
    ],
    state: { contactId: 'S36', messages: [], mode: 'batched' },
  };

  const tap = (id) => {
    local = normalizeCode(id);
    inbox = mergeInboxPreservingSelection(
      {
        ...inbox,
        state: { ...inbox.state, contactId: local },
      },
      local,
      inbox
    );
  };

  for (const id of taps) tap(id);

  for (const pollContactId of polls) {
    // Poll returns stale server selection — must not move local.
    const poll = {
      ...inbox,
      state: { ...inbox.state, contactId: pollContactId },
    };
    inbox = mergeInboxPreservingSelection(poll, local, inbox);
    // UI authority stays local (no Effect B).
    local = resolveSelectedContactId(inbox.contacts, local, inbox.state.contactId);
  }

  for (const openContactId of opens) {
    const openPayload = {
      ...inbox,
      state: { ...inbox.state, contactId: openContactId },
    };
    inbox = mergeOpenInbox(inbox, openPayload, local);
    local = resolveSelectedContactId(inbox.contacts, local, inbox.state.contactId);
  }

  return { local, inboxContactId: inbox.state.contactId };
}
