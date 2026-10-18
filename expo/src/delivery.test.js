import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createState,
  digestPlan,
  immediatePlan,
  nextWindow,
  receiptPhrase,
  reduce,
  sanitize,
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
    intent: fields.intent,
    now: now.getTime(),
  });
}

test('next window is strictly after now', () => {
  assert.equal(nextWindow(at(10, 15), 'daily-1-7').getTime(), at(13, 0).getTime());
  assert.equal(nextWindow(at(12, 59), 'daily-1-7').getTime(), at(13, 0).getTime());
  assert.equal(nextWindow(at(13, 0), 'daily-1-7').getTime(), at(19, 0).getTime());
  assert.equal(nextWindow(at(13, 1), 'daily-1-7').getTime(), at(19, 0).getTime());
  assert.equal(nextWindow(at(19, 0), 'daily-1-7').getTime(), at(13, 0, 18).getTime());
  assert.equal(nextWindow(at(20, 0), 'daily-1-7').getTime(), at(13, 0, 18).getTime());

  assert.equal(nextWindow(at(10, 15), 'hourly').getTime(), at(11, 0).getTime());
  assert.equal(nextWindow(at(11, 0), 'hourly').getTime(), at(12, 0).getTime());

  assert.equal(nextWindow(at(7, 59), 'daily-8').getTime(), at(8, 0).getTime());
  assert.equal(nextWindow(at(8, 0), 'daily-8').getTime(), at(8, 0, 18).getTime());

  assert.equal(nextWindow(at(10, 0), 'every-3-hours').getTime(), at(12, 0).getTime());
  assert.equal(nextWindow(at(23, 30), 'every-3-hours').getTime(), at(0, 0, 18).getTime());
});

