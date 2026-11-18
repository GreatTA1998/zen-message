import { normalizeCode } from './people.js';
import { notificationPolicy } from './notificationPolicy.js';
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_HOURS = Array.from({ length: 24 }, (_, h) => h);
export const INTENTS = ['anytime', 'scheduled', 'realtime'].map((id) => ({ id, label: id === 'anytime' ? 'zen' : id === 'realtime' ? 'urgent' : id }));
const INTENT_IDS = new Set([...INTENTS.map((i) => i.id), 'timely', 'urgent']);
const clampHour = (v, fb = 19) => (Number.isInteger(v) && v >= 0 && v <= 23 ? v : fb);
const clampMinute = (v) => (Number.isInteger(v) && v >= 0 && v <= 59 ? v : 0);
const toDate = (t) => (t instanceof Date ? t : new Date(t));
const partsInZone = (date, off) => (off == null ? { year: date.getFullYear(), month: date.getMonth(), day: date.getDate(), hour: date.getHours(), minute: date.getMinutes(), weekday: date.getDay() } : (() => { const l = new Date(date.getTime() - off * 60000); return { year: l.getUTCFullYear(), month: l.getUTCMonth(), day: l.getUTCDate(), hour: l.getUTCHours(), minute: l.getUTCMinutes(), weekday: l.getUTCDay() }; })());
const dayNumber = (p) => Math.floor(Date.UTC(p.year, p.month, p.day) / 86400000);
function nextClock(now, hour, minute, offsetMinutes) {
  const date = toDate(now);
  if (offsetMinutes == null) {
    const c = new Date(date); c.setHours(hour, minute, 0, 0);
    if (c.getTime() <= date.getTime()) c.setDate(c.getDate() + 1);
    return c;
  }
  const l = new Date(date.getTime() - offsetMinutes * 60000);
  let at = Date.UTC(l.getUTCFullYear(), l.getUTCMonth(), l.getUTCDate(), hour, minute, 0, 0) + offsetMinutes * 60000;
  if (at <= date.getTime()) at = Date.UTC(l.getUTCFullYear(), l.getUTCMonth(), l.getUTCDate() + 1, hour, minute, 0, 0) + offsetMinutes * 60000;
  return new Date(at);
}
export function createState() { return { mode: 'batched', dayHour: 19, dayMinute: 0, contactId: null, messages: [], digest: null }; }
export function dailyClock(state) { return { hour: clampHour(state?.dayHour, 19), minute: clampMinute(state?.dayMinute) }; }
export function nextDaily(now, hour = 19, minute = 0, offsetMinutes) { return nextClock(now, clampHour(hour, 19), clampMinute(minute), offsetMinutes); }
export function scheduledColumns(now, offsetMinutes) {
  const date = toDate(now);
  const slot = (d, h) => {
    if (offsetMinutes == null) { const at = new Date(date); at.setHours(0, 0, 0, 0); at.setDate(at.getDate() + d); at.setHours(h, 0, 0, 0); return at; }
    const l = new Date(date.getTime() - offsetMinutes * 60000);
    return new Date(Date.UTC(l.getUTCFullYear(), l.getUTCMonth(), l.getUTCDate() + d, h, 0, 0, 0) + offsetMinutes * 60000);
  };
  const keep = (d, hs) => hs.map((h) => slot(d, h)).filter((at) => at.getTime() > date.getTime());
  return { today: keep(0, DAY_HOURS), tomorrow: keep(1, DAY_HOURS.slice(8)) };
}
export const scheduledChoices = (now, offsetMinutes) => { const { today, tomorrow } = scheduledColumns(now, offsetMinutes); return today.concat(tomorrow); };
export function dayPhrase(hour, minute = 0, pad) {
  const suffix = hour >= 12 ? 'pm' : 'am'; const shown = hour % 12 || 12;
  return !minute && !pad ? `${shown} ${suffix}` : `${shown}:${String(minute).padStart(2, '0')} ${suffix}`;
}
export function receiptPhrase(at, now = new Date(), offsetMinutes) {
  const a = partsInZone(toDate(at), offsetMinutes), n = partsInZone(toDate(now), offsetMinutes);
  const dayDiff = dayNumber(a) - dayNumber(n);
  const when = dayDiff <= 0 ? 'today' : dayDiff === 1 ? 'tomorrow' : WEEKDAYS[a.weekday];
  return `Received at ${dayPhrase(a.hour, a.minute, true)} ${when}`;
}
export function choiceLabel(at, now) { const day = receiptPhrase(at, now).split(' ').pop(); const clock = dayPhrase(at.getHours(), at.getMinutes()).replace(' ', ''); return day === 'today' ? clock : `${clock} ${day}`; }
export function composerPlaceholder(name, intent, at) {
  const who = String(name || '').trim(); if (!who) return 'Message';
  if (intent === 'realtime' || intent === 'urgent') return `Message ${who}`;
  if (intent !== 'scheduled' || !at) return `Message ${who} without a notification`;
  return `Message ${who} at ${dayPhrase(at.getHours(), at.getMinutes())}`;
}
export function threadMessages(messages, contactId) { const id = normalizeCode(contactId); return id ? (messages || []).filter((i) => normalizeCode(i.contactId) === id) : []; }
function latestInboundAt(messages, contactId) {
  let latest = 0;
  for (const item of threadMessages(messages, contactId)) if (item?.direction === 'in' && (Number(item.createdAt) || 0) > latest) latest = Number(item.createdAt);
  return latest;
}
export function contactUnread(messages, contactId, openedAt) { const latest = latestInboundAt(messages, contactId); return latest > 0 && latest > (Number(openedAt) || 0); }
export function syncOpenedAt(openedAt, contacts, messages, selectedId) {
  let next = null;
  const touch = (id, at) => { if (!id || (id in (next || openedAt) && (Number((next || openedAt)[id]) || 0) >= at)) return; (next ??= { ...openedAt })[id] = at; };
  for (const item of contacts || []) { const id = normalizeCode(item?.id); if (id && !(id in (next || openedAt))) touch(id, latestInboundAt(messages, id)); }
  if (selectedId) touch(selectedId, latestInboundAt(messages, selectedId) || Date.now());
  return next || openedAt;
}
const PHOTO_SUBTYPES = new Set(['jpeg', 'png', 'webp']);
export function photoFromPickerAsset(asset) {
  if (!asset || asset.type === 'video' || String(asset.mimeType || '').startsWith('video/')) return null;
  const rawBase64 = typeof asset.base64 === 'string' ? asset.base64.replace(/\s+/g, '') : '';
  if (!rawBase64) return null;
  let subtype = String(asset.mimeType || 'image/jpeg').slice(6).split(';')[0].trim().toLowerCase() || 'jpeg';
  if (subtype === 'heic' || subtype === 'heif' || subtype === 'jpg' || !PHOTO_SUBTYPES.has(subtype)) subtype = 'jpeg';
  return messagePhoto(`data:image/${subtype};base64,${rawBase64}`);
}
export function messagePhoto(value) {
  if (typeof value !== 'string') return null;
  const match = /^data:image\/(jpeg|jpg|png|webp|heic|heif);base64,([a-z0-9+/=\s]+)$/i.exec(value.trim());
  if (!match) return null;
  const payload = match[2].replace(/\s+/g, '');
  if (!payload || payload.length > 900000) return null;
  const raw = match[1].toLowerCase();
  return `data:image/${raw === 'jpg' || raw === 'heic' || raw === 'heif' ? 'jpeg' : raw};base64,${payload}`;
}
const trimBody = (v) => (typeof v === 'string' ? v.trim() : '');
export const messageSticker = (v) => messagePhoto(v);
const noticeText = (body, photo, sticker) => body || (sticker ? 'Drawing' : photo ? 'Photo' : '');
function readContent(action) {
  const body = trimBody(action.body), photo = action.sticker ? null : messagePhoto(action.photo), sticker = messageSticker(action.sticker);
  if ((!body && !photo && !sticker) || !INTENT_IDS.has(action.intent)) return null;
  return { body, photo, sticker };
}
const immediatePlan = (message, loud = false) => {
  const quiet = !loud && message.intent === 'timely';
  return { title: message.contactName, body: noticeText(message.body, message.photo, message.sticker), quiet, data: { kind: quiet ? 'timely' : 'realtime', quiet, messageIds: [message.id] } };
};
export function digestPlan(messages) {
  const ordered = [...messages].sort((a, b) => a.createdAt - b.createdAt);
  const names = [];
  for (const m of ordered) if (!names.includes(m.contactName)) names.push(m.contactName);
  const body = ordered.length === 1 ? `${ordered[0].contactName}: ${noticeText(ordered[0].body, ordered[0].photo, ordered[0].sticker)}` : `${ordered.length} messages · ${names.length <= 3 ? names.join(', ') : `${names.slice(0, 2).join(', ')} +${names.length - 2}`}`;
  return { title: 'Zen Message', body, quiet: false, data: { kind: 'digest', quiet: false, messageIds: ordered.map((m) => m.id) } };
}
const heldMessages = (messages) => messages.filter((i) => (i.intent === 'anytime' || i.intent === 'scheduled' || i.intent === 'timely') && !i.visible);
const revealIds = (messages, ids) => messages.map((i) => (ids.has(i.id) ? { ...i, visible: true, releaseAt: null } : i));
export function reduce(state, action) {
  const now = action.now ?? Date.now();
  switch (action.type) {
    case 'set-mode': return setMode(state, action.mode);
    case 'set-schedule': return setSchedule(state, action.dayHour, action.dayMinute, now, action.offsetMinutes);
    case 'send': return send(state, action, now);
    case 'outgoing': return outgoing(state, action, now);
    case 'release': return release(state, now);
    case 'shown': return shown(state);
    default: return { state, effects: [] };
  }
}
function setMode(state, mode) {
  if (mode !== 'relaxed' && mode !== 'batched' || mode === state.mode) return { state, effects: [] };
  if (mode === 'batched') return { state: { ...state, mode }, effects: [] };
  const ids = new Set(heldMessages(state.messages).map((i) => i.id));
  return { state: { ...state, mode: 'relaxed', messages: revealIds(state.messages, ids), digest: null }, effects: state.digest ? [{ type: 'cancel-digest' }] : [] };
}
function setSchedule(state, hour, minute, now, offsetMinutes) {
  const dayHour = clampHour(hour, 19), dayMinute = clampMinute(minute), clock = dailyClock(state);
  if (dayHour === clock.hour && dayMinute === clock.minute) return { state, effects: [] };
  const at = nextDaily(new Date(now), dayHour, dayMinute, offsetMinutes).getTime();
  return holdDigest({ ...state, dayHour, dayMinute, messages: state.messages.map((i) => (i.intent === 'anytime' && !i.visible ? { ...i, releaseAt: at } : i)) });
}
const buildMsg = (action, now, content, patch) => ({ id: action.id, contactId: action.contactId, contactName: action.contactName, body: content.body, photo: content.photo, sticker: content.sticker, intent: action.intent === 'urgent' ? 'realtime' : action.intent, createdAt: now, releaseAt: null, ...patch });
function outgoing(state, action, now) {
  const content = readContent(action); if (!content) return { state, effects: [] };
  return { state: { ...state, messages: [...state.messages, buildMsg(action, now, content, { visible: true, direction: 'out' })] }, effects: [] };
}
function send(state, action, now) {
  const content = readContent(action); if (!content) return { state, effects: [] };
  const message = buildMsg(action, now, content, { visible: false, direction: 'in' });
  const policy = notificationPolicy({ intent: message.intent, mode: state.mode, notifyAll: action.notifyAll });
  if (policy.path !== 'digest') {
    const visible = { ...message, visible: true };
    return { state: { ...state, messages: [...state.messages, visible] }, effects: policy.push ? [{ type: 'present', plan: immediatePlan(visible, policy.loud) }] : [] };
  }
  const clock = dailyClock(state);
  const at = message.intent === 'anytime' ? nextDaily(new Date(now), clock.hour, clock.minute, action.offsetMinutes).getTime() : chosenRelease(action.releaseAt, now, action.offsetMinutes);
  return holdDigest({ ...state, messages: [...state.messages, { ...message, releaseAt: at }] });
}
const chosenRelease = (releaseAt, now, offsetMinutes) => (typeof releaseAt === 'number' && Number.isFinite(releaseAt) && releaseAt > now ? releaseAt : scheduledChoices(new Date(now), offsetMinutes)[0].getTime());
function holdDigest(state) {
  const held = heldMessages(state.messages).filter((i) => typeof i.releaseAt === 'number');
  if (!held.length) return { state: { ...state, digest: null }, effects: state.digest ? [{ type: 'cancel-digest' }] : [] };
  const at = Math.min(...held.map((i) => i.releaseAt)), due = held.filter((i) => i.releaseAt === at), plan = digestPlan(due);
  return { state: { ...state, digest: { at, messageIds: plan.data.messageIds, presented: false } }, effects: [{ type: 'schedule-digest', at, plan }] };
}
function release(state, now) { return !state.digest || state.digest.presented || now < state.digest.at ? { state, effects: [] } : finishDigest(state); }
function shown(state) { return !state.digest || state.digest.presented ? { state, effects: [] } : finishDigest(state, []); }
function finishDigest(state, effects) {
  const ids = new Set(state.digest.messageIds), held = state.messages.filter((i) => ids.has(i.id)), plan = held.length ? digestPlan(held) : null;
  const rolled = holdDigest({ ...state, messages: revealIds(state.messages, ids), digest: null });
  const digest = rolled.state.digest ?? { ...state.digest, presented: true, messageIds: [...ids] };
  return { state: { ...rolled.state, digest }, effects: effects ?? (plan ? [{ type: 'present', plan }] : [{ type: 'cancel-digest' }]) };
}
const isMessage = (v) => {
  const photo = v?.photo == null || v.photo === '' ? null : messagePhoto(v.photo), sticker = v?.sticker == null || v.sticker === '' ? null : messageSticker(v.sticker);
  return v && typeof v.id === 'string' && typeof v.contactId === 'string' && typeof v.contactName === 'string' && typeof v.body === 'string' && (v.photo == null || v.photo === '' || Boolean(photo)) && (v.sticker == null || v.sticker === '' || Boolean(sticker)) && (v.body.trim() || photo || sticker) && INTENT_IDS.has(v.intent) && typeof v.createdAt === 'number' && typeof v.visible === 'boolean';
};
const isDigest = (v) => v && typeof v.at === 'number' && Array.isArray(v.messageIds) && v.messageIds.every((id) => typeof id === 'string') && typeof v.presented === 'boolean';
export function sanitize(raw) {
  const base = createState();
  if (!raw || typeof raw !== 'object') return base;
  return { mode: raw.mode === 'relaxed' ? 'relaxed' : 'batched', dayHour: clampHour(raw.dayHour, 19), dayMinute: clampMinute(raw.dayMinute), contactId: typeof raw.contactId === 'string' ? raw.contactId : base.contactId, messages: Array.isArray(raw.messages) ? raw.messages.filter(isMessage) : [], digest: isDigest(raw.digest) ? { at: raw.digest.at, messageIds: raw.digest.messageIds, presented: raw.digest.presented } : null };
}