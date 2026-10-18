export const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

export function expoPushEndpoint() {
  const origin = typeof location !== 'undefined' ? location.origin : '';
  if (typeof document !== 'undefined' && /^https?:\/\//.test(origin)) {
    return `${origin}/api/push`;
  }
  return EXPO_PUSH_URL;
}

export function pushMessage(token, plan) {
  return {
    to: token,
    title: plan.title,
    body: plan.body,
    sound: plan.quiet ? null : 'default',
    priority: plan.quiet ? 'default' : 'high',
    interruptionLevel: plan.quiet ? 'passive' : 'active',
    channelId: plan.quiet ? 'zen-quiet' : 'zen-normal',
    data: plan.data,
  };
}

export function pushesFor(effects, token) {
  if (!token) return [];
  return effects
    .filter((effect) => effect.type === 'present' && effect.plan)
    .map((effect) => pushMessage(token, effect.plan));
}

export async function sendExpoPushes(messages, fetchImpl = fetch) {
  if (!messages.length) return { ok: true, sent: 0 };
  const response = await fetchImpl(expoPushEndpoint(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  });
  return { ok: response.ok, sent: messages.length };
}
