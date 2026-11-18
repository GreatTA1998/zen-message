import { createState, reduce } from './delivery.js';
import { accountCode, firstName, hasConfusingCharacter, isCode, normalizeCode } from './people.js';
import { changeMode, changeSchedule, deliverMessage, releaseDue } from './deliver.js';
const STORE_KEY = 'zen-message.device';
function fail(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}
async function defaultBytes(length) {
  const read = globalThis.crypto?.getRandomValues;
  if (typeof read === 'function') {
    try {
      const out = new Uint8Array(length);
      read.call(globalThis.crypto, out);
      return out;
    } catch { /* Hermes can expose crypto without a working getRandomValues. */ }
  }
  try {
    const Crypto = await import('expo-crypto');
    if (typeof Crypto.getRandomBytes === 'function') return Crypto.getRandomBytes(length);
  } catch { /* Node has no native Expo crypto module. The phone does. */ }
  const out = new Uint8Array(length);
  for (let index = 0; index < length; index += 1) out[index] = Math.floor(Math.random() * 256);
  return out;
}
const contactKind = (contact) => contact?.status || 'active';
const avatarOf = (user) => (typeof user?.avatar === 'string' && user.avatar ? user.avatar : null);
const intOr = (value, fallback) => (Number.isInteger(value) ? value : fallback);
function isActiveContact(contacts, id) {
  const want = normalizeCode(id);
  return contacts.some((item) => normalizeCode(item.id) === want && contactKind(item) === 'active');
}
function publicUser(user) {
  return {
    id: user.id,
    provider: user.provider,
    firstName: user.firstName || '',
    avatar: avatarOf(user),
    onboarded: user.onboarded ?? Boolean(user.firstName),
  };
}
function expoPushToken(value) {
  if (typeof value !== 'string') return null;
  const token = value.trim();
  return /^ExponentPushToken\[[A-Za-z0-9_-]{8,160}\]$/.test(token) ? token : null;
}
function contactCard(users, contact) {
  const person = users[contact.id];
  return {
    id: contact.id,
    firstName: person?.firstName || '',
    avatar: avatarOf(person),
    status: contactKind(contact),
    notifyAll: contact.notifyAll === true,
    dayHour: intOr(person?.dayHour, 19),
    dayMinute: intOr(person?.dayMinute, 0),
    offsetMinutes: intOr(person?.offsetMinutes, 0),
  };
}
function inbox(state, user) {
  return {
    user: publicUser(user),
    contacts: user.contacts.map((contact) => contactCard(state.users, contact)),
    effects: user.pendingEffects,
    state: {
      mode: user.mode,
      dayHour: intOr(user.dayHour, 19),
      dayMinute: intOr(user.dayMinute, 0),
      contactId: user.contactId,
      messages: user.messages,
      digest: user.digest,
    },
  };
}
function keepAccount(user) {
  return {
    id: user.id,
    firstName: user.firstName || '',
    avatar: avatarOf(user),
    onboarded: user.onboarded ?? Boolean(user.firstName),
    contacts: user.contacts,
    pushToken: user.pushToken,
    offsetMinutes: user.offsetMinutes,
    provider: user.provider,
    subject: user.subject,
    identities: userIdentities(user),
    email: user.email || '',
    pendingEffects: user.pendingEffects,
  };
}
function upsertContact(contacts, id, status) {
  const list = contacts || [];
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return [...list, { id, status }];
  const current = contactKind(list[index]);
  if (current === 'active' || current === status) return list;
  const next = [...list];
  next[index] = { ...list[index], id, status };
  return next;
}
const removeContact = (contacts, id) => (contacts || []).filter((item) => item.id !== id);
function isBlocked(user, otherId) {
  return (user.blocked || []).includes(otherId);
}
function rememberBlocked(user, otherId) {
  if (isBlocked(user, otherId)) return;
  user.blocked = [...(user.blocked || []), otherId];
}
function purgeThread(user, otherId) {
  user.contacts = removeContact(user.contacts, otherId);
  user.messages = (user.messages || []).filter((message) => message.contactId !== otherId);
  if (user.contactId === otherId) user.contactId = user.contacts[0]?.id ?? null;
}
function purgeUser(state, userId) {
  delete state.users[userId];
  for (const token of Object.keys(state.sessions)) {
    if (state.sessions[token] === userId) delete state.sessions[token];
  }
  for (const person of Object.values(state.users)) {
    purgeThread(person, userId);
    person.blocked = (person.blocked || []).filter((id) => id !== userId);
  }
  state.reports = (state.reports || []).filter(
    (report) => report.reporterId !== userId && report.reportedId !== userId
  );
}
function blockPair(state, user, otherId) {
  const other = state.users[otherId];
  if (!other || otherId === user.id) return false;
  purgeThread(user, otherId);
  purgeThread(other, user.id);
  rememberBlocked(user, otherId);
  rememberBlocked(other, user.id);
  return true;
}
function becomeFriends(state, leftId, rightId) {
  const left = state.users[leftId];
  const right = state.users[rightId];
  if (!left || !right) return;
  left.contacts = upsertContact(left.contacts, rightId, 'active');
  right.contacts = upsertContact(right.contacts, leftId, 'active');
}
function sendFriendRequest(state, fromUser, toUser) {
  if (isBlocked(fromUser, toUser.id) || isBlocked(toUser, fromUser.id)) fail('person_not_found');
  if (isActiveContact(fromUser.contacts, toUser.id) || isActiveContact(toUser.contacts, fromUser.id)) {
    fail('already_friends');
  }
  const fromHasIn = fromUser.contacts.some((item) => item.id === toUser.id && contactKind(item) === 'pending-in');
  const toHasOut = toUser.contacts.some((item) => item.id === fromUser.id && contactKind(item) === 'pending-out');
  if (fromHasIn && toHasOut) {
    becomeFriends(state, fromUser.id, toUser.id);
    return;
  }
  if (fromUser.contacts.some((item) => item.id === toUser.id)) return;
  fromUser.contacts = upsertContact(fromUser.contacts, toUser.id, 'pending-out');
  toUser.contacts = upsertContact(toUser.contacts, fromUser.id, 'pending-in');
}
function adopt(user, next) {
  const account = keepAccount(user);
  Object.assign(user, next, account);
}
const userFrom = (state, token) => (state.sessions[token] ? state.users[state.sessions[token]] : null);
function userIdentities(user) {
  const listed = Array.isArray(user?.identities) ? user.identities : [];
  const primary =
    user?.provider && user?.subject ? [{ provider: user.provider, subject: user.subject }] : [];
  const seen = new Set();
  return [...primary, ...listed].filter((item) => {
    if (!item?.provider || !item?.subject) return false;
    const key = `${item.provider}:${item.subject}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function attachIdentity(user, provider, subject) {
  const identities = userIdentities(user);
  if (identities.some((item) => item.provider === provider && item.subject === subject)) {
    user.identities = identities;
    return;
  }
  const next = [...identities, { provider, subject }];
  const primary = next.find((item) => item.provider === 'apple') || next[0] || null;
  user.identities = next;
  if (primary) {
    user.provider = primary.provider;
    user.subject = primary.subject;
  }
}
function findByIdentity(state, provider, subject) {
  return (
    Object.values(state.users).find((user) =>
      userIdentities(user).some((item) => item.provider === provider && item.subject === subject)
    ) ?? null
  );
}
const findByEmail = (state, email) =>
  email ? (Object.values(state.users).find((user) => user.email === email) ?? null) : null;
const mapGuestId = (id, guestId, hostId) => (id === guestId ? hostId : id);
function requirePersonId(raw) {
  const id = normalizeCode(raw);
  if (!isCode(id)) fail('person_not_found');
  return id;
}
function requirePendingIn(state, user, id) {
  const other = state.users[id];
  const pending = user.contacts.find((item) => item.id === id && contactKind(item) === 'pending-in');
  if (!other || !pending) fail('person_not_found');
  return other;
}
function mergeUsers(state, host, guest) {
  if (!host || !guest || host.id === guest.id) return host;
  for (const identity of userIdentities(guest)) attachIdentity(host, identity.provider, identity.subject);
  if (guest.email && !host.email) host.email = guest.email;
  if (guest.pushToken && !host.pushToken) host.pushToken = guest.pushToken;
  if (!host.firstName && guest.firstName) host.firstName = guest.firstName;
  host.onboarded = Boolean(host.onboarded || guest.onboarded || host.firstName);
  for (const contact of guest.contacts || []) {
    if (contact.id === host.id || contact.id === guest.id) continue;
    host.contacts = upsertContact(host.contacts, contact.id, contact.status || 'active');
    const peer = state.users[contact.id];
    if (!peer) continue;
    peer.contacts = removeContact(peer.contacts, guest.id);
    peer.contacts = upsertContact(peer.contacts, host.id, contact.status || 'active');
    peer.messages = (peer.messages || []).map((message) =>
      message.contactId === guest.id ? { ...message, contactId: host.id } : message
    );
    if (peer.contactId === guest.id) peer.contactId = host.id;
  }
  for (const message of guest.messages || []) {
    if (message.contactId === host.id || message.contactId === guest.id) continue;
    host.messages = [...(host.messages || []), message];
  }
  host.contacts = removeContact(host.contacts, guest.id);
  if (host.contactId === guest.id) host.contactId = host.contacts[0]?.id ?? null;
  for (const token of Object.keys(state.sessions)) {
    if (state.sessions[token] === guest.id) state.sessions[token] = host.id;
  }
  state.reports = (state.reports || []).map((report) => ({
    ...report,
    reporterId: mapGuestId(report.reporterId, guest.id, host.id),
    reportedId: mapGuestId(report.reportedId, guest.id, host.id),
  }));
  delete state.users[guest.id];
  return host;
}
function absorbSelfDuplicate(state, user) {
  if (!userIdentities(user).some((item) => item.provider === 'google')) return user;
  const contacts = user.contacts || [];
  if (contacts.length !== 1 || contactKind(contacts[0]) !== 'active') return user;
  const other = state.users[contacts[0].id];
  if (!other || other.provider !== 'apple') return user;
  if (!user.firstName || user.firstName !== other.firstName) return user;
  if (!(other.contacts || []).some((item) => item.id === user.id && contactKind(item) === 'active')) return user;
  return mergeUsers(state, other, user);
}
export function createDeviceApi(storage, randomBytes = defaultBytes) {
  let chain = Promise.resolve();
  async function bytes(length) {
    const sample = await randomBytes(length);
    return sample instanceof Uint8Array ? sample : Uint8Array.from(sample);
  }
  async function hex(length) {
    const sample = await bytes(length);
    return [...sample].map((value) => value.toString(16).padStart(2, '0')).join('');
  }
  function mintCode(users, provider, subject) {
    const code = accountCode(provider, subject, (candidate) => {
      const owner = users[candidate];
      return Boolean(owner && (owner.provider !== provider || owner.subject !== subject));
    });
    if (!code) fail('code_exhausted');
    return code;
  }
  function linkIncomingContacts(state, user) {
    let changed = false;
    for (const message of user.messages || []) {
      if (message.direction !== 'in' || !message.contactId || message.contactId === user.id) continue;
      const peerId = normalizeCode(message.contactId);
      if (!isCode(peerId) || !state.users[peerId]) continue;
      if (!isActiveContact(user.contacts, peerId)) {
        user.contacts = upsertContact(user.contacts, peerId, 'active');
        changed = true;
      }
      if (!user.contactId) {
        user.contactId = peerId;
        changed = true;
      }
    }
    return changed;
  }
  function exclusive(work) {
    const run = chain.then(work, work);
    chain = run.then(() => {}, () => {});
    return run;
  }
  async function load(store) {
    const raw = await store.getItem(STORE_KEY);
    if (!raw) return { users: {}, sessions: {} };
    const parsed = JSON.parse(raw);
    return { users: parsed.users || {}, sessions: parsed.sessions || {} };
  }
  async function save(store, state) {
    await store.setItem(STORE_KEY, JSON.stringify(state));
  }
  function holdEffects(person, effects) {
    person.pendingEffects = person.pushToken ? effects.filter((effect) => effect.type !== 'present') : effects;
  }
  function releaseDueAlerts(state, now) {
    const queued = [];
    for (const person of Object.values(state.users)) {
      const released = releaseDue(person, now);
      if (!released.effects.length) continue;
      adopt(person, released.state);
      holdEffects(person, released.effects);
      queued.push({ recipient: person, effects: released.effects });
    }
    return queued;
  }
  async function commit(store, state, { force = true } = {}) {
    const due = releaseDueAlerts(state, Date.now());
    if (force || due.length) await save(store, state);
    if (typeof store.onDeliver === 'function') {
      for (const item of due) store.onDeliver(item.recipient, item.effects);
    }
    return due;
  }
  async function commitInbox(store, state, user, commitOpts) {
    await commit(store, state, commitOpts);
    return inbox(state, user);
  }
  async function adoptCommitInbox(store, state, user, result) {
    adopt(user, result.state);
    if (result.effects.length) user.pendingEffects = result.effects;
    return commitInbox(store, state, user);
  }
  async function commitOk(store, state) {
    await commit(store, state);
    return { ok: true };
  }
  return function request(path, { token, method = 'GET', body } = {}) {
    const options = { token, method, body };
    return exclusive(() =>
      typeof storage.transact === 'function'
        ? storage.transact((store) => handle(store, path, options))
        : handle(storage, path, options)
    );
  };
  async function handle(store, path, { token, method, body }) {
    const state = await load(store);
    const url = new URL(path, 'http://device.local');
    if (method === 'POST' && url.pathname === '/v1/session') {
      const provider = body?.provider === 'apple' || body?.provider === 'google' ? body.provider : null;
      const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
      const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
      if (!provider || subject.length < 4) fail('provider_subject_missing');
      let user =
        findByIdentity(state, provider, subject) || (email ? findByEmail(state, email) : null);
      if (user) {
        attachIdentity(user, provider, subject);
        if (email) user.email = email;
        if (body?.firstName && !user.firstName) user.firstName = firstName(body.firstName);
      } else {
        user = {
          ...createState(),
          id: mintCode(state.users, provider, subject),
          provider,
          subject,
          identities: [{ provider, subject }],
          email,
          firstName: '',
          onboarded: false,
          pushToken: null,
          offsetMinutes: 0,
          contacts: [],
          pendingEffects: [],
        };
      }
      user = absorbSelfDuplicate(state, user);
      state.users[user.id] = user;
      const sessionToken = await hex(24);
      state.sessions[sessionToken] = user.id;
      await commit(store, state);
      return { token: sessionToken, user: publicUser(user) };
    }
    let user = userFrom(state, token);
    if (!user) fail('sign_in_required');
    const host = absorbSelfDuplicate(state, user);
    const mergedSelf = host.id !== user.id;
    user = host;
    const offset = method === 'GET' ? Number(url.searchParams.get('offset')) : body?.offsetMinutes;
    const priorOffset = user.offsetMinutes;
    if (typeof offset === 'number' && Number.isFinite(offset)) user.offsetMinutes = offset;
    const clockDirty = user.offsetMinutes !== priorOffset || mergedSelf;
    if (method === 'GET' && url.pathname === '/v1/person') {
      const code = normalizeCode(url.searchParams.get('code'));
      const found = isCode(code) ? state.users[code] : null;
      if (!found || found.id === user.id) return { found: false };
      return { found: true, name: found.firstName || found.id };
    }
    if (method === 'GET' && url.pathname === '/v1/inbox') {
      const linked = linkIncomingContacts(state, user);
      return commitInbox(store, state, user, { force: linked || clockDirty });
    }
    if (method === 'POST' && url.pathname === '/v1/profile') {
      const nickname = firstName(body?.nickname);
      if (!nickname) fail('nickname_missing');
      user.firstName = nickname;
      user.onboarded = true;
      await commit(store, state);
      return { user: publicUser(user) };
    }
    if (method === 'POST' && url.pathname === '/v1/contacts') {
      const code = normalizeCode(body?.code);
      if (hasConfusingCharacter(code) || (code && !isCode(code))) fail('code_invalid');
      const found = isCode(code) ? state.users[code] : null;
      if (!found || found.id === user.id) fail('person_not_found');
      sendFriendRequest(state, user, found);
      if (!user.contactId) user.contactId = found.id;
      return commitInbox(store, state, user);
    }
    if (method === 'POST' && url.pathname.startsWith('/v1/friend-request/')) {
      const accept = url.pathname.endsWith('/accept');
      const id = requirePersonId(body?.contactId);
      const other = requirePendingIn(state, user, id);
      if (accept) {
        becomeFriends(state, user.id, other.id);
        user.contactId = other.id;
        if (!other.contactId) other.contactId = user.id;
      } else if (url.pathname.endsWith('/decline')) {
        user.contacts = removeContact(user.contacts, id);
        other.contacts = removeContact(other.contacts, user.id);
        if (user.contactId === id) user.contactId = user.contacts[0]?.id ?? null;
      } else fail('not_found');
      return commitInbox(store, state, user);
    }
    if (method === 'POST' && url.pathname === '/v1/open') {
      const id = normalizeCode(body?.contactId);
      const match = isCode(id) ? user.contacts.find((item) => normalizeCode(item.id) === id) : null;
      if (match) {
        const canonical = normalizeCode(match.id);
        const touch = normalizeCode(user.contactId) !== canonical || match.id !== canonical;
        if (normalizeCode(user.contactId) !== canonical) user.contactId = canonical;
        if (match.id !== canonical) match.id = canonical;
        if (touch) await commit(store, state);
      }
      return inbox(state, user);
    }
    if (method === 'POST' && url.pathname === '/v1/notify-all') {
      const id = requirePersonId(body?.contactId);
      const match = user.contacts.find((item) => item.id === id);
      if (!match || contactKind(match) !== 'active') fail('person_not_found');
      match.notifyAll = body?.on === true;
      return commitInbox(store, state, user);
    }
    if (method === 'POST' && url.pathname === '/v1/messages') {
      const recipientId = normalizeCode(body?.contactId);
      const recipient = isCode(recipientId) ? state.users[recipientId] : null;
      if (
        !recipient ||
        !isActiveContact(user.contacts, recipient.id) ||
        isBlocked(user, recipient.id) ||
        isBlocked(recipient, user.id)
      ) {
        fail('person_not_found');
      }
      const clientId =
        typeof body?.clientId === 'string' && body.clientId.length > 0 && body.clientId.length <= 48
          ? body.clientId
          : '';
      if (clientId && (user.messages || []).some((message) => message.id === clientId)) return inbox(state, user);
      const before = (user.messages || []).length;
      const result = deliverMessage(user, recipient, {
        id: clientId || (await hex(8)),
        body: body?.body,
        photo: body?.photo,
        sticker: body?.sticker,
        intent: body?.intent,
        releaseAt: body?.releaseAt,
        now: Date.now(),
      });
      adopt(user, result.sender);
      adopt(recipient, result.recipient);
      if ((user.messages || []).length <= before) fail('message_invalid');
      linkIncomingContacts(state, recipient);
      if (result.recipientEffects.length) holdEffects(recipient, result.recipientEffects);
      await commit(store, state);
      if (typeof store.onDeliver === 'function') store.onDeliver(recipient, result.recipientEffects);
      return inbox(state, user);
    }
    if (method === 'POST' && url.pathname === '/v1/mode') {
      return adoptCommitInbox(store, state, user, changeMode(user, body?.mode));
    }
    if (method === 'POST' && url.pathname === '/v1/schedule') {
      return adoptCommitInbox(store, state, user, changeSchedule(user, body?.dayHour, body?.dayMinute, Date.now()));
    }
    if (method === 'POST' && (url.pathname === '/v1/push-token' || url.pathname === '/v1/effects/ack')) {
      if (url.pathname === '/v1/push-token') user.pushToken = expoPushToken(body?.token);
      else user.pendingEffects = [];
      return commitOk(store, state);
    }
    if (method === 'POST' && url.pathname === '/v1/shown') {
      return adoptCommitInbox(store, state, user, reduce(user, { type: 'shown', now: Date.now() }));
    }
    if (method === 'POST' && url.pathname === '/v1/account/delete') {
      purgeUser(state, user.id);
      return commitOk(store, state);
    }
    if (method === 'POST' && url.pathname === '/v1/block') {
      const id = requirePersonId(body?.contactId);
      if (!blockPair(state, user, id)) fail('person_not_found');
      return commitInbox(store, state, user);
    }
    if (method === 'POST' && url.pathname === '/v1/report') {
      const id = requirePersonId(body?.contactId);
      const other = state.users[id];
      if (!other || other.id === user.id) fail('person_not_found');
      const messageId = typeof body?.messageId === 'string' ? body.messageId.slice(0, 32) : null;
      if (messageId && !(user.messages || []).some((message) => message.id === messageId && message.contactId === id)) {
        fail('person_not_found');
      }
      state.reports = state.reports || [];
      state.reports.push({ id: await hex(8), reporterId: user.id, reportedId: id, messageId, at: Date.now() });
      return commitOk(store, state);
    }
    fail('not_found');
  }
}
export function memoryStorage() {
  const values = new Map();
  return {
    async getItem(key) { return values.has(key) ? values.get(key) : null; },
    async setItem(key, value) { values.set(key, value); },
  };
}
