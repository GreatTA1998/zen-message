import { createState, reduce } from './delivery.js';
import { accountCode, firstName, hasConfusingCharacter, isCode, normalizeCode } from './people.js';
import { changeMode, changeSchedule, deliverMessage, releaseDue } from '../server/deliver.js';

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
    } catch {
      // Hermes can expose crypto without a working getRandomValues.
    }
  }
  try {
    const Crypto = await import('expo-crypto');
    if (typeof Crypto.getRandomBytes === 'function') return Crypto.getRandomBytes(length);
  } catch {
    // Node has no native Expo crypto module. The phone does.
  }
  const out = new Uint8Array(length);
  for (let index = 0; index < length; index += 1) out[index] = Math.floor(Math.random() * 256);
  return out;
}

function contactKind(contact) {
  return contact?.status || 'active';
}

function isActiveContact(contacts, id) {
  return contacts.some((item) => item.id === id && contactKind(item) === 'active');
}

function publicUser(user) {
  const onboarded = user.onboarded ?? Boolean(user.firstName);
  return {
    id: user.id,
    provider: user.provider,
    firstName: user.firstName || '',
    onboarded,
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
    status: contactKind(contact),
    dayHour: Number.isInteger(person?.dayHour) ? person.dayHour : 19,
    dayMinute: Number.isInteger(person?.dayMinute) ? person.dayMinute : 0,
    offsetMinutes: Number.isInteger(person?.offsetMinutes) ? person.offsetMinutes : 0,
  };
}

function inbox(state, user) {
  return {
    user: publicUser(user),
    contacts: user.contacts.map((contact) => contactCard(state.users, contact)),
    effects: user.pendingEffects,
    state: {
      mode: user.mode,
      dayHour: Number.isInteger(user.dayHour) ? user.dayHour : 19,
      dayMinute: Number.isInteger(user.dayMinute) ? user.dayMinute : 0,
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
    onboarded: user.onboarded ?? Boolean(user.firstName),
    contacts: user.contacts,
    pushToken: user.pushToken,
    offsetMinutes: user.offsetMinutes,
    provider: user.provider,
    subject: user.subject,
    pendingEffects: user.pendingEffects,
  };
}

function upsertContact(contacts, id, status) {
  const list = contacts || [];
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return [...list, { id, status }];
  const current = contactKind(list[index]);
  if (current === 'active') return list;
  if (status === 'active') {
    const next = [...list];
    next[index] = { id, status: 'active' };
    return next;
  }
  if (current === status) return list;
  const next = [...list];
  next[index] = { id, status };
  return next;
}

function removeContact(contacts, id) {
  return (contacts || []).filter((item) => item.id !== id);
}

function blockedIds(user) {
  return user.blocked || [];
}

function isBlocked(user, otherId) {
  return blockedIds(user).includes(otherId);
}

function rememberBlocked(user, otherId) {
  if (isBlocked(user, otherId)) return;
  user.blocked = [...blockedIds(user), otherId];
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
    person.blocked = blockedIds(person).filter((id) => id !== userId);
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
  if (isActiveContact(fromUser.contacts, toUser.id)) fail('already_friends');
  if (isActiveContact(toUser.contacts, fromUser.id)) fail('already_friends');
  const fromHasIn = fromUser.contacts.some(
    (item) => item.id === toUser.id && contactKind(item) === 'pending-in'
  );
  const toHasOut = toUser.contacts.some(
    (item) => item.id === fromUser.id && contactKind(item) === 'pending-out'
  );
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

function applyClock(user, offsetMinutes) {
  if (typeof offsetMinutes === 'number' && Number.isFinite(offsetMinutes)) {
    user.offsetMinutes = offsetMinutes;
  }
}

function userFrom(state, token) {
  const id = state.sessions[token];
  return id ? state.users[id] : null;
}

function findByIdentity(state, provider, subject) {
  return Object.values(state.users).find((user) => user.provider === provider && user.subject === subject) ?? null;
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
    for (const message of user.messages || []) {
      if (message.direction !== 'in' || !message.contactId || message.contactId === user.id) continue;
      if (!state.users[message.contactId]) continue;
      if (!isActiveContact(user.contacts, message.contactId)) {
        user.contacts = upsertContact(user.contacts, message.contactId, 'active');
      }
      if (!user.contactId) user.contactId = message.contactId;
    }
  }

  function exclusive(work) {
    const run = chain.then(work, work);
    chain = run.then(
      () => {},
      () => {}
    );
    return run;
  }

  async function load(store) {
    const raw = await store.getItem(STORE_KEY);
    if (!raw) return { users: {}, sessions: {} };
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users || {},
      sessions: parsed.sessions || {},
      reports: parsed.reports || [],
    };
  }

  async function save(store, state) {
    await store.setItem(STORE_KEY, JSON.stringify(state));
  }

  function releaseDueAlerts(state, now) {
    const queued = [];
    for (const person of Object.values(state.users)) {
      const released = releaseDue(person, now);
      if (!released.effects.length) continue;
      adopt(person, released.state);
      person.pendingEffects = released.effects;
      queued.push({ recipient: person, effects: released.effects });
    }
    return queued;
  }

  async function commit(store, state) {
    const due = releaseDueAlerts(state, Date.now());
    await save(store, state);
    if (typeof store.onDeliver === 'function') {
      for (const item of due) store.onDeliver(item.recipient, item.effects);
    }
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
      if (!provider || subject.length < 4) fail('provider_subject_missing');
      const existing = findByIdentity(state, provider, subject);
      const user =
        existing ??
        {
          ...createState(),
          id: mintCode(state.users, provider, subject),
          provider,
          subject,
          firstName: '',
          onboarded: false,
          pushToken: null,
          offsetMinutes: 0,
          contacts: [],
          pendingEffects: [],
        };
      state.users[user.id] = user;
      const sessionToken = await hex(24);
      state.sessions[sessionToken] = user.id;
      await commit(store, state);
      return { token: sessionToken, user: publicUser(user) };
    }

    const user = userFrom(state, token);
    if (!user) fail('sign_in_required');
    const offset = method === 'GET' ? Number(url.searchParams.get('offset')) : body?.offsetMinutes;
    applyClock(user, offset);

    if (method === 'GET' && url.pathname === '/v1/person') {
      const code = normalizeCode(url.searchParams.get('code'));
      const found = isCode(code) ? state.users[code] : null;
      if (!found || found.id === user.id) return { found: false };
      return { found: true, name: found.firstName || found.id };
    }

    if (method === 'GET' && url.pathname === '/v1/inbox') {
      linkIncomingContacts(state, user);
      await commit(store, state);
      return inbox(state, user);
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
      await commit(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/friend-request/accept') {
      const id = normalizeCode(body?.contactId);
      if (!isCode(id)) fail('person_not_found');
      const other = state.users[id];
      const pending = user.contacts.find((item) => item.id === id && contactKind(item) === 'pending-in');
      if (!other || !pending) fail('person_not_found');
      becomeFriends(state, user.id, other.id);
      user.contactId = other.id;
      await commit(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/friend-request/decline') {
      const id = normalizeCode(body?.contactId);
      if (!isCode(id)) fail('person_not_found');
      const other = state.users[id];
      const pending = user.contacts.find((item) => item.id === id && contactKind(item) === 'pending-in');
      if (!other || !pending) fail('person_not_found');
      user.contacts = removeContact(user.contacts, id);
      other.contacts = removeContact(other.contacts, user.id);
      if (user.contactId === id) user.contactId = user.contacts[0]?.id ?? null;
      await commit(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/open') {
      if (user.contacts.some((item) => item.id === body?.contactId)) user.contactId = body.contactId;
      await commit(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/messages') {
      const recipient = state.users[body?.contactId];
      if (
        !recipient ||
        !isActiveContact(user.contacts, recipient.id) ||
        isBlocked(user, recipient.id) ||
        isBlocked(recipient, user.id)
      ) {
        fail('person_not_found');
      }
      const result = deliverMessage(user, recipient, {
        id: await hex(8),
        body: body?.body,
        photo: body?.photo,
        intent: body?.intent,
        releaseAt: body?.releaseAt,
        now: Date.now(),
      });
      adopt(user, result.sender);
      adopt(recipient, result.recipient);
      linkIncomingContacts(state, recipient);
      if (result.recipientEffects.length) recipient.pendingEffects = result.recipientEffects;
      await commit(store, state);
      if (typeof store.onDeliver === 'function') store.onDeliver(recipient, result.recipientEffects);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/mode') {
      const result = changeMode(user, body?.mode);
      adopt(user, result.state);
      if (result.effects.length) user.pendingEffects = result.effects;
      await commit(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/schedule') {
      const result = changeSchedule(user, body?.dayHour, body?.dayMinute, Date.now());
      adopt(user, result.state);
      if (result.effects.length) user.pendingEffects = result.effects;
      await commit(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/push-token') {
      user.pushToken = expoPushToken(body?.token);
      await commit(store, state);
      return { ok: true };
    }

    if (method === 'POST' && url.pathname === '/v1/effects/ack') {
      user.pendingEffects = [];
      await commit(store, state);
      return { ok: true };
    }

    if (method === 'POST' && url.pathname === '/v1/shown') {
      const result = reduce(user, { type: 'shown', now: Date.now() });
      adopt(user, result.state);
      user.pendingEffects = [];
      await commit(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/account/delete') {
      const userId = user.id;
      purgeUser(state, userId);
      await commit(store, state);
      return { ok: true };
    }

    if (method === 'POST' && url.pathname === '/v1/block') {
      const id = normalizeCode(body?.contactId);
      if (!isCode(id)) fail('person_not_found');
      if (!blockPair(state, user, id)) fail('person_not_found');
      await commit(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/report') {
      const id = normalizeCode(body?.contactId);
      if (!isCode(id)) fail('person_not_found');
      const other = state.users[id];
      if (!other || other.id === user.id) fail('person_not_found');
      const messageId = typeof body?.messageId === 'string' ? body.messageId.slice(0, 32) : null;
      if (messageId && !(user.messages || []).some((message) => message.id === messageId && message.contactId === id)) {
        fail('person_not_found');
      }
      state.reports = state.reports || [];
      state.reports.push({
        id: await hex(8),
        reporterId: user.id,
        reportedId: id,
        messageId,
        at: Date.now(),
      });
      await commit(store, state);
      return { ok: true };
    }

    fail('not_found');
  }
}

export function memoryStorage() {
  const values = new Map();
  return {
    async getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    async setItem(key, value) {
      values.set(key, value);
    },
  };
}
