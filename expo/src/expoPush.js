export const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

export function expoPushEndpoint() {
  const origin = typeof location !== 'undefined' ? location.origin : '';
  return typeof document !== 'undefined' && /^https?:\/\//.test(origin) ? `${origin}/api/push` : EXPO_PUSH_URL;
}

export function pushMessage(token, plan) {
  const collapseId = String(plan.data?.messageIds?.[0] || plan.data?.kind || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 64);
  return {
    to: token,
    title: plan.title,
    body: plan.body,
    sound: plan.quiet ? null : 'default',
    priority: plan.quiet ? 'default' : 'high',
    interruptionLevel: plan.quiet ? 'passive' : 'active',
    channelId: plan.quiet ? 'zen-quiet' : 'zen-normal',
    ...(collapseId ? { collapseId } : {}),
    data: plan.data,
  };
}

export const pushesFor = (effects, token) =>
  token ? effects.filter((e) => e.type === 'present' && e.plan).map((e) => pushMessage(token, e.plan)) : [];

export async function sendExpoPushes(messages, fetchImpl = fetch) {
  if (!messages.length) return { ok: true, sent: 0 };
  const response = await fetchImpl(expoPushEndpoint(), {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  });
  return { ok: response.ok, sent: messages.length };
}