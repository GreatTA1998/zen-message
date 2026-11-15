import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ackDigest,
  choiceLabel,
  composerPlaceholder,
  createState,
  dailyClock,
  digestPlan,
  nextDaily,
  receiptPhrase,
  reduce,
  sanitize,
  scheduledChoices,
  scheduledColumns,
  contactUnread,
  syncOpenedAt,
  threadMessages,
} from './delivery.js';

function at(hour, minute, day = 17) {
  return new Date(2026, 9, day, hour, minute, 0, 0);
}

function send(state, fields, now) {
  return reduce(state, {
    type: 'send',
    id: fields.id,
    contactId: fields.contactId ?? 'wren',
    contactName: fields.contactName ?? 'Wren',
    body: fields.body,
    photo: fields.photo,
    sticker: fields.sticker,
    intent: fields.intent,
    now: now.getTime(),
  });
}

test('the daily summary is 7:00 pm and is strictly after now', () => {
  assert.equal(dailyClock(createState()).hour, 19);
  assert.equal(nextDaily(at(10, 15)).getTime(), at(19, 0).getTime());
  assert.equal(nextDaily(at(19, 0)).getTime(), at(19, 0, 18).getTime());
  assert.equal(nextDaily(at(20, 0), 8, 0).getTime(), at(8, 0, 18).getTime());
});

test('scheduled columns are remaining today hours and tomorrow from 8am', () => {
  const morning = scheduledColumns(at(10, 0));
  assert.equal(morning.today[0].getTime(), at(11, 0).getTime());
  assert.equal(morning.today.at(-1).getTime(), at(23, 0).getTime());
  assert.equal(morning.tomorrow[0].getTime(), at(8, 0, 18).getTime());
  assert.equal(scheduledChoices(at(16, 0))[0].getTime(), at(17, 0).getTime());
  assert.equal(scheduledColumns(at(19, 0)).today[0].getTime(), at(20, 0).getTime());
  assert.equal(scheduledColumns(at(23, 30)).today.length, 0);
});

test('anytime batched stays hidden and joins one digest', () => {
  const first = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  assert.equal(first.state.messages[0].visible, false);
  assert.equal(first.state.messages[0].releaseAt, at(19, 0).getTime());
  assert.equal(first.effects.length, 1);
  assert.equal(first.effects[0].type, 'schedule-digest');
  assert.equal(first.effects[0].at, at(19, 0).getTime());
  assert.equal(first.effects[0].plan.quiet, false);
  assert.deepEqual(first.effects[0].plan.data, {
    kind: 'digest',
    quiet: false,
    messageIds: ['a'],
  });
  assert.equal(first.effects[0].plan.body, 'Wren: Hello world');
  assert.equal(threadMessages(first.state.messages, 'wren').length, 1);

  const second = send(
    first.state,
    { id: 'b', contactId: 'pip', contactName: 'Pip', body: 'Later', intent: 'anytime' },
    at(11, 0)
  );
  assert.equal(second.effects.length, 1);
  assert.equal(second.effects[0].type, 'schedule-digest');
  assert.deepEqual(second.effects[0].plan.data.messageIds, ['a', 'b']);
  assert.equal(second.effects[0].plan.body, '2 messages · Wren, Pip');
  assert.equal(second.state.digest.messageIds.length, 2);
  assert.equal(second.state.messages.every((item) => item.visible === false), true);
});

test('anytime relaxed is visible and silent', () => {
  const relaxed = reduce(createState(), { type: 'set-mode', mode: 'relaxed' });
  const result = send(relaxed.state, { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  assert.equal(result.state.messages[0].visible, true);
  assert.equal(result.effects.length, 0);
  assert.equal(JSON.stringify(result.effects).includes('relax'), false);
  assert.equal(result.state.digest, null);
});

test('relax reveals a held digest without notifying', () => {
  const held = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  const relaxed = reduce(
    { ...held.state, digest: { ...held.state.digest, platformScheduled: true } },
    { type: 'set-mode', mode: 'relaxed' }
  );
  assert.equal(relaxed.state.mode, 'relaxed');
  assert.equal(relaxed.state.messages[0].visible, true);
  assert.equal(relaxed.state.digest, null);
  assert.deepEqual(relaxed.effects, [{ type: 'cancel-digest' }]);
  assert.equal(JSON.stringify(relaxed.effects).includes('relax'), false);
});

test('batched does not hide a message that was already visible', () => {
  const relaxed = reduce(createState(), { type: 'set-mode', mode: 'relaxed' });
  const sent = send(relaxed.state, { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  const batched = reduce(sent.state, { type: 'set-mode', mode: 'batched' });
  assert.equal(batched.state.messages[0].visible, true);
  assert.equal(batched.effects.length, 0);
});

test('scheduled waits for the chosen time and does not notify early', () => {
  const noon = at(12, 0).getTime();
  const held = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  const result = reduce(held.state, {
    type: 'send',
    id: 'c',
    contactId: 'wren',
    contactName: 'Wren',
    body: 'Today',
    intent: 'scheduled',
    releaseAt: noon,
    now: at(10, 20).getTime(),
  });
  const scheduled = result.state.messages.find((item) => item.id === 'c');
  assert.equal(scheduled.visible, false);
  assert.equal(scheduled.releaseAt, noon);
  assert.equal(result.state.messages.find((item) => item.id === 'a').releaseAt, at(19, 0).getTime());
  assert.deepEqual(result.state.digest.messageIds, ['c']);
  assert.equal(result.state.digest.at, noon);
  assert.equal(result.effects[0].type, 'schedule-digest');
  assert.equal(JSON.stringify(result.effects).includes('relax'), false);
  const early = reduce(result.state, { type: 'release', now: at(11, 0).getTime() });
  assert.equal(early.state.messages.find((item) => item.id === 'c').visible, false);
  assert.equal(early.effects.length, 0);
  const due = reduce(result.state, { type: 'release', now: noon });
  assert.equal(due.state.messages.find((item) => item.id === 'c').visible, true);
  assert.equal(due.state.messages.find((item) => item.id === 'a').visible, false);
  assert.equal(due.effects.length, 1);
  assert.equal(due.effects[0].type, 'present');
  assert.deepEqual(due.effects[0].plan.data.messageIds, ['c']);
});

test('realtime is one normal notification', () => {
  const result = send(createState(), { id: 'd', body: 'Now', intent: 'realtime' }, at(10, 15));
  assert.equal(result.state.messages[0].visible, true);
  assert.deepEqual(result.effects, [
    {
      type: 'present',
      plan: {
        title: 'Wren',
        body: 'Now',
        quiet: false,
        data: { kind: 'realtime', quiet: false, messageIds: ['d'] },
      },
    },
  ]);
});

test('relaxed scheduled is readable sooner and stays private', () => {
  const relaxed = reduce(createState(), { type: 'set-mode', mode: 'relaxed' }).state;
  const scheduled = reduce(relaxed, {
    type: 'send',
    id: 't',
    contactId: 'wren',
    contactName: 'Wren',
    body: 'Soon',
    intent: 'scheduled',
    releaseAt: at(19, 0).getTime(),
    now: at(10, 15).getTime(),
  });
  const realtime = send(relaxed, { id: 'r', body: 'Now', intent: 'realtime' }, at(10, 16));
  assert.equal(scheduled.state.messages[0].visible, true);
  assert.deepEqual(scheduled.effects, []);
  assert.equal(JSON.stringify({ effects: scheduled.effects, message: scheduled.state.messages[0] }).includes('relax'), false);
  assert.equal(realtime.effects[0].plan.quiet, false);
  assert.equal(receiptPhrase(at(19, 0), at(10, 15), 0).includes('relax'), false);
  assert.equal(receiptPhrase(at(19, 0), at(16, 0)), 'Received at 7:00 pm today');
  assert.equal(receiptPhrase(at(12, 0, 18), at(16, 0)), 'Received at 12:00 pm tomorrow');
});

test('a daily time change moves anytime and leaves a scheduled message', () => {
  const held = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  const scheduled = reduce(held.state, {
    type: 'send',
    id: 'c',
    contactId: 'wren',
    contactName: 'Wren',
    body: 'Noon',
    intent: 'scheduled',
    releaseAt: at(12, 0).getTime(),
    now: at(10, 20).getTime(),
  });
  const moved = reduce(scheduled.state, { type: 'set-schedule', dayHour: 8, dayMinute: 0, now: at(10, 40).getTime() });
  assert.equal(moved.state.dayHour, 8);
  assert.equal(moved.state.messages.find((item) => item.id === 'a').releaseAt, at(8, 0, 18).getTime());
  assert.equal(moved.state.messages.find((item) => item.id === 'c').releaseAt, at(12, 0).getTime());
  assert.equal(moved.state.digest.at, at(12, 0).getTime());
  assert.equal(moved.effects[0].type, 'schedule-digest');
});

test('the window reveals held messages once', () => {
  const held = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  const scheduled = {
    ...held.state,
    digest: { ...held.state.digest, platformScheduled: true },
  };
  const early = reduce(scheduled, { type: 'release', now: at(12, 0).getTime() });
  assert.equal(early.state.messages[0].visible, false);
  assert.equal(early.effects.length, 0);

  const due = reduce(scheduled, { type: 'release', now: at(19, 0).getTime() });
  assert.equal(due.state.messages[0].visible, true);
  assert.equal(due.state.digest.presented, true);
  assert.equal(due.effects.length, 0);

  const again = reduce(due.state, { type: 'release', now: at(19, 5).getTime() });
  assert.equal(again.effects.length, 0);

  const unscheduled = reduce(held.state, { type: 'release', now: at(19, 0).getTime() });
  assert.equal(unscheduled.effects.length, 1);
  assert.equal(unscheduled.effects[0].type, 'present');
  assert.equal(unscheduled.effects[0].plan.data.kind, 'digest');
  assert.equal(unscheduled.effects[0].plan.quiet, false);
});

test('a shown digest does not present a second time', () => {
  const held = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  const shown = reduce(held.state, { type: 'shown' });
  assert.equal(shown.state.messages[0].visible, true);
  assert.equal(shown.effects.length, 0);
});

test('showing a digest arms the later batch', () => {
  const noon = at(12, 0).getTime();
  const held = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  const scheduled = reduce(held.state, {
    type: 'send',
    id: 'c',
    contactId: 'wren',
    contactName: 'Wren',
    body: 'Today',
    intent: 'scheduled',
    releaseAt: noon,
    now: at(10, 20).getTime(),
  });
  const shown = reduce(scheduled.state, { type: 'shown', now: noon });
  assert.equal(shown.state.messages.find((item) => item.id === 'c').visible, true);
  assert.equal(shown.state.messages.find((item) => item.id === 'a').visible, false);
  assert.equal(shown.state.digest.presented, false);
  assert.equal(shown.state.digest.platformScheduled, false);
  assert.equal(shown.state.digest.at, at(19, 0).getTime());
  assert.equal(shown.effects.length, 1);
  assert.equal(shown.effects[0].type, 'schedule-digest');
  assert.equal(shown.effects[0].at, at(19, 0).getTime());
  assert.deepEqual(shown.effects[0].plan.data.messageIds, ['a']);
});

test('an armed digest stays armed when a later message does not change it', () => {
  const held = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  const armed = {
    ...held.state,
    digest: { ...held.state.digest, platformScheduled: true },
  };
  const later = reduce(armed, {
    type: 'send',
    id: 'c',
    contactId: 'pip',
    contactName: 'Pip',
    body: 'Tonight',
    intent: 'scheduled',
    releaseAt: at(20, 0).getTime(),
    now: at(10, 20).getTime(),
  });
  assert.equal(later.state.digest.at, at(19, 0).getTime());
  assert.deepEqual(later.state.digest.messageIds, ['a']);
  assert.equal(later.state.digest.platformScheduled, true);
  assert.deepEqual(later.effects, []);
  assert.equal(later.state.messages.find((item) => item.id === 'c').releaseAt, at(20, 0).getTime());
});

test('another message in an armed digest keeps the alarm and refreshes the copy', () => {
  const held = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  const armed = {
    ...held.state,
    digest: { ...held.state.digest, platformScheduled: true },
  };
  const second = send(
    armed,
    { id: 'b', contactId: 'pip', contactName: 'Pip', body: 'Later', intent: 'anytime' },
    at(11, 0)
  );
  assert.equal(second.state.digest.at, held.state.digest.at);
  assert.equal(second.state.digest.platformScheduled, true);
  assert.deepEqual(second.state.digest.messageIds, ['a', 'b']);
  assert.equal(second.effects.length, 1);
  assert.equal(second.effects[0].type, 'schedule-digest');
  assert.deepEqual(second.effects[0].plan.data.messageIds, ['a', 'b']);
});

test('a sooner message clears an armed digest so the device reschedules', () => {
  const held = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  const armed = {
    ...held.state,
    digest: { ...held.state.digest, platformScheduled: true },
  };
  const noon = at(12, 0).getTime();
  const sooner = reduce(armed, {
    type: 'send',
    id: 'c',
    contactId: 'wren',
    contactName: 'Wren',
    body: 'Today',
    intent: 'scheduled',
    releaseAt: noon,
    now: at(10, 20).getTime(),
  });
  assert.equal(sooner.state.digest.at, noon);
  assert.equal(sooner.state.digest.platformScheduled, false);
  assert.deepEqual(sooner.state.digest.messageIds, ['c']);
  assert.equal(sooner.effects.length, 1);
  assert.equal(sooner.effects[0].type, 'schedule-digest');
  assert.equal(sooner.effects[0].at, noon);
});

test('ack marks only the digest slot that was armed', () => {
  const digest = { at: 5, messageIds: ['a', 'b'], presented: false, platformScheduled: false };
  const stale = ackDigest(digest, { at: 5, messageIds: ['a'] });
  assert.equal(stale.digest.platformScheduled, false);
  assert.equal(stale.clearEffects, false);
  const otherTime = ackDigest(digest, { at: 9, messageIds: ['a', 'b'] });
  assert.equal(otherTime.digest, digest);
  assert.equal(otherTime.clearEffects, false);
  const unscoped = ackDigest(digest, true);
  assert.equal(unscoped.digest, digest);
  assert.equal(unscoped.clearEffects, true);
  const armed = ackDigest(digest, { at: 5, messageIds: ['a', 'b'] });
  assert.equal(armed.digest.platformScheduled, true);
  assert.equal(armed.clearEffects, true);
  assert.equal(ackDigest(armed.digest, { at: 5, messageIds: ['a', 'b'] }).digest, armed.digest);
  const presented = { ...digest, presented: true };
  assert.equal(ackDigest(presented, { at: 5, messageIds: ['a', 'b'] }).digest, presented);
});

test('digest copy stays a single notice for many contacts', () => {
  const plan = digestPlan([
    { id: '1', contactName: 'Wren', body: 'a', createdAt: 1 },
    { id: '2', contactName: 'Pip', body: 'b', createdAt: 2 },
    { id: '3', contactName: 'Moss', body: 'c', createdAt: 3 },
    { id: '4', contactName: 'Lark', body: 'd', createdAt: 4 },
  ]);
  assert.equal(plan.body, '4 messages · Wren, Pip +2');
  assert.equal(JSON.stringify(plan).includes('relax'), false);
  assert.equal(JSON.stringify(plan).includes('batched'), false);
});

test('a sticker uses the same delivery as a photo', () => {
  const sticker = 'data:image/png;base64,bbbb';
  const batched = send(createState(), { id: 's', body: '', sticker, intent: 'anytime' }, at(10, 15));
  assert.equal(batched.state.messages[0].visible, false);
  assert.equal(batched.state.messages[0].sticker, sticker);
  assert.equal(batched.effects[0].plan.body, 'Wren: Drawing');

  const relaxed = reduce(createState(), { type: 'set-mode', mode: 'relaxed' });
  const shown = send(relaxed.state, { id: 's2', body: '', sticker, intent: 'realtime' }, at(10, 15));
  assert.equal(shown.state.messages[0].visible, true);
});

test('a photo uses the same delivery as text and is not a video', () => {
  const photo = 'data:image/png;base64,aaaa';
  const batched = send(createState(), { id: 'p', body: '', photo, intent: 'anytime' }, at(10, 15));
  assert.equal(batched.state.messages[0].visible, false);
  assert.equal(batched.state.messages[0].photo, photo);
  assert.equal(batched.effects[0].plan.body, 'Wren: Photo');
  assert.equal(JSON.stringify(batched.effects).includes('base64'), false);

  const relaxed = reduce(createState(), { type: 'set-mode', mode: 'relaxed' });
  const shown = send(relaxed.state, { id: 'p2', body: '', photo, intent: 'anytime' }, at(10, 15));
  assert.equal(shown.state.messages[0].visible, true);
  assert.deepEqual(shown.effects, []);

  const scheduled = reduce(createState(), {
    type: 'send',
    id: 'p3',
    contactId: 'wren',
    contactName: 'Wren',
    body: 'Look',
    photo,
    intent: 'scheduled',
    releaseAt: at(12, 0).getTime(),
    now: at(10, 15).getTime(),
  });
  assert.equal(scheduled.state.messages[0].visible, false);
  assert.equal(scheduled.state.messages[0].photo, photo);
  assert.equal(scheduled.effects[0].type, 'schedule-digest');
  assert.equal(scheduled.effects[0].plan.body, 'Wren: Look');
  assert.equal(scheduled.state.digest.at, at(12, 0).getTime());

  const state = createState();
  assert.equal(
    send(state, { id: 'v', body: '', photo: 'data:video/mp4;base64,aaaa', intent: 'realtime' }, at(10, 0)).state,
    state
  );
});

test('blank sends and unknown intents do nothing', () => {
  const state = createState();
  assert.equal(send(state, { id: 'a', body: '   ', intent: 'anytime' }, at(10, 0)).state, state);
  assert.equal(send(state, { id: 'a', body: 'Hi', intent: 'later' }, at(10, 0)).state, state);
});

test('a window can use the recipient clock', () => {
  const now = Date.UTC(2026, 9, 17, 17, 15);
  assert.equal(nextDaily(now, 19, 0, 420).getTime(), Date.UTC(2026, 9, 17, 19, 0) + 420 * 60000);
});

test('an outgoing message is visible and tells the sender nothing', () => {
  const result = reduce(createState(), {
    type: 'outgoing',
    id: 'a',
    contactId: 'ada',
    contactName: 'ada',
    body: 'Hello',
    intent: 'anytime',
    now: at(10, 15).getTime(),
  });
  assert.equal(result.state.messages[0].visible, true);
  assert.equal(result.state.messages[0].direction, 'out');
  assert.deepEqual(result.effects, []);
  assert.equal(JSON.stringify(result).includes('relax'), false);
});

test('receipt phrase names the chosen time and ignores focus', () => {
  const morning = at(10, 0);
  const wednesday = new Date(morning);
  while (wednesday.getDay() !== 0) wednesday.setDate(wednesday.getDate() + 1);
  const later = new Date(wednesday);
  later.setDate(wednesday.getDate() + 3);
  later.setHours(17, 0, 0, 0);
  assert.equal(receiptPhrase(at(19, 0), morning), 'Received at 7:00 pm today');
  assert.equal(receiptPhrase(later, wednesday), 'Received at 5:00 pm Wednesday');
  assert.equal(receiptPhrase(later, wednesday).includes('relax'), false);
  assert.equal(receiptPhrase(later, wednesday).includes('batched'), false);
  assert.equal(choiceLabel(at(19, 0), morning), '7pm');
  assert.equal(choiceLabel(later, wednesday), '5pm Wednesday');
});

test('composer placeholder uses nickname and delivery mode', () => {
  assert.equal(composerPlaceholder('nathan', 'realtime'), 'Message nathan');
  assert.equal(composerPlaceholder('nathan', 'anytime'), 'Message nathan without a notification');
  assert.equal(composerPlaceholder('nathan', 'scheduled', at(19, 0)), 'Message nathan at 7 pm');
  assert.equal(composerPlaceholder('', 'realtime'), 'Message');
});

test('sanitize drops broken saved data', () => {
  const clean = sanitize({
    mode: 'relaxed',
    dayHour: 99,
    contactId: 'pip',
    messages: [{ id: 'a', contactId: 'pip', contactName: 'Pip', body: 'Hi', intent: 'anytime', createdAt: 1, visible: true }, { nope: true }],
    digest: { at: 5, messageIds: ['a'], presented: false, platformScheduled: true },
  });
  assert.equal(clean.mode, 'relaxed');
  assert.equal(clean.dayHour, 19);
  assert.equal(clean.messages.length, 1);
  assert.equal(clean.digest.platformScheduled, true);
  assert.deepEqual(sanitize(null), createState());
});

test('thread lists Focus-held GHV rows; pick is independent of poll contactId', () => {
  const messages = [
    { id: '1', contactId: 'S36', body: 'elton', visible: true },
    { id: '2', contactId: 'GHV', body: 'zjf', visible: false, intent: 'anytime' },
  ];
  const selected = 'GHV';
  assert.deepEqual(threadMessages(messages, selected).map((item) => item.id), ['2']);
});

test('unread glow uses opened-at vs latest inbound', () => {
  const messages = [{ id: '1', contactId: 'GHV', direction: 'in', createdAt: 100 }];
  assert.equal(contactUnread(messages, 'GHV', 50), true);
  assert.equal(contactUnread(messages, 'GHV', 100), false);
  assert.equal(syncOpenedAt({}, [{ id: 'ghv' }], messages, null).GHV, 100);
});
