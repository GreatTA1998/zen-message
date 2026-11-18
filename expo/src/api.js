import { createCloudApi } from './cloudApi.js';

/** Shipped builds always use in-process Firestore cloudApi (no HTTP twin / 8s abort). */
let cloud = null;

export async function api(path, options = {}) {
  if (!cloud) cloud = createCloudApi();
  return cloud(path, options);
}

export function inboxPath() {
  return `/v1/inbox?offset=${new Date().getTimezoneOffset()}`;
}
