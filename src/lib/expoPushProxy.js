const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const KINDS = new Set(['realtime', 'digest', 'timely']);
const MAX_MESSAGES = 20;
const MAX_TEXT = 240;

export function sanitizePushMessages(body) {
  if (!Array.isArray(body) || body.length === 0 || body.length > MAX_MESSAGES) return null;
  const messages = [];
  for (const item of body) {
    const message = sanitizePushMessage(item);
    if (!message) return null;
    messages.push(message);
  }
  return messages;
}

function sanitizePushMessage(item) {
  if (!item || typeof item !== 'object') return null;
  if (typeof item.to !== 'string' || !/^ExponentPushToken\[[A-Za-z0-9_-]{8,160}\]$/.test(item.to)) return null;
  if (typeof item.title !== 'string' || typeof item.body !== 'string') return null;
  const title = item.title.trim();
  const body = item.body.trim();
  if (!title || !body || title.length > MAX_TEXT || body.length > MAX_TEXT) return null;
  const data = item.data;
  if (!data || typeof data !== 'object' || !KINDS.has(data.kind)) return null;
  const messageIds = Array.isArray(data.messageIds)
    ? data.messageIds.filter((id) => typeof id === 'string' && id.length > 0 && id.length <= 80).slice(0, 40)
    : [];
  const message = {
    to: item.to,
    title,
    body,
    sound: item.sound === 'default' ? 'default' : null,
    priority: item.priority === 'high' ? 'high' : 'default',
    interruptionLevel: item.interruptionLevel === 'passive' ? 'passive' : 'active',
    channelId: item.channelId === 'zen-quiet' ? 'zen-quiet' : 'zen-normal',
    data: {
      kind: data.kind,
      quiet: data.quiet === true,
      messageIds,
    },
  };
  const encoded = JSON.stringify(message);
  if (encoded.includes('relax') || encoded.includes('batched')) return null;
  return message;
}

export async function forwardExpoPush(request, fetchImpl = fetch) {
  let payload = null;
  try {
    payload = await request.json();
  } catch {
    payload = null;
  }
  const messages = sanitizePushMessages(payload);
  if (!messages) {
    return json({ error: 'invalid' }, 400);
  }
  const upstream = await fetchImpl(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') || 'application/json',
      'cache-control': 'no-store',
    },
  });
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
