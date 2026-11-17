import { reduce } from '../src/delivery.js';
import { pushesFor } from './push.js';

function displayName(person) {
  return person.firstName || person.id;
}

function wantsAllAlerts(recipient, senderId) {
  return (recipient.contacts || []).some((item) => item.id === senderId && item.notifyAll === true);
}

export function deliverMessage(sender, recipient, action) {
  const outgoing = reduce(sender, {
    type: 'outgoing',
    id: action.id,
    contactId: recipient.id,
    contactName: displayName(recipient),
    body: action.body,
    photo: action.photo,
    sticker: action.sticker,
    intent: action.intent,
    now: action.now,
  });
  const incoming = reduce(recipient, {
    type: 'send',
    id: action.id,
    contactId: sender.id,
    contactName: displayName(sender),
    body: action.body,
    photo: action.photo,
    sticker: action.sticker,
    intent: action.intent,
    now: action.now,
    offsetMinutes: recipient.offsetMinutes,
    releaseAt: action.releaseAt,
    notifyAll: wantsAllAlerts(recipient, sender.id),
  });
  return {
    sender: outgoing.state,
    recipient: incoming.state,
    senderEffects: outgoing.effects,
    recipientEffects: incoming.effects,
    pushes: pushesFor(incoming.effects, recipient.pushToken),
  };
}

export function changeMode(user, mode) {
  return reduce(user, { type: 'set-mode', mode });
}

export function changeSchedule(user, hour, minute, now) {
  return reduce(user, {
    type: 'set-schedule',
    dayHour: hour,
    dayMinute: minute,
    now,
    offsetMinutes: user.offsetMinutes,
  });
}

export function releaseDue(user, now) {
  return reduce(user, { type: 'release', now });
}