test('anytime batched stays hidden and joins one digest', () => {
  const first = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  assert.equal(first.state.messages[0].visible, false);
  assert.equal(first.state.messages[0].releaseAt, at(13, 0).getTime());
  assert.equal(first.effects.length, 1);
  assert.equal(first.effects[0].type, 'schedule-digest');
  assert.equal(first.effects[0].at, at(13, 0).getTime());
  assert.equal(first.effects[0].plan.quiet, false);
  assert.deepEqual(first.effects[0].plan.data, {
    kind: 'digest',
    quiet: false,
    messageIds: ['a'],
  });
  assert.equal(first.effects[0].plan.body, 'Wren: Hello world');
  assert.equal(threadMessages(first.state.messages, 'wren').length, 0);

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

test('timely waits for the next batch and does not notify early', () => {
  const held = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  const result = send(held.state, { id: 'c', body: 'Today', intent: 'timely' }, at(10, 20));
  assert.equal(result.state.messages.find((item) => item.id === 'c').visible, false);
  assert.deepEqual(result.state.digest.messageIds, ['a', 'c']);
  assert.equal(result.effects.length, 1);
  assert.equal(result.effects[0].type, 'schedule-digest');
  assert.equal(result.effects[0].plan.data.kind, 'digest');
  assert.equal(JSON.stringify(result.effects).includes('relax'), false);
  assert.equal(immediatePlan({ ...result.state.messages[1], intent: 'timely' }).data.kind, 'timely');
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

test('relaxed timely is readable sooner and stays private', () => {
  const relaxed = reduce(createState(), { type: 'set-mode', mode: 'relaxed' }).state;
  const timely = send(relaxed, { id: 't', body: 'Soon', intent: 'timely' }, at(10, 15));
  const realtime = send(relaxed, { id: 'r', body: 'Now', intent: 'realtime' }, at(10, 16));
  assert.equal(timely.state.messages[0].visible, true);
  assert.deepEqual(timely.effects, []);
  assert.equal(JSON.stringify({ effects: timely.effects, message: timely.state.messages[0] }).includes('relax'), false);
  assert.equal(realtime.effects[0].plan.quiet, false);
  assert.equal(
    receiptPhrase(at(10, 15), { scheduleId: 'daily-1-7', offsetMinutes: 0, mode: 'relaxed' }).includes('relax'),
    false
  );
});

test('a schedule change moves the one pending digest', () => {
  const held = send(createState(), { id: 'a', body: 'Hello world', intent: 'anytime' }, at(10, 15));
  const moved = reduce(held.state, { type: 'set-schedule', scheduleId: 'hourly', now: at(10, 40).getTime() });
  assert.equal(moved.state.scheduleId, 'hourly');
  assert.equal(moved.state.digest.at, at(11, 0).getTime());
  assert.equal(moved.state.messages[0].releaseAt, at(11, 0).getTime());
  assert.equal(moved.effects.length, 1);
  assert.equal(moved.effects[0].type, 'schedule-digest');
  assert.equal(moved.state.digest.platformScheduled, false);
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

  const due = reduce(scheduled, { type: 'release', now: at(13, 0).getTime() });
  assert.equal(due.state.messages[0].visible, true);
  assert.equal(due.state.digest.presented, true);
  assert.equal(due.effects.length, 0);

  const again = reduce(due.state, { type: 'release', now: at(13, 5).getTime() });
  assert.equal(again.effects.length, 0);

  const unscheduled = reduce(held.state, { type: 'release', now: at(13, 0).getTime() });
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

  const timely = send(createState(), { id: 'p3', body: 'Look', photo, intent: 'timely' }, at(10, 15));
  assert.equal(timely.state.messages[0].visible, false);
  assert.equal(timely.state.messages[0].photo, photo);
  assert.equal(timely.effects[0].type, 'schedule-digest');
  assert.equal(timely.effects[0].plan.body, 'Wren: Look');

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
  assert.equal(nextWindow(now, 'daily-1-7', 420).getTime(), Date.UTC(2026, 9, 17, 20, 0));
  assert.equal(nextWindow(now, 'hourly', 0).getTime(), Date.UTC(2026, 9, 17, 18, 0));
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

test('weekly rhythm is one day and one time, default Sunday 5pm', () => {
  const morning = new Date(2026, 9, 18, 10, 0, 0, 0);
  while (morning.getDay() !== 0) morning.setDate(morning.getDate() + 1);
  const today = nextWindow(morning, 'weekly');
  assert.equal(today.getDay(), 0);
  assert.equal(today.getHours(), 17);
  assert.equal(today.getDate(), morning.getDate());
  const after = nextWindow(new Date(morning.getFullYear(), morning.getMonth(), morning.getDate(), 18, 0), 'weekly');
  assert.equal(after.getDay(), 0);
  assert.equal(after.getHours(), 17);
  assert.ok(after.getTime() - morning.getTime() > 6 * 86400000);
  const wednesday = nextWindow(morning, 'weekly', undefined, { weekDay: 3, weekHour: 17 });
  assert.equal(wednesday.getDay(), 3);
  assert.equal(wednesday.getHours(), 17);
});

test('receipt phrase names today, tomorrow, or the weekday and ignores relax mode', () => {
  const morning = new Date(Date.UTC(2026, 9, 18, 10, 0));
  while (morning.getUTCDay() !== 0) morning.setUTCDate(morning.getUTCDate() + 1);
  const evening = new Date(morning.getTime() + 10 * 3600000);
  assert.equal(receiptPhrase(morning, { scheduleId: 'daily-1-7', offsetMinutes: 0 }), 'Received at 1pm today');
  assert.equal(receiptPhrase(evening, { scheduleId: 'daily-1-7', offsetMinutes: 0 }), 'Received at 1pm tomorrow');
  assert.equal(
    receiptPhrase(morning, { scheduleId: 'weekly', weekDay: 0, weekHour: 17, offsetMinutes: 0 }),
    'Received at 5pm today'
  );
  assert.equal(
    receiptPhrase(morning, { scheduleId: 'weekly', weekDay: 3, weekHour: 17, offsetMinutes: 0, mode: 'relaxed' }),
    'Received at 5pm Wednesday'
  );
});

test('changing the weekly day moves the pending batch', () => {
  const morning = new Date(2026, 9, 18, 10, 0, 0, 0);
  while (morning.getDay() !== 0) morning.setDate(morning.getDate() + 1);
  const held = send(createState(), { id: 'a', body: 'Hello world', intent: 'timely' }, morning);
  const moved = reduce(held.state, {
    type: 'set-schedule',
    scheduleId: 'weekly',
    weekDay: 3,
    weekHour: 17,
    now: morning.getTime(),
  });
  assert.equal(moved.state.scheduleId, 'weekly');
  assert.equal(moved.state.weekDay, 3);
  assert.equal(moved.state.weekHour, 17);
  assert.equal(new Date(moved.state.digest.at).getDay(), 3);
  assert.equal(new Date(moved.state.digest.at).getHours(), 17);
  assert.equal(moved.state.messages[0].visible, false);
});

test('sanitize drops broken saved data', () => {
  const clean = sanitize({
    mode: 'relaxed',
    scheduleId: 'nope',
    contactId: 'pip',
    messages: [{ id: 'a', contactId: 'pip', contactName: 'Pip', body: 'Hi', intent: 'anytime', createdAt: 1, visible: true }, { nope: true }],
    digest: { at: 5, messageIds: ['a'], presented: false, platformScheduled: true },
  });
  assert.equal(clean.mode, 'relaxed');
  assert.equal(clean.scheduleId, 'daily-1-7');
  assert.equal(clean.messages.length, 1);
  assert.equal(clean.digest.platformScheduled, true);
  assert.deepEqual(sanitize(null), createState());
});
