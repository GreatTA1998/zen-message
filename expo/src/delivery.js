import { normalizeCode } from './people.js';
import { notificationPolicy } from './notificationPolicy.js';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_HOURS = Array.from({ length: 24 }, (_item, hour) => hour);

export const INTENTS = ['anytime', 'scheduled', 'realtime'].map((id) => ({ id, label: id === 'anytime' ? 'zen' : id === 'realtime' ? 'urgent' : id }));
const INTENT_IDS = new Set([...INTENTS.map((item) => item.id), 'timely', 'urgent']);

export function createState() {
  return { mode: 'batched', dayHour: 19, dayMinute: 0, contactId: null, messages: [], digest: null };
}

export function dailyClock(state) {
  return { hour: clampHour(state?.dayHour, 19), minute: clampMinute(state?.dayMinute) };
}

export function nextDaily(now, hour = 19, minute = 0, offsetMinutes) {
  return nextClock(now, clampHour(hour, 19), clampMinute(minute), offsetMinutes);
}

export function scheduledColumns(now, offsetMinutes) {
  const date = now instanceof Date ? now : new Date(now);
  const slot = (dayOffset, hour) => {
    if (offsetMinutes == null) {
      const at = new Date(date);
      at.setHours(0, 0, 0, 0);
      at.setDate(at.getDate() + dayOffset);
      at.setHours(hour, 0, 0, 0);
      return at;
    }
    const local = new Date(date.getTime() - offsetMinutes * 60000);
    return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + dayOffset, hour, 0, 0, 0) + offsetMinutes * 60000);
  };
  const keep = (dayOffset, hours) => hours.map((h) => slot(dayOffset, h)).filter((at) => at.getTime() > date.getTime());
  return { today: keep(0, DAY_HOURS), tomorrow: keep(1, DAY_HOURS.slice(8)) };
}

export function scheduledChoices(now, offsetMinutes) {
  const { today, tomorrow } = scheduledColumns(now, offsetMinutes);
  return today.concat(tomorrow);
}

export function dayPhrase(hour, minute = 0, pad) {
  const suffix = hour >= 12 ? 'pm' : 'am';
  const shown = hour % 12 || 12;
  if (!minute && !pad) return `${shown} ${suffix}`;
  return `${shown}:${String(minute).padStart(2, '0')} ${suffix}`;
}

export function receiptPhrase(at, now = new Date(), offsetMinutes) {
  const atParts = partsInZone(at instanceof Date ? at : new Date(at), offsetMinutes);
  const nowParts = partsInZone(now instanceof Date ? now : new Date(now), offsetMinutes);
  const dayDiff = dayNumber(atParts) - dayNumber(nowParts);
  const when = dayDiff <= 0 ? 'today' : dayDiff === 1 ? 'tomorrow' : WEEKDAYS[atParts.weekday];
  return `Received at ${dayPhrase(atParts.hour, atParts.minute, true)} ${when}`;
}

export function choiceLabel(at, now) {
  const day = receiptPhrase(at, now).split(' ').pop();
  const clock = dayPhrase(at.getHours(), at.getMinutes()).replace(' ', '');
  return day === 'today' ? clock : `${clock} ${day}`;
}

export function composerPlaceholder(name, intent, at) {
  const who = String(name || '').trim();
  if (!who) return 'Message';
  if (intent === 'realtime' || intent === 'urgent') return `Message ${who}`;
  if (intent !== 'scheduled' || !at) return `Message ${who} without a notification`;
  return `Message ${who} at ${dayPhrase(at.getHours(), at.getMinutes())}`;
}

function nextClock(now, hour, minute, offsetMinutes) {
  const date = now instanceof Date ? now : new Date(now);
  if (offsetMinutes == null) {
    const candidate = new Date(date);
    candidate.setHours(hour, minute, 0, 0);
    if (candidate.getTime() <= date.getTime()) candidate.setDate(candidate.getDate() + 1);
    return candidate;
  }
  const local = new Date(date.getTime() - offsetMinutes * 60000);
  let at = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), hour, minute, 0, 0) + offsetMinutes * 60000;
  if (at <= date.getTime()) {
    at = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + 1, hour, minute, 0, 0) + offsetMinutes * 60000;
  }
  return new Date(at);
}

function clampHour(value, fallback = 19) {
  return Number.isInteger(value) && value >= 0 && value <= 23 ? value : fallback;
}

function clampMinute(value) {
  return Number.isInteger(value) && value >= 0 && value <= 59 ? value : 0;
}

function partsInZone(date, offsetMinutes) {
  if (offsetMinutes == null) {
    return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate(), hour: date.getHours(), minute: date.getMinutes(), weekday: date.getDay() };
  }
  const local = new Date(date.getTime() - offsetMinutes * 60000);
  return { year: local.getUTCFullYear(), month: local.getUTCMonth(), day: local.getUTCDate(), hour: local.getUTCHours(), minute: local.getUTCMinutes(), weekday: local.getUTCDay() };
}

