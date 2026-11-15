import { isCode, normalizeCode } from './people.js';

/** Pick the contact id that should drive strip ring, composer, and thread. */
export function resolveSelectedContactId(contacts, localId, serverId) {
  const list = Array.isArray(contacts) ? contacts : [];
  const local = normalizeCode(localId);
  if (local && list.some((item) => normalizeCode(item.id) === local)) return local;
  const server = normalizeCode(serverId);
  if (server && list.some((item) => normalizeCode(item.id) === server)) return server;
  return list[0] ? normalizeCode(list[0].id) : null;
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

/** Keep UI selection when a poll/open inbox payload would otherwise clobber it. */
export function mergeInboxPreservingSelection(inbox, selectedContactId, previousInbox = null) {
  if (!inbox?.state) return inbox;
  const selected = resolveSelectedContactId(inbox.contacts, selectedContactId, inbox.state.contactId);
  const messages = stabilizeMessages(previousInbox?.state?.messages, inbox.state.messages);
  const contactId = selected || inbox.state.contactId;
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
 * Apply a /v1/open response without forcing a full message remount.
 * Selection chrome already updated locally; keep prior message object identity.
 */
export function mergeOpenInbox(current, next, selectedContactId) {
  if (!next?.state) return current;
  if (!current?.state) {
    return mergeInboxPreservingSelection(next, selectedContactId, null);
  }
  const selected = resolveSelectedContactId(
    next.contacts || current.contacts,
    selectedContactId,
    next.state.contactId
  );
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
      contactId: selected || next.state.contactId || current.state.contactId,
      messages: stabilizeMessages(current.state.messages, next.state.messages),
    },
  };
}

/** True when this id is an openable row in the strip. */
export function canSelectContact(contacts, contactId) {
  const id = normalizeCode(contactId);
  return Boolean(id && isCode(id) && (contacts || []).some((item) => normalizeCode(item.id) === id));
}
