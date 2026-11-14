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

/** Keep UI selection when a poll/open inbox payload would otherwise clobber it. */
export function mergeInboxPreservingSelection(inbox, selectedContactId) {
  if (!inbox?.state) return inbox;
  const selected = resolveSelectedContactId(inbox.contacts, selectedContactId, inbox.state.contactId);
  if (!selected || selected === inbox.state.contactId) return inbox;
  return {
    ...inbox,
    state: {
      ...inbox.state,
      contactId: selected,
    },
  };
}

/** True when this id is an openable row in the strip. */
export function canSelectContact(contacts, contactId) {
  const id = normalizeCode(contactId);
  return Boolean(id && isCode(id) && (contacts || []).some((item) => normalizeCode(item.id) === id));
}