function dayNumber(parts) {
  return Math.floor(Date.UTC(parts.year, parts.month, parts.day) / 86400000);
}

export function threadMessages(messages, contactId) {
  const id = normalizeCode(contactId);
  if (!id) return [];
  return (messages || []).filter((item) => normalizeCode(item.contactId) === id);
}

function latestInboundAt(messages, contactId) {
  let latest = 0;
  for (const item of threadMessages(messages, contactId)) {
    if (item?.direction !== 'in') continue;
    const at = Number(item.createdAt) || 0;
    if (at > latest) latest = at;
  }
  return latest;
}

export function contactUnread(messages, contactId, openedAt) {
  const latest = latestInboundAt(messages, contactId);
  return latest > 0 && latest > (Number(openedAt) || 0);
}

export function syncOpenedAt(openedAt, contacts, messages, selectedId) {
  let next = null;
  const touch = (id, at) => {
    if (!id || (id in (next || openedAt) && (Number((next || openedAt)[id]) || 0) >= at)) return;
    (next ??= { ...openedAt })[id] = at;
  };
  for (const item of contacts || []) {
    const id = normalizeCode(item?.id);
    if (id && !(id in (next || openedAt))) touch(id, latestInboundAt(messages, id));
  }
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

function messageBody(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function messageSticker(value) {
  return messagePhoto(value);
}

function noticeText(body, photo, sticker) {
  return body || (sticker ? 'Drawing' : photo ? 'Photo' : '');
}

function readContent(action) {
  const body = messageBody(action.body);
  const photo = action.sticker ? null : messagePhoto(action.photo);
  const sticker = messageSticker(action.sticker);
  if ((!body && !photo && !sticker) || !INTENT_IDS.has(action.intent)) return null;
  return { body, photo, sticker };
}

function immediatePlan(message, loud = false) {
  const quiet = !loud && message.intent === 'timely';
  return {
    title: message.contactName,
    body: noticeText(message.body, message.photo, message.sticker),
    quiet,
    data: { kind: quiet ? 'timely' : 'realtime', quiet, messageIds: [message.id] },
  };
}

export function digestPlan(messages) {
  const ordered = [...messages].sort((a, b) => a.createdAt - b.createdAt);
  const names = [];
  for (const message of ordered) {
    if (!names.includes(message.contactName)) names.push(message.contactName);
  }
  const body =
    ordered.length === 1
      ? `${ordered[0].contactName}: ${noticeText(ordered[0].body, ordered[0].photo, ordered[0].sticker)}`
      : `${ordered.length} messages · ${names.length <= 3 ? names.join(', ') : `${names.slice(0, 2).join(', ')} +${names.length - 2}`}`;
  return { title: 'Zen Message', body, quiet: false, data: { kind: 'digest', quiet: false, messageIds: ordered.map((message) => message.id) } };
}

function heldMessages(messages) {
  return messages.filter((item) => (item.intent === 'anytime' || item.intent === 'scheduled' || item.intent === 'timely') && !item.visible);
}

function revealIds(messages, ids) {
  return messages.map((item) => (ids.has(item.id) ? { ...item, visible: true, releaseAt: null } : item));
}

export function reduce(state, action) {
  const now = action.now ?? Date.now();
  switch (action.type) {
    case 'set-mode':
      return setMode(state, action.mode);
    case 'set-schedule':
      return setSchedule(state, action.dayHour, action.dayMinute, now, action.offsetMinutes);
    case 'send':
      return send(state, action, now);
    case 'outgoing':
      return outgoing(state, action, now);
    case 'release':
      return release(state, now);
    case 'shown':
      return shown(state);
    default:
      return { state, effects: [] };
  }
}

function setMode(state, mode) {
  if (mode !== 'relaxed' && mode !== 'batched') return { state, effects: [] };
  if (mode === state.mode) return { state, effects: [] };
  if (mode === 'batched') return { state: { ...state, mode }, effects: [] };
  const ids = new Set(heldMessages(state.messages).map((item) => item.id));
  return {
    state: { ...state, mode: 'relaxed', messages: revealIds(state.messages, ids), digest: null },
    effects: state.digest ? [{ type: 'cancel-digest' }] : [],
  };
}

function setSchedule(state, hour, minute, now, offsetMinutes) {
  const dayHour = clampHour(hour, 19);
  const dayMinute = clampMinute(minute);
  const clock = dailyClock(state);
  if (dayHour === clock.hour && dayMinute === clock.minute) return { state, effects: [] };
  const at = nextDaily(new Date(now), dayHour, dayMinute, offsetMinutes).getTime();
  const messages = state.messages.map((item) => (item.intent === 'anytime' && !item.visible ? { ...item, releaseAt: at } : item));
  return holdDigest({ ...state, dayHour, dayMinute, messages });
}

function buildInboundMessage(action, now, content, patch) {
  return {
    id: action.id,
    contactId: action.contactId,
    contactName: action.contactName,
    body: content.body,
    photo: content.photo,
    sticker: content.sticker,
    intent: action.intent === 'urgent' ? 'realtime' : action.intent,
    createdAt: now,
    releaseAt: null,
    ...patch,
  };
}

function outgoing(state, action, now) {
  const content = readContent(action);
  if (!content) return { state, effects: [] };
  const message = buildInboundMessage(action, now, content, { visible: true, direction: 'out' });
  return { state: { ...state, messages: [...state.messages, message] }, effects: [] };
}

function send(state, action, now) {
  const content = readContent(action);
  if (!content) return { state, effects: [] };
  const message = buildInboundMessage(action, now, content, { visible: false, direction: 'in' });
  const policy = notificationPolicy({ intent: message.intent, mode: state.mode, notifyAll: action.notifyAll });
  if (policy.path !== 'digest') {
    const visible = { ...message, visible: true };
    return {
      state: { ...state, messages: [...state.messages, visible] },
      effects: policy.push ? [{ type: 'present', plan: immediatePlan(visible, policy.loud) }] : [],
    };
  }
  const clock = dailyClock(state);
  const at =
    message.intent === 'anytime'
      ? nextDaily(new Date(now), clock.hour, clock.minute, action.offsetMinutes).getTime()
      : chosenRelease(action.releaseAt, now, action.offsetMinutes);
  return holdDigest({ ...state, messages: [...state.messages, { ...message, releaseAt: at }] });
}

function chosenRelease(releaseAt, now, offsetMinutes) {
  if (typeof releaseAt === 'number' && Number.isFinite(releaseAt) && releaseAt > now) return releaseAt;
  return scheduledChoices(new Date(now), offsetMinutes)[0].getTime();
}

function holdDigest(state) {
  const held = heldMessages(state.messages).filter((item) => typeof item.releaseAt === 'number');
  if (!held.length) return { state: { ...state, digest: null }, effects: state.digest ? [{ type: 'cancel-digest' }] : [] };
  const at = Math.min(...held.map((item) => item.releaseAt));
  const due = held.filter((item) => item.releaseAt === at);
  const plan = digestPlan(due);
  return { state: { ...state, digest: { at, messageIds: plan.data.messageIds, presented: false } }, effects: [{ type: 'schedule-digest', at, plan }] };
}

function release(state, now) {
  if (!state.digest || state.digest.presented || now < state.digest.at) return { state, effects: [] };
  return finishDigest(state);
}

function shown(state) {
  if (!state.digest || state.digest.presented) return { state, effects: [] };
  return finishDigest(state, []);
}

function finishDigest(state, effects) {
  const ids = new Set(state.digest.messageIds);
  const held = state.messages.filter((item) => ids.has(item.id));
  const plan = held.length ? digestPlan(held) : null;
  const messages = revealIds(state.messages, ids);
  const rolled = holdDigest({ ...state, messages, digest: null });
  const digest = rolled.state.digest ?? { ...state.digest, presented: true, messageIds: [...ids] };
  return { state: { ...rolled.state, digest }, effects: effects ?? (plan ? [{ type: 'present', plan }] : [{ type: 'cancel-digest' }]) };
}

function isMessage(value) {
  const photo = value?.photo == null || value.photo === '' ? null : messagePhoto(value.photo);
  const sticker = value?.sticker == null || value.sticker === '' ? null : messageSticker(value.sticker);
  return (
    value &&
    typeof value.id === 'string' &&
    typeof value.contactId === 'string' &&
    typeof value.contactName === 'string' &&
    typeof value.body === 'string' &&
    (value.photo == null || value.photo === '' || Boolean(photo)) &&
    (value.sticker == null || value.sticker === '' || Boolean(sticker)) &&
    (value.body.trim() || photo || sticker) &&
    INTENT_IDS.has(value.intent) &&
    typeof value.createdAt === 'number' &&
    typeof value.visible === 'boolean'
  );
}

function isDigest(value) {
  return value && typeof value.at === 'number' && Array.isArray(value.messageIds) && value.messageIds.every((id) => typeof id === 'string') && typeof value.presented === 'boolean';
}

export function sanitize(raw) {
  const base = createState();
  if (!raw || typeof raw !== 'object') return base;
  return {
    mode: raw.mode === 'relaxed' ? 'relaxed' : 'batched',
    dayHour: clampHour(raw.dayHour, 19),
    dayMinute: clampMinute(raw.dayMinute),
    contactId: typeof raw.contactId === 'string' ? raw.contactId : base.contactId,
    messages: Array.isArray(raw.messages) ? raw.messages.filter(isMessage) : [],
    digest: isDigest(raw.digest) ? { at: raw.digest.at, messageIds: raw.digest.messageIds, presented: raw.digest.presented } : null,
  };
}