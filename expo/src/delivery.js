export const SCHEDULES = [
  { id: 'daily-1-7', label: 'Batched daily, 1pm, 7pm' },
  { id: 'hourly', label: 'Hourly' },
  { id: 'daily-8', label: 'Daily, 8am' },
  { id: 'every-3-hours', label: 'Every 3 hours' },
];

export const INTENTS = [
  { id: 'anytime', label: 'anytime' },
  { id: 'timely', label: 'timely but no rush' },
  { id: 'realtime', label: 'realtime' },
];

const INTENT_IDS = new Set(INTENTS.map((item) => item.id));

export function createState() {
  return {
    mode: 'batched',
    scheduleId: 'daily-1-7',
    contactId: 'wren',
    messages: [],
    digest: null,
  };
}

export function scheduleById(id) {
  return SCHEDULES.find((item) => item.id === id) ?? SCHEDULES[0];
}

export function nextWindow(now, scheduleId) {
  const date = now instanceof Date ? now : new Date(now);
  if (scheduleId === 'hourly') {
    const next = new Date(date);
    next.setMinutes(0, 0, 0);
    next.setHours(next.getHours() + 1);
    return next;
  }
  if (scheduleId === 'daily-8') {
    return nextClockTime(date, [8]);
  }
  if (scheduleId === 'every-3-hours') {
    return nextClockTime(date, [0, 3, 6, 9, 12, 15, 18, 21]);
  }
  return nextClockTime(date, [13, 19]);
}

function nextClockTime(now, hours) {
  const sorted = [...hours].sort((a, b) => a - b);
  for (const hour of sorted) {
    const candidate = new Date(now);
    candidate.setHours(hour, 0, 0, 0);
    if (candidate.getTime() > now.getTime()) return candidate;
  }
  const nextDay = new Date(now);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(sorted[0], 0, 0, 0);
  return nextDay;
}

export function threadMessages(messages, contactId) {
  return messages.filter((item) => item.contactId === contactId && item.visible);
}

export function immediatePlan(message) {
  const quiet = message.intent === 'timely';
  return {
    title: message.contactName,
    body: message.body,
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
      ? `${ordered[0].contactName}: ${ordered[0].body}`
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
  return messages.filter((item) => item.intent === 'anytime' && !item.visible);
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
      return setSchedule(state, action.scheduleId, now);
    case 'send':
      return send(state, action, now);
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

function setSchedule(state, scheduleId, now) {
  if (!SCHEDULES.some((item) => item.id === scheduleId)) return { state, effects: [] };
  if (scheduleId === state.scheduleId) return { state, effects: [] };
  if (!state.digest || state.digest.presented) {
    return { state: { ...state, scheduleId }, effects: [] };
  }
  const at = nextWindow(new Date(now), scheduleId).getTime();
  const ids = new Set(state.digest.messageIds);
  const messages = state.messages.map((item) =>
    ids.has(item.id) && !item.visible ? { ...item, releaseAt: at } : item
  );
  const plan = digestPlan(messages.filter((item) => ids.has(item.id)));
  return {
    state: {
      ...state,
      scheduleId,
      messages,
      digest: { at, messageIds: plan.data.messageIds, presented: false, platformScheduled: false },
    },
    effects: [{ type: 'schedule-digest', at, plan }],
  };
}

function send(state, action, now) {
  const body = typeof action.body === 'string' ? action.body.trim() : '';
  if (!body || !INTENT_IDS.has(action.intent)) return { state, effects: [] };
  const message = {
    id: action.id,
    contactId: action.contactId,
    contactName: action.contactName,
    body,
    intent: action.intent,
    createdAt: now,
    visible: false,
    releaseAt: null,
  };

  if (message.intent === 'timely' || message.intent === 'realtime') {
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

  const at = nextWindow(new Date(now), state.scheduleId).getTime();
  const messages = [...state.messages, { ...message, releaseAt: at }].map((item) =>
    item.intent === 'anytime' && !item.visible ? { ...item, releaseAt: at } : item
  );
  const held = heldMessages(messages);
  const plan = digestPlan(held);
  return {
    state: {
      ...state,
      messages,
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
  return {
    state: {
      ...state,
      messages: revealIds(state.messages, ids),
      digest: { ...state.digest, presented: true },
    },
    effects: effects ?? (plan ? [{ type: 'present', plan }] : [{ type: 'cancel-digest' }]),
  };
}

function isMessage(value) {
  return (
    value &&
    typeof value.id === 'string' &&
    typeof value.contactId === 'string' &&
    typeof value.contactName === 'string' &&
    typeof value.body === 'string' &&
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
    scheduleId: SCHEDULES.some((item) => item.id === raw.scheduleId) ? raw.scheduleId : base.scheduleId,
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
