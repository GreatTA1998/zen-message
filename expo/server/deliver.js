import { reduce } from '../src/delivery.js';
import { pushesFor } from './push.js';

export function deliverMessage(sender, recipient, action) {
  const outgoing = reduce(sender, {
    type: 'outgoing',
    id: action.id,
    contactId: recipient.id,
    contactName: recipient.id,
    body: action.body,
    photo: action.photo,
    intent: action.intent,
    now: action.now,
  });
  const incoming = reduce(recipient, {
    type: 'send',
    id: action.id,
    contactId: sender.id,
    contactName: sender.id,
    body: action.body,
    photo: action.photo,
    intent: action.intent,
    now: action.now,
    offsetMinutes: recipient.offsetMinutes,
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

export function changeSchedule(user, scheduleId, now, weekly) {
  return reduce(user, {
    type: 'set-schedule',
    scheduleId,
    weekDay: weekly?.weekDay,
    weekHour: weekly?.weekHour,
    now,
    offsetMinutes: user.offsetMinutes,
  });
}

export function releaseDue(user, now) {
  return reduce(user, { type: 'release', now });
}
