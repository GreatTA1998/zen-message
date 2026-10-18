import { createDeviceApi } from './deviceApi.js';

const PROJECT = 'project-z-e00fd';
const API_KEY = 'AIzaSyCMj9SsNMKDI9EezOzg_jowsYUOfaCbivc';
const ROOT = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/%28default%29/documents`;
const DOC_PREFIX = `projects/${PROJECT}/databases/(default)/documents/zenExpoState`;

function docName(docId) {
  return `${DOC_PREFIX}/${docId}`;
}

async function firestore(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${ROOT}${path}${path.includes('?') ? '&' : '?'}key=${API_KEY}`, {
    method,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error?.status || 'request_failed');
    error.code = payload.error?.status || 'request_failed';
    error.status = response.status;
    throw error;
  }
  return payload;
}

function conflict(error) {
  return error?.code === 'FAILED_PRECONDITION' || error?.code === 'ABORTED';
}

async function sendPushes(queued) {
  if (!queued.length) return;
  try {
    const { pushesFor, sendExpoPushes } = await import('../server/push.js');
    const messages = queued.flatMap((item) => pushesFor(item.effects, item.recipient?.pushToken));
    if (messages.length) await sendExpoPushes(messages);
  } catch {
    // The open app still receives the message on its next inbox refresh.
  }
}

export function createFirestoreStorage(docId = 'live') {
  const name = docName(docId);
  return {
    async transact(work) {
      let lastError = null;
      for (let attempt = 0; attempt < 6; attempt += 1) {
        let updateTime = null;
        let next = null;
        try {
          const current = await firestore(`/zenExpoState/${docId}`);
          updateTime = current.updateTime || null;
          next = current.fields?.json?.stringValue ?? null;
        } catch (error) {
          if (error.status !== 404) throw error;
        }
        let dirty = false;
        const queued = [];
        const result = await work({
          async getItem() {
            return next;
          },
          async setItem(_key, value) {
            next = value;
            dirty = true;
          },
          onDeliver(recipient, effects) {
            queued.push({ recipient, effects });
          },
        });
        if (!dirty) return result;
        try {
          await firestore(':commit', {
            method: 'POST',
            body: {
              writes: [
                {
                  update: {
                    name,
                    fields: { json: { stringValue: next } },
                  },
                  currentDocument: updateTime ? { updateTime } : { exists: false },
                },
              ],
            },
          });
          await sendPushes(queued);
          return result;
        } catch (error) {
          lastError = error;
          if (!conflict(error) || attempt === 5) throw error;
        }
      }
      throw lastError;
    },
  };
}

export function createCloudApi(docId = 'live') {
  return createDeviceApi(createFirestoreStorage(docId));
}
