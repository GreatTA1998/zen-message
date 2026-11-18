import { forwardExpoPush } from '$lib/expoPushProxy.js';

export const POST = ({ request }) => forwardExpoPush(request);