import { forwardExpoPush } from '$lib/expoPushProxy.js';

export function POST({ request }) {
  return forwardExpoPush(request);
}
