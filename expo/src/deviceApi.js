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

function publicUser(user) {
  return { id: user.id, provider: user.provider, firstName: user.firstName || '' };
}

function contactCard(users, contact) {
  const person = users[contact.id];
  return {
    id: contact.id,
    firstName: person?.firstName || '',
    scheduleId: person?.scheduleId || 'daily-1-7',
    weekDay: Number.isInteger(person?.weekDay) ? person.weekDay : 0,
    weekHour: Number.isInteger(person?.weekHour) ? person.weekHour : 17,
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
      scheduleId: user.scheduleId,
      weekDay: user.weekDay,
      weekHour: user.weekHour,
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
    contacts: user.contacts,
    pushToken: user.pushToken,
    offsetMinutes: user.offsetMinutes,
    provider: user.provider,
    subject: user.subject,
    pendingEffects: user.pendingEffects,
  };
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
      if (!user.contacts.some((item) => item.id === message.contactId)) {
        user.contacts = [...user.contacts, { id: message.contactId }];
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
    };
  }

  async function save(store, state) {
    await store.setItem(STORE_KEY, JSON.stringify(state));
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
          pushToken: null,
          offsetMinutes: 0,
          contacts: [],
          pendingEffects: [],
        };
      const name = firstName(body?.firstName);
      if (name) user.firstName = name;
      state.users[user.id] = user;
      const sessionToken = await hex(24);
      state.sessions[sessionToken] = user.id;
      await save(store, state);
      return { token: sessionToken, user: publicUser(user) };
    }

    const user = userFrom(state, token);
    if (!user) fail('sign_in_required');
    const offset = method === 'GET' ? Number(url.searchParams.get('offset')) : body?.offsetMinutes;
    applyClock(user, offset);

    if (method === 'GET' && url.pathname === '/v1/inbox') {
      const released = releaseDue(user, Date.now());
      adopt(user, released.state);
      if (released.effects.length) user.pendingEffects = released.effects;
      linkIncomingContacts(state, user);
      await save(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/contacts') {
      const code = normalizeCode(body?.code);
      if (hasConfusingCharacter(code) || (code && !isCode(code))) fail('code_invalid');
      const found = isCode(code) ? state.users[code] : null;
      if (!found || found.id === user.id) fail('person_not_found');
      if (!user.contacts.some((item) => item.id === found.id)) {
        user.contacts = [...user.contacts, { id: found.id }];
      }
      if (!user.contactId) user.contactId = found.id;
      await save(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/open') {
      if (user.contacts.some((item) => item.id === body?.contactId)) user.contactId = body.contactId;
      await save(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/messages') {
      const recipient = state.users[body?.contactId];
      if (!recipient || !user.contacts.some((item) => item.id === recipient.id)) fail('person_not_found');
      const result = deliverMessage(user, recipient, {
        id: await hex(8),
        body: body?.body,
        photo: body?.photo,
        intent: body?.intent,
        now: Date.now(),
      });
      adopt(user, result.sender);
      adopt(recipient, result.recipient);
      linkIncomingContacts(state, recipient);
      if (result.recipientEffects.length) recipient.pendingEffects = result.recipientEffects;
      await save(store, state);
      if (typeof store.onDeliver === 'function') store.onDeliver(recipient, result.recipientEffects);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/mode') {
      const result = changeMode(user, body?.mode);
      adopt(user, result.state);
      if (result.effects.length) user.pendingEffects = result.effects;
      await save(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/schedule') {
      const result = changeSchedule(user, body?.scheduleId, Date.now(), {
        weekDay: body?.weekDay,
        weekHour: body?.weekHour,
      });
      adopt(user, result.state);
      if (result.effects.length) user.pendingEffects = result.effects;
      await save(store, state);
      return inbox(state, user);
    }

    if (method === 'POST' && url.pathname === '/v1/push-token') {
      user.pushToken = typeof body?.token === 'string' ? body.token : null;
      await save(store, state);
      return { ok: true };
    }

    if (method === 'POST' && url.pathname === '/v1/effects/ack') {
      user.pendingEffects = [];
      await save(store, state);
      return { ok: true };
    }

    if (method === 'POST' && url.pathname === '/v1/shown') {
      const result = reduce(user, { type: 'shown', now: Date.now() });
      adopt(user, result.state);
      user.pendingEffects = [];
      await save(store, state);
      return inbox(state, user);
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
