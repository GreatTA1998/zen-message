import { reduce } from './delivery.js';
import { pushesFor } from './expoPush.js';
const nameOf = (p) => p.firstName || p.id;
export function deliverMessage(sender, recipient, action) {
  const outgoing = reduce(sender, { type: 'outgoing', id: action.id, contactId: recipient.id, contactName: nameOf(recipient), body: action.body, photo: action.photo, sticker: action.sticker, intent: action.intent, now: action.now });
  const incoming = reduce(recipient, { type: 'send', id: action.id, contactId: sender.id, contactName: nameOf(sender), body: action.body, photo: action.photo, sticker: action.sticker, intent: action.intent, now: action.now, offsetMinutes: recipient.offsetMinutes, releaseAt: action.releaseAt, notifyAll: (recipient.contacts || []).some((i) => i.id === sender.id && i.notifyAll) });
  return { sender: outgoing.state, recipient: incoming.state, senderEffects: outgoing.effects, recipientEffects: incoming.effects, pushes: pushesFor(incoming.effects, recipient.pushToken) };
}
export const changeMode = (user, mode) => reduce(user, { type: 'set-mode', mode });
export const changeSchedule = (user, hour, minute, now) => reduce(user, { type: 'set-schedule', dayHour: hour, dayMinute: minute, now, offsetMinutes: user.offsetMinutes });
export const releaseDue = (user, now) => reduce(user, { type: 'release', now });