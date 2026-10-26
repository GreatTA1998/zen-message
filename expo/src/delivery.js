export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const CHECKPOINT_HOURS = [12, 19];
export const DAY_HOURS = Array.from({ length: 24 }, (_item, hour) => hour);

export const INTENTS = [
  { id: 'anytime', label: 'anytime' },
  { id: 'scheduled', label: 'scheduled' },
  { id: 'realtime', label: 'realtime' },
];

const INTENT_IDS = new Set([...INTENTS.map((item) => item.id), 'timely']);

export function createState() {
  return {
    mode: 'batched',
    dayHour: 19,
    dayMinute: 0,
    contactId: null,
    messages: [],
    digest: null,
  };
}

export function dailyClock(state) {
  return {
    hour: clampHour(state?.dayHour, 19),
    minute: clampMinute(state?.dayMinute),
  };
}

export function nextDaily(now, hour = 19, minute = 0, offsetMinutes) {
  return nextClock(now, clampHour(hour, 19), clampMinute(minute), offsetMinutes);
}

export function scheduledChoices(now, offsetMinutes) {
  return CHECKPOINT_HOURS.map((hour) => nextClock(now, hour, 0, offsetMinutes)).sort(
    (left, right) => left.getTime() - right.getTime()
  );
}

export function dayPhrase(hour, minute = 0) {
  const suffix = hour >= 12 ? 'pm' : 'am';
  const shown = hour % 12 || 12;
  if (!minute) return `${shown} ${suffix}`;
  return `${shown}:${String(minute).padStart(2, '0')} ${suffix}`;
}

export function receiptPhrase(at, now = new Date(), offsetMinutes) {
  const atDate = at instanceof Date ? at : new Date(at);
  const nowDate = now instanceof Date ? now : new Date(now);
  const atParts = partsInZone(atDate, offsetMinutes);
  const nowParts = partsInZone(nowDate, offsetMinutes);
  const dayDiff = dayNumber(atParts) - dayNumber(nowParts);
  const when = dayDiff <= 0 ? 'today' : dayDiff === 1 ? 'tomorrow' : WEEKDAYS[atParts.weekday];
  return `Received at ${clockWords(atParts.hour, atParts.minute)} ${when}`;
}

function clockWords(hour, minute) {
  const suffix = hour >= 12 ? 'pm' : 'am';
  const shown = hour % 12 || 12;
  return `${shown}:${String(minute).padStart(2, '0')} ${suffix}`;
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
  let at =
    Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), hour, minute, 0, 0) +
    offsetMinutes * 60000;
  if (at <= date.getTime()) {
    at =
      Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + 1, hour, minute, 0, 0) +
      offsetMinutes * 60000;
  }
  return new Date(at);
}

function clampDay(value) {
  return Number.isInteger(value) && value >= 0 && value <= 6 ? value : 0;
}

function clampHour(value, fallback = 19) {
  return Number.isInteger(value) && value >= 0 && value <= 23 ? value : fallback;
}

function clampMinute(value) {
  return Number.isInteger(value) && value >= 0 && value <= 59 ? value : 0;
}

function partsInZone(date, offsetMinutes) {
  if (offsetMinutes == null) {
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      weekday: date.getDay(),
    };
  }
  const local = new Date(date.getTime() - offsetMinutes * 60000);
  return {
    year: local.getUTCFullYear(),
    month: local.getUTCMonth(),
    day: local.getUTCDate(),
    hour: local.getUTCHours(),
    minute: local.getUTCMinutes(),
    weekday: local.getUTCDay(),
  };
}

function dayNumber(parts) {
  return Math.floor(Date.UTC(parts.year, parts.month, parts.day) / 86400000);
}

export function threadMessages(messages, contactId) {
  return messages.filter((item) => item.contactId === contactId && item.visible);
}

export function messagePhoto(value) {
  if (typeof value !== 'string') return null;
  const match = /^data:image\/(jpeg|jpg|png|webp);base64,([a-z0-9+/=\s]+)$/i.exec(value.trim());
  if (!match) return null;
  const payload = match[2].replace(/\s+/g, '');
  if (!payload || payload.length > 900000) return null;
  const type = match[1].toLowerCase() === 'jpg' ? 'jpeg' : match[1].toLowerCase();
  return `data:image/${type};base64,${payload}`;
}

