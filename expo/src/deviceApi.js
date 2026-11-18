import { createState, reduce } from './delivery.js';
import { accountCode, firstName, hasConfusingCharacter, isCode, normalizeCode } from './people.js';
import { changeMode, changeSchedule, deliverMessage, releaseDue } from './deliver.js';
const STORE_KEY = 'zen-message.device';
const fail = (code) => { const e = new Error(code); e.code = code; throw e; };
async function defaultBytes(length) {
  const read = globalThis.crypto?.getRandomValues;
  if (typeof read === 'function') try { const out = new Uint8Array(length); read.call(globalThis.crypto, out); return out; } catch { /* Hermes */ }
  try { const Crypto = await import('expo-crypto'); if (typeof Crypto.getRandomBytes === 'function') return Crypto.getRandomBytes(length); } catch { /* Node */ }
  const out = new Uint8Array(length); for (let i = 0; i < length; i += 1) out[i] = Math.floor(Math.random() * 256); return out;
}
const kind = (c) => c?.status || 'active';
const avatarOf = (u) => (typeof u?.avatar === 'string' && u.avatar ? u.avatar : null);
const intOr = (v, fb) => (Number.isInteger(v) ? v : fb);
const isActive = (contacts, id) => { const want = normalizeCode(id); return contacts.some((i) => normalizeCode(i.id) === want && kind(i) === 'active'); };
const publicUser = (u) => ({ id: u.id, provider: u.provider, firstName: u.firstName || '', avatar: avatarOf(u), onboarded: u.onboarded ?? Boolean(u.firstName) });
const expoPushToken = (v) => { if (typeof v !== 'string') return null; const t = v.trim(); return /^ExponentPushToken\[[A-Za-z0-9_-]{8,160}\]$/.test(t) ? t : null; };
const contactCard = (users, c) => { const p = users[c.id]; return { id: c.id, firstName: p?.firstName || '', avatar: avatarOf(p), status: kind(c), notifyAll: c.notifyAll === true, dayHour: intOr(p?.dayHour, 19), dayMinute: intOr(p?.dayMinute, 0), offsetMinutes: intOr(p?.offsetMinutes, 0) }; };
function inbox(state, user) {
  return { user: publicUser(user), contacts: user.contacts.map((c) => contactCard(state.users, c)), effects: user.pendingEffects, state: { mode: user.mode, dayHour: intOr(user.dayHour, 19), dayMinute: intOr(user.dayMinute, 0), contactId: user.contactId, messages: user.messages, digest: user.digest } };
}
const keepAccount = (u) => ({ id: u.id, firstName: u.firstName || '', avatar: avatarOf(u), onboarded: u.onboarded ?? Boolean(u.firstName), contacts: u.contacts, pushToken: u.pushToken, offsetMinutes: u.offsetMinutes, provider: u.provider, subject: u.subject, identities: userIdentities(u), email: u.email || '', pendingEffects: u.pendingEffects });
function upsertContact(contacts, id, status) {
  const list = contacts || [], ix = list.findIndex((i) => i.id === id);
  if (ix < 0) return [...list, { id, status }];
  const cur = kind(list[ix]); if (cur === 'active' || cur === status) return list;
  const next = [...list]; next[ix] = { ...list[ix], id, status }; return next;
}
const rmContact = (contacts, id) => (contacts || []).filter((i) => i.id !== id);
const isBlocked = (u, other) => (u.blocked || []).includes(other);
const block = (u, other) => { if (!isBlocked(u, other)) u.blocked = [...(u.blocked || []), other]; };
function purgeThread(u, other) {
  u.contacts = rmContact(u.contacts, other);
  u.messages = (u.messages || []).filter((m) => m.contactId !== other);
  if (u.contactId === other) u.contactId = u.contacts[0]?.id ?? null;
}
function purgeUser(state, userId) {
  delete state.users[userId];
  for (const token of Object.keys(state.sessions)) if (state.sessions[token] === userId) delete state.sessions[token];
  for (const p of Object.values(state.users)) { purgeThread(p, userId); p.blocked = (p.blocked || []).filter((id) => id !== userId); }
  state.reports = (state.reports || []).filter((r) => r.reporterId !== userId && r.reportedId !== userId);
}
function blockPair(state, user, otherId) {
  const other = state.users[otherId]; if (!other || otherId === user.id) return false;
  purgeThread(user, otherId); purgeThread(other, user.id); block(user, otherId); block(other, user.id); return true;
}
function becomeFriends(state, a, b) { const L = state.users[a], R = state.users[b]; if (!L || !R) return; L.contacts = upsertContact(L.contacts, b, 'active'); R.contacts = upsertContact(R.contacts, a, 'active'); }
function sendFriendRequest(state, from, to) {
  if (isBlocked(from, to.id) || isBlocked(to, from.id)) fail('person_not_found');
  if (isActive(from.contacts, to.id) || isActive(to.contacts, from.id)) fail('already_friends');
  const inP = from.contacts.some((i) => i.id === to.id && kind(i) === 'pending-in'), outP = to.contacts.some((i) => i.id === from.id && kind(i) === 'pending-out');
  if (inP && outP) { becomeFriends(state, from.id, to.id); return; }
  if (from.contacts.some((i) => i.id === to.id)) return;
  from.contacts = upsertContact(from.contacts, to.id, 'pending-out'); to.contacts = upsertContact(to.contacts, from.id, 'pending-in');
}
const adopt = (u, next) => { const a = keepAccount(u); Object.assign(u, next, a); };
const userFrom = (state, token) => (state.sessions[token] ? state.users[state.sessions[token]] : null);
function userIdentities(user) {
  const listed = Array.isArray(user?.identities) ? user.identities : [];
  const primary = user?.provider && user?.subject ? [{ provider: user.provider, subject: user.subject }] : [];
  const seen = new Set();
  return [...primary, ...listed].filter((i) => { if (!i?.provider || !i?.subject) return false; const k = `${i.provider}:${i.subject}`; if (seen.has(k)) return false; seen.add(k); return true; });
}
function attachIdentity(user, provider, subject) {
  const ids = userIdentities(user);
  if (ids.some((i) => i.provider === provider && i.subject === subject)) { user.identities = ids; return; }
  const next = [...ids, { provider, subject }], primary = next.find((i) => i.provider === 'apple') || next[0] || null;
  user.identities = next; if (primary) { user.provider = primary.provider; user.subject = primary.subject; }
}
const findByIdentity = (state, provider, subject) => Object.values(state.users).find((u) => userIdentities(u).some((i) => i.provider === provider && i.subject === subject)) ?? null;
const findByEmail = (state, email) => (email ? Object.values(state.users).find((u) => u.email === email) ?? null : null);
const mapGuestId = (id, guest, host) => (id === guest ? host : id);
function requirePersonId(raw) { const id = normalizeCode(raw); if (!isCode(id)) fail('person_not_found'); return id; }
function requirePendingIn(state, user, id) { const other = state.users[id]; const pending = user.contacts.find((i) => i.id === id && kind(i) === 'pending-in'); if (!other || !pending) fail('person_not_found'); return other; }
function mergeUsers(state, host, guest) {
  if (!host || !guest || host.id === guest.id) return host;
  for (const i of userIdentities(guest)) attachIdentity(host, i.provider, i.subject);
  if (guest.email && !host.email) host.email = guest.email;
  if (guest.pushToken && !host.pushToken) host.pushToken = guest.pushToken;
  if (!host.firstName && guest.firstName) host.firstName = guest.firstName;
  host.onboarded = Boolean(host.onboarded || guest.onboarded || host.firstName);
  for (const c of guest.contacts || []) {
    if (c.id === host.id || c.id === guest.id) continue;
    host.contacts = upsertContact(host.contacts, c.id, c.status || 'active');
    const peer = state.users[c.id]; if (!peer) continue;
    peer.contacts = rmContact(peer.contacts, guest.id); peer.contacts = upsertContact(peer.contacts, host.id, c.status || 'active');
    peer.messages = (peer.messages || []).map((m) => (m.contactId === guest.id ? { ...m, contactId: host.id } : m));
    if (peer.contactId === guest.id) peer.contactId = host.id;
  }
  for (const m of guest.messages || []) if (m.contactId !== host.id && m.contactId !== guest.id) host.messages = [...(host.messages || []), m];
  host.contacts = rmContact(host.contacts, guest.id);
  if (host.contactId === guest.id) host.contactId = host.contacts[0]?.id ?? null;
  for (const token of Object.keys(state.sessions)) if (state.sessions[token] === guest.id) state.sessions[token] = host.id;
  state.reports = (state.reports || []).map((r) => ({ ...r, reporterId: mapGuestId(r.reporterId, guest.id, host.id), reportedId: mapGuestId(r.reportedId, guest.id, host.id) }));
  delete state.users[guest.id]; return host;
}
function absorbSelfDuplicate(state, user) {
  if (!userIdentities(user).some((i) => i.provider === 'google')) return user;
  const contacts = user.contacts || [];
  if (contacts.length !== 1 || kind(contacts[0]) !== 'active') return user;
  const other = state.users[contacts[0].id];
  if (!other || other.provider !== 'apple' || !user.firstName || user.firstName !== other.firstName) return user;
  if (!(other.contacts || []).some((i) => i.id === user.id && kind(i) === 'active')) return user;
  return mergeUsers(state, other, user);
}
export function createDeviceApi(storage, randomBytes = defaultBytes) {
  let chain = Promise.resolve();
  async function bytes(n) { const s = await randomBytes(n); return s instanceof Uint8Array ? s : Uint8Array.from(s); }
  async function hex(n) { const s = await bytes(n); return [...s].map((v) => v.toString(16).padStart(2, '0')).join(''); }
  function mintCode(users, provider, subject) {
    const code = accountCode(provider, subject, (c) => { const o = users[c]; return Boolean(o && (o.provider !== provider || o.subject !== subject)); });
    if (!code) fail('code_exhausted'); return code;
  }
  function linkIncomingContacts(state, user) {
    let changed = false;
    for (const m of user.messages || []) {
      if (m.direction !== 'in' || !m.contactId || m.contactId === user.id) continue;
      const pid = normalizeCode(m.contactId); if (!isCode(pid) || !state.users[pid]) continue;
      if (!isActive(user.contacts, pid)) { user.contacts = upsertContact(user.contacts, pid, 'active'); changed = true; }
      if (!user.contactId) { user.contactId = pid; changed = true; }
    }
    return changed;
  }
  const exclusive = (work) => { const run = chain.then(work, work); chain = run.then(() => {}, () => {}); return run; };
  const load = async (store) => { const raw = await store.getItem(STORE_KEY); if (!raw) return { users: {}, sessions: {} }; const p = JSON.parse(raw); return { users: p.users || {}, sessions: p.sessions || {} }; };
  const save = async (store, state) => store.setItem(STORE_KEY, JSON.stringify(state));
  const holdEffects = (p, effects) => { p.pendingEffects = p.pushToken ? effects.filter((e) => e.type !== 'present') : effects; };
  function releaseDueAlerts(state, now) {
    const queued = [];
    for (const p of Object.values(state.users)) {
      const released = releaseDue(p, now); if (!released.effects.length) continue;
      adopt(p, released.state); holdEffects(p, released.effects); queued.push({ recipient: p, effects: released.effects });
    }
    return queued;
  }
  async function commit(store, state, { force = true } = {}) {
    const due = releaseDueAlerts(state, Date.now());
    if (force || due.length) await save(store, state);
    if (typeof store.onDeliver === 'function') for (const item of due) store.onDeliver(item.recipient, item.effects);
    return due;
  }
  const commitInbox = async (store, state, user, opts) => { await commit(store, state, opts); return inbox(state, user); };
  const adoptCommitInbox = async (store, state, user, result) => { adopt(user, result.state); if (result.effects.length) user.pendingEffects = result.effects; return commitInbox(store, state, user); };
  const commitOk = async (store, state) => { await commit(store, state); return { ok: true }; };
  const api = (path, { token, method = 'GET', body } = {}) => exclusive(() => (typeof storage.transact === 'function' ? storage.transact((store) => handle(store, path, { token, method, body })) : handle(storage, path, { token, method, body })));
  async function handle(store, path, { token, method, body }) {
    const state = await load(store), url = new URL(path, 'http://device.local'), p = url.pathname;
    if (method === 'POST' && p === '/v1/session') {
      const provider = body?.provider === 'apple' || body?.provider === 'google' ? body.provider : null;
      const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
      const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
      if (!provider || subject.length < 4) fail('provider_subject_missing');
      let user = findByIdentity(state, provider, subject) || (email ? findByEmail(state, email) : null);
      if (user) { attachIdentity(user, provider, subject); if (email) user.email = email; if (body?.firstName && !user.firstName) user.firstName = firstName(body.firstName); }
      else user = { ...createState(), id: mintCode(state.users, provider, subject), provider, subject, identities: [{ provider, subject }], email, firstName: '', onboarded: false, pushToken: null, offsetMinutes: 0, contacts: [], pendingEffects: [] };
      user = absorbSelfDuplicate(state, user); state.users[user.id] = user;
      const sessionToken = await hex(24); state.sessions[sessionToken] = user.id;
      await commit(store, state); return { token: sessionToken, user: publicUser(user) };
    }
    let user = userFrom(state, token); if (!user) fail('sign_in_required');
    const host = absorbSelfDuplicate(state, user), mergedSelf = host.id !== user.id;
    user = host;
    const offset = method === 'GET' ? Number(url.searchParams.get('offset')) : body?.offsetMinutes, priorOffset = user.offsetMinutes;
    if (typeof offset === 'number' && Number.isFinite(offset)) user.offsetMinutes = offset;
    const clockDirty = user.offsetMinutes !== priorOffset || mergedSelf;
    if (method === 'GET' && p === '/v1/person') {
      const code = normalizeCode(url.searchParams.get('code')), found = isCode(code) ? state.users[code] : null;
      if (!found || found.id === user.id) return { found: false };
      return { found: true, name: found.firstName || found.id };
    }
    if (method === 'GET' && p === '/v1/inbox') return commitInbox(store, state, user, { force: linkIncomingContacts(state, user) || clockDirty });
    if (method === 'POST' && p === '/v1/profile') {
      const nickname = firstName(body?.nickname); if (!nickname) fail('nickname_missing');
      user.firstName = nickname; user.onboarded = true; await commit(store, state); return { user: publicUser(user) };
    }
    if (method === 'POST' && p === '/v1/contacts') {
      const code = normalizeCode(body?.code);
      if (hasConfusingCharacter(code) || (code && !isCode(code))) fail('code_invalid');
      const found = isCode(code) ? state.users[code] : null; if (!found || found.id === user.id) fail('person_not_found');
      sendFriendRequest(state, user, found); if (!user.contactId) user.contactId = found.id; return commitInbox(store, state, user);
    }
    if (method === 'POST' && p.startsWith('/v1/friend-request/')) {
      const accept = p.endsWith('/accept'), id = requirePersonId(body?.contactId), other = requirePendingIn(state, user, id);
      if (accept) { becomeFriends(state, user.id, other.id); user.contactId = other.id; if (!other.contactId) other.contactId = user.id; }
      else if (p.endsWith('/decline')) { user.contacts = rmContact(user.contacts, id); other.contacts = rmContact(other.contacts, user.id); if (user.contactId === id) user.contactId = user.contacts[0]?.id ?? null; }
      else fail('not_found');
      return commitInbox(store, state, user);
    }
    if (method === 'POST' && p === '/v1/open') {
      const id = normalizeCode(body?.contactId), match = isCode(id) ? user.contacts.find((i) => normalizeCode(i.id) === id) : null;
      if (match) {
        const canonical = normalizeCode(match.id), touch = normalizeCode(user.contactId) !== canonical || match.id !== canonical;
        if (normalizeCode(user.contactId) !== canonical) user.contactId = canonical;
        if (match.id !== canonical) match.id = canonical;
        if (touch) await commit(store, state);
      }
      return inbox(state, user);
    }
    if (method === 'POST' && p === '/v1/notify-all') {
      const id = requirePersonId(body?.contactId), match = user.contacts.find((i) => i.id === id);
      if (!match || kind(match) !== 'active') fail('person_not_found');
      match.notifyAll = body?.on === true; return commitInbox(store, state, user);
    }
    if (method === 'POST' && p === '/v1/messages') {
      const rid = normalizeCode(body?.contactId), recipient = isCode(rid) ? state.users[rid] : null;
      if (!recipient || !isActive(user.contacts, recipient.id) || isBlocked(user, recipient.id) || isBlocked(recipient, user.id)) fail('person_not_found');
      const clientId = typeof body?.clientId === 'string' && body.clientId.length > 0 && body.clientId.length <= 48 ? body.clientId : '';
      if (clientId && (user.messages || []).some((m) => m.id === clientId)) return inbox(state, user);
      const before = (user.messages || []).length;
      const result = deliverMessage(user, recipient, { id: clientId || (await hex(8)), body: body?.body, photo: body?.photo, sticker: body?.sticker, intent: body?.intent, releaseAt: body?.releaseAt, now: Date.now() });
      adopt(user, result.sender); adopt(recipient, result.recipient);
      if ((user.messages || []).length <= before) fail('message_invalid');
      linkIncomingContacts(state, recipient);
      if (result.recipientEffects.length) holdEffects(recipient, result.recipientEffects);
      await commit(store, state);
      if (typeof store.onDeliver === 'function') store.onDeliver(recipient, result.recipientEffects);
      return inbox(state, user);
    }
    if (method === 'POST' && p === '/v1/mode') return adoptCommitInbox(store, state, user, changeMode(user, body?.mode));
    if (method === 'POST' && p === '/v1/schedule') return adoptCommitInbox(store, state, user, changeSchedule(user, body?.dayHour, body?.dayMinute, Date.now()));
    if (method === 'POST' && (p === '/v1/push-token' || p === '/v1/effects/ack')) {
      if (p === '/v1/push-token') user.pushToken = expoPushToken(body?.token); else user.pendingEffects = [];
      return commitOk(store, state);
    }
    if (method === 'POST' && p === '/v1/shown') return adoptCommitInbox(store, state, user, reduce(user, { type: 'shown', now: Date.now() }));
    if (method === 'POST' && p === '/v1/account/delete') { purgeUser(state, user.id); return commitOk(store, state); }
    if (method === 'POST' && p === '/v1/block') { const id = requirePersonId(body?.contactId); if (!blockPair(state, user, id)) fail('person_not_found'); return commitInbox(store, state, user); }
    if (method === 'POST' && p === '/v1/report') {
      const id = requirePersonId(body?.contactId), other = state.users[id];
      if (!other || other.id === user.id) fail('person_not_found');
      const messageId = typeof body?.messageId === 'string' ? body.messageId.slice(0, 32) : null;
      if (messageId && !(user.messages || []).some((m) => m.id === messageId && m.contactId === id)) fail('person_not_found');
      state.reports = state.reports || []; state.reports.push({ id: await hex(8), reporterId: user.id, reportedId: id, messageId, at: Date.now() });
      return commitOk(store, state);
    }
    fail('not_found');
  }
  return api;
}
export function memoryStorage() {
  const values = new Map();
  return { async getItem(key) { return values.has(key) ? values.get(key) : null; }, async setItem(key, value) { values.set(key, value); } };
}