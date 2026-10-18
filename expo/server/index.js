import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { createState, reduce } from '../src/delivery.js';
import { CODE_ALPHABET, CODE_LENGTH, hasConfusingCharacter, isCode, normalizeCode } from '../src/people.js';
import { changeMode, changeSchedule, deliverMessage, releaseDue } from './deliver.js';
import { sendExpoPushes } from './push.js';

const users = new Map();
const sessions = new Map();
const port = Number(process.env.PORT || 8787);

function mintCode() {
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const bytes = randomBytes(CODE_LENGTH);
    let code = '';
    for (let index = 0; index < CODE_LENGTH; index += 1) {
      code += CODE_ALPHABET[bytes[index] % CODE_ALPHABET.length];
    }
    if (!users.has(code)) return code;
  }
  throw new Error('code_exhausted');
}

function createUser(provider, subject) {
  return {
    ...createState(),
    id: mintCode(),
    provider,
    subject,
    pushToken: null,
    offsetMinutes: 0,
    contacts: [],
    pendingEffects: [],
  };
}

function findByIdentity(provider, subject) {
  for (const user of users.values()) {
    if (user.provider === provider && user.subject === subject) return user;
  }
  return null;
}

function publicUser(user) {
  return {
    id: user.id,
    provider: user.provider,
  };
}

function inbox(user) {
  return {
    user: publicUser(user),
    contacts: user.contacts,
    effects: user.pendingEffects,
    state: {
      mode: user.mode,
      scheduleId: user.scheduleId,
      contactId: user.contactId,
      messages: user.messages,
      digest: user.digest,
    },
  };
}

function save(user) {
  users.set(user.id, user);
  return user;
}

function applyClock(user, offsetMinutes) {
  if (typeof offsetMinutes === 'number' && Number.isFinite(offsetMinutes)) {
    user.offsetMinutes = offsetMinutes;
  }
}

async function notify(user, effects) {
  if (!effects.length) {
    user.pendingEffects = [];
    return;
  }
  if (user.pushToken) {
    const pushes = effects
      .filter((effect) => effect.type === 'present')
      .map((effect) => ({
        to: user.pushToken,
        title: effect.plan.title,
        body: effect.plan.body,
        sound: effect.plan.quiet ? null : 'default',
        priority: effect.plan.quiet ? 'default' : 'high',
        interruptionLevel: effect.plan.quiet ? 'passive' : 'active',
        channelId: effect.plan.quiet ? 'zen-quiet' : 'zen-normal',
        data: effect.plan.data,
      }));
    if (pushes.length) {
      try {
        await sendExpoPushes(pushes);
      } catch (error) {
        console.info(`[zen-push] ${error?.message ?? error}`);
      }
    }
    user.pendingEffects = effects.filter((effect) => effect.type === 'cancel-digest');
    return;
  }
  user.pendingEffects = effects;
}

function releaseUser(user, now) {
  const result = releaseDue(user, now);
  Object.assign(user, result.state);
  return result.effects;
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function send(response, status, body) {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  response.end(payload);
}

function userFrom(request) {
  const header = request.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const id = sessions.get(token);
  return id ? users.get(id) : null;
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    send(response, 204, {});
    return;
  }
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  try {
    if (request.method === 'POST' && url.pathname === '/v1/session') {
      const body = await readBody(request);
      const provider = body.provider === 'apple' || body.provider === 'google' ? body.provider : null;
      const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
      if (!provider || subject.length < 4) {
        send(response, 400, { error: 'provider_subject_missing' });
        return;
      }
      const existing = findByIdentity(provider, subject);
      const user = existing ?? createUser(provider, subject);
      save(user);
      const token = randomBytes(24).toString('hex');
      sessions.set(token, user.id);
      send(response, 200, { token, user: publicUser(user) });
      return;
    }

    const user = userFrom(request);
    if (!user) {
      send(response, 401, { error: 'sign_in_required' });
      return;
    }
    const body = request.method === 'POST' ? await readBody(request) : {};
    applyClock(user, body.offsetMinutes);

    if (request.method === 'GET' && url.pathname === '/v1/inbox') {
      applyClock(user, Number(url.searchParams.get('offset')));
      const effects = releaseUser(user, Date.now());
      if (effects.length) await notify(user, effects);
      save(user);
      send(response, 200, inbox(user));
      return;
    }

    if (request.method === 'POST' && url.pathname === '/v1/contacts') {
      const code = normalizeCode(body.code);
      if (hasConfusingCharacter(code) || (code && !isCode(code))) {
        send(response, 400, { error: 'code_invalid' });
        return;
      }
      const found = isCode(code) ? users.get(code) : null;
      if (!found || found.id === user.id) {
        send(response, 404, { error: 'person_not_found' });
        return;
      }
      if (!user.contacts.some((item) => item.id === found.id)) {
        user.contacts = [...user.contacts, { id: found.id }];
      }
      if (!user.contactId) user.contactId = found.id;
      save(user);
      send(response, 200, inbox(user));
      return;
    }

    if (request.method === 'POST' && url.pathname === '/v1/open') {
      if (user.contacts.some((item) => item.id === body.contactId)) user.contactId = body.contactId;
      save(user);
      send(response, 200, inbox(user));
      return;
    }

    if (request.method === 'POST' && url.pathname === '/v1/messages') {
      const recipient = users.get(body.contactId);
      if (!recipient || !user.contacts.some((item) => item.id === recipient.id)) {
        send(response, 404, { error: 'person_not_found' });
        return;
      }
      const result = deliverMessage(user, recipient, {
        id: randomBytes(8).toString('hex'),
        body: body.body,
        intent: body.intent,
        now: Date.now(),
      });
      Object.assign(user, result.sender, {
        contacts: user.contacts,
        pushToken: user.pushToken,
        offsetMinutes: user.offsetMinutes,
        provider: user.provider,
        subject: user.subject,
        pendingEffects: user.pendingEffects,
      });
      Object.assign(recipient, result.recipient, {
        contacts: recipient.contacts,
        pushToken: recipient.pushToken,
        offsetMinutes: recipient.offsetMinutes,
        provider: recipient.provider,
        subject: recipient.subject,
        pendingEffects: recipient.pendingEffects,
      });
      await notify(recipient, result.recipientEffects);
      save(user);
      save(recipient);
      send(response, 200, inbox(user));
      return;
    }

    if (request.method === 'POST' && url.pathname === '/v1/mode') {
      const result = changeMode(user, body.mode);
      Object.assign(user, result.state);
      await notify(user, result.effects);
      save(user);
      send(response, 200, inbox(user));
      return;
    }

    if (request.method === 'POST' && url.pathname === '/v1/schedule') {
      const result = changeSchedule(user, body.scheduleId, Date.now());
      Object.assign(user, result.state);
      await notify(user, result.effects);
      save(user);
      send(response, 200, inbox(user));
      return;
    }

    if (request.method === 'POST' && url.pathname === '/v1/push-token') {
      user.pushToken = typeof body.token === 'string' ? body.token : null;
      save(user);
      send(response, 200, { ok: true });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/v1/effects/ack') {
      user.pendingEffects = [];
      save(user);
      send(response, 200, { ok: true });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/v1/shown') {
      const result = reduce(user, { type: 'shown', now: Date.now() });
      Object.assign(user, result.state);
      user.pendingEffects = [];
      save(user);
      send(response, 200, inbox(user));
      return;
    }

    send(response, 404, { error: 'not_found' });
  } catch (error) {
    send(response, 400, { error: 'bad_request' });
  }
});

setInterval(() => {
  const now = Date.now();
  for (const user of users.values()) {
    if (!user.digest || user.digest.presented || now < user.digest.at) continue;
    const effects = releaseUser(user, now);
    notify(user, effects).then(() => save(user));
  }
}, 5000);

server.listen(port, '0.0.0.0');
console.info(`[zen-server] listening on ${port}`);