function messageBody(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function noticeText(body, photo) {
  return body || (photo ? 'Photo' : '');
}

function readContent(action) {
  const body = messageBody(action.body);
  const photo = messagePhoto(action.photo);
  if ((!body && !photo) || !INTENT_IDS.has(action.intent)) return null;
  return { body, photo };
}

export function immediatePlan(message) {
  const quiet = message.intent === 'timely';
  return {
    title: message.contactName,
    body: noticeText(message.body, message.photo),
    quiet,
    data: {
      kind: quiet ? 'timely' : 'realtime',
      quiet,
      messageIds: [message.id],
    },
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
      ? `${ordered[0].contactName}: ${noticeText(ordered[0].body, ordered[0].photo)}`
      : `${ordered.length} messages · ${
          names.length <= 3 ? names.join(', ') : `${names.slice(0, 2).join(', ')} +${names.length - 2}`
        }`;
  return {
    title: 'Zen Message',
    body,
    quiet: false,
    data: {
      kind: 'digest',
      quiet: false,
      messageIds: ordered.map((message) => message.id),
    },
  };
}

function heldMessages(messages) {
  return messages.filter((item) => (item.intent === 'anytime' || item.intent === 'scheduled' || item.intent === 'timely') && !item.visible);
}

function revealIds(messages, ids) {
  return messages.map((item) =>
    ids.has(item.id) ? { ...item, visible: true, releaseAt: null } : item
  );
}

export function reduce(state, action) {
  const now = action.now ?? Date.now();
  switch (action.type) {
    case 'select-contact':
      return { state: { ...state, contactId: action.contactId }, effects: [] };
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
    state: {
      ...state,
      mode: 'relaxed',
      messages: revealIds(state.messages, ids),
      digest: null,
    },
    effects: state.digest ? [{ type: 'cancel-digest' }] : [],
  };
}

function setSchedule(state, hour, minute, now, offsetMinutes) {
  const dayHour = clampHour(hour, 19);
  const dayMinute = clampMinute(minute);
  const clock = dailyClock(state);
  if (dayHour === clock.hour && dayMinute === clock.minute && state.dayHour === dayHour) {
    return { state, effects: [] };
  }
  const at = nextDaily(new Date(now), dayHour, dayMinute, offsetMinutes).getTime();
  const messages = state.messages.map((item) =>
    item.intent === 'anytime' && !item.visible ? { ...item, releaseAt: at } : item
  );
  return holdDigest({ ...state, dayHour, dayMinute, messages });
}

function outgoing(state, action, now) {
  const content = readContent(action);
  if (!content) return { state, effects: [] };
  const message = {
    id: action.id,
    contactId: action.contactId,
    contactName: action.contactName,
    body: content.body,
    photo: content.photo,
    intent: action.intent,
    createdAt: now,
    visible: true,
    releaseAt: null,
    direction: 'out',
  };
  return { state: { ...state, messages: [...state.messages, message] }, effects: [] };
}

function send(state, action, now) {
  const content = readContent(action);
  if (!content) return { state, effects: [] };
  const message = {
    id: action.id,
    contactId: action.contactId,
    contactName: action.contactName,
    body: content.body,
    photo: content.photo,
    intent: action.intent,
    createdAt: now,
    visible: false,
    releaseAt: null,
    direction: 'in',
  };

  if (message.intent === 'realtime') {
    const visible = { ...message, visible: true };
    return {
      state: { ...state, messages: [...state.messages, visible] },
      effects: [{ type: 'present', plan: immediatePlan(visible) }],
    };
  }

  if (state.mode === 'relaxed') {
    return {
      state: { ...state, messages: [...state.messages, { ...message, visible: true }] },
      effects: [],
    };
  }

  const clock = dailyClock(state);
  const at =
    message.intent === 'anytime'
      ? nextDaily(new Date(now), clock.hour, clock.minute, action.offsetMinutes).getTime()
      : chosenRelease(action.releaseAt, now, action.offsetMinutes);
  const messages = [...state.messages, { ...message, releaseAt: at }];
  return holdDigest({ ...state, messages });
}

function chosenRelease(releaseAt, now, offsetMinutes) {
  if (typeof releaseAt === 'number' && Number.isFinite(releaseAt) && releaseAt > now) return releaseAt;
  return scheduledChoices(new Date(now), offsetMinutes)[0].getTime();
}

function holdDigest(state) {
  const held = heldMessages(state.messages).filter((item) => typeof item.releaseAt === 'number');
  if (!held.length) {
    return { state: { ...state, digest: null }, effects: state.digest ? [{ type: 'cancel-digest' }] : [] };
  }
  const at = Math.min(...held.map((item) => item.releaseAt));
  const due = held.filter((item) => item.releaseAt === at);
  const plan = digestPlan(due);
  return {
    state: {
      ...state,
      digest: {
        at,
        messageIds: plan.data.messageIds,
        presented: false,
        platformScheduled: false,
      },
    },
    effects: [{ type: 'schedule-digest', at, plan }],
  };
}

function release(state, now) {
  if (!state.digest || state.digest.presented || now < state.digest.at) {
    return { state, effects: [] };
  }
  return finishDigest(state, state.digest.platformScheduled ? [] : undefined);
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
  return {
    state: { ...rolled.state, digest },
    effects: effects ?? (plan ? [{ type: 'present', plan }] : [{ type: 'cancel-digest' }]),
  };
}

function isMessage(value) {
  const photo = value?.photo == null || value.photo === '' ? null : messagePhoto(value.photo);
  return (
    value &&
    typeof value.id === 'string' &&
    typeof value.contactId === 'string' &&
    typeof value.contactName === 'string' &&
    typeof value.body === 'string' &&
    (value.photo == null || value.photo === '' || Boolean(photo)) &&
    (value.body.trim() || photo) &&
    INTENT_IDS.has(value.intent) &&
    typeof value.createdAt === 'number' &&
    typeof value.visible === 'boolean'
  );
}

function isDigest(value) {
  return (
    value &&
    typeof value.at === 'number' &&
    Array.isArray(value.messageIds) &&
    value.messageIds.every((id) => typeof id === 'string') &&
    typeof value.presented === 'boolean'
  );
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
    digest: isDigest(raw.digest)
      ? {
          at: raw.digest.at,
          messageIds: raw.digest.messageIds,
          presented: raw.digest.presented,
          platformScheduled: raw.digest.platformScheduled === true,
        }
      : null,
  };
}
