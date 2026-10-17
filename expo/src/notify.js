import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const DIGEST_ID = 'zen-digest';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const quiet = notification?.request?.content?.data?.quiet === true;
    return {
      shouldPlaySound: !quiet,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

function contentFrom(plan) {
  return {
    title: plan.title,
    body: plan.body,
    data: plan.data,
    sound: plan.quiet ? false : 'default',
    interruptionLevel: plan.quiet ? 'passive' : 'active',
    priority: plan.quiet
      ? Notifications.AndroidNotificationPriority.LOW
      : Notifications.AndroidNotificationPriority.HIGH,
  };
}

function log(entry) {
  console.info(`[zen-notify] ${JSON.stringify(entry)}`);
}

export async function prepareNotifications() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('zen-normal', {
        name: 'Messages',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
      await Notifications.setNotificationChannelAsync('zen-quiet', {
        name: 'Quiet messages',
        importance: Notifications.AndroidImportance.LOW,
        sound: null,
        enableVibrate: false,
      });
    }
    const current = await Notifications.getPermissionsAsync();
    if (current.status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  } catch (error) {
    log({ action: 'prepare', error: error?.message ?? String(error) });
  }
}

export async function presentNow(plan) {
  const channelId = plan.quiet ? 'zen-quiet' : 'zen-normal';
  const trigger = Platform.OS === 'android' ? { channelId } : null;
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: contentFrom(plan),
      trigger,
    });
    log({ action: 'present', kind: plan.data.kind, quiet: plan.quiet, id });
    return { ok: true, id };
  } catch (error) {
    log({ action: 'present', kind: plan.data.kind, quiet: plan.quiet, error: error?.message ?? String(error) });
    return { ok: false };
  }
}

export async function scheduleDigest(at, plan) {
  try {
    await Notifications.cancelScheduledNotificationAsync(DIGEST_ID);
  } catch {
    // Replacing a digest that was never scheduled, or scheduling on web.
  }
  try {
    const id = await Notifications.scheduleNotificationAsync({
      identifier: DIGEST_ID,
      content: contentFrom(plan),
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(at),
        channelId: 'zen-normal',
      },
    });
    log({ action: 'schedule-digest', kind: 'digest', quiet: false, at, id });
    return { ok: true, id };
  } catch (error) {
    log({
      action: 'schedule-digest',
      kind: 'digest',
      quiet: false,
      at,
      error: error?.message ?? String(error),
    });
    return { ok: false };
  }
}

export async function cancelDigest() {
  try {
    await Notifications.cancelScheduledNotificationAsync(DIGEST_ID);
    log({ action: 'cancel-digest' });
    return { ok: true };
  } catch (error) {
    log({ action: 'cancel-digest', error: error?.message ?? String(error) });
    return { ok: false };
  }
}

export function listenForDigest(onDigest) {
  return Notifications.addNotificationReceivedListener((notification) => {
    if (notification?.request?.content?.data?.kind === 'digest') onDigest();
  });
}

export async function runNotificationEffects(effects) {
  let scheduled = false;
  for (const effect of effects) {
    if (effect.type === 'present') {
      await presentNow(effect.plan);
    } else if (effect.type === 'schedule-digest') {
      const result = await scheduleDigest(effect.at, effect.plan);
      scheduled = result.ok;
    } else if (effect.type === 'cancel-digest') {
      await cancelDigest();
    }
  }
  return { scheduled };
}
