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
    if (current.status !== 'granted') await Notifications.requestPermissionsAsync();
  } catch {
    // Permissions or channels can fail on web / simulators.
  }
}

export async function presentNow(plan) {
  try {
    await Notifications.scheduleNotificationAsync({
      ...(plan.data?.messageIds?.[0] ? { identifier: String(plan.data.messageIds[0]).slice(0, 64) } : {}),
      content: contentFrom(plan),
      trigger: Platform.OS === 'android' ? { channelId: plan.quiet ? 'zen-quiet' : 'zen-normal' } : null,
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

async function digestNotice(at, plan) {
  if (Platform.OS === 'web') return false;
  try {
    await Notifications.cancelScheduledNotificationAsync(DIGEST_ID);
  } catch {}
  const when = Number(at);
  if (!plan || !Number.isFinite(when) || when <= Date.now()) return false;
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: DIGEST_ID,
      content: contentFrom(plan),
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(when),
        ...(Platform.OS === 'android' ? { channelId: 'zen-normal' } : {}),
      },
    });
    return true;
  } catch {
    return false;
  }
}

export function listenForDigest(onDigest) {
  return Notifications.addNotificationReceivedListener((notification) => {
    if (notification?.request?.content?.data?.kind === 'digest') onDigest();
  });
}

export async function runNotificationEffects(effects) {
  let armedDigest = false;
  for (const effect of effects || []) {
    if (effect.type === 'present') await presentNow(effect.plan);
    else if (effect.type === 'schedule-digest') armedDigest = (await digestNotice(effect.at, effect.plan)) || armedDigest;
    else if (effect.type === 'cancel-digest') await digestNotice();
  }
  return armedDigest;
}
