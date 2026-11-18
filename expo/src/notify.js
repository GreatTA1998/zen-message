import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const DIGEST_ID = 'zen-digest';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const quiet = notification?.request?.content?.data?.quiet === true;
    return { shouldPlaySound: !quiet, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true };
  },
});

function contentFrom(plan) {
  const quiet = plan.quiet;
  return {
    title: plan.title,
    body: plan.body,
    data: plan.data,
    sound: quiet ? false : 'default',
    interruptionLevel: quiet ? 'passive' : 'active',
    priority: quiet ? Notifications.AndroidNotificationPriority.LOW : Notifications.AndroidNotificationPriority.HIGH,
  };
}

export async function prepareNotifications() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('zen-normal', { name: 'Messages', importance: Notifications.AndroidImportance.HIGH, sound: 'default' });
      await Notifications.setNotificationChannelAsync('zen-quiet', { name: 'Quiet messages', importance: Notifications.AndroidImportance.LOW, sound: null, enableVibrate: false });
    }
    const current = await Notifications.getPermissionsAsync();
    if (current.status !== 'granted') await Notifications.requestPermissionsAsync();
  } catch {
    // Permissions or channels can fail on web / simulators.
  }
}

async function presentNow(plan) {
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

async function cancelDigest() {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelScheduledNotificationAsync(DIGEST_ID);
  } catch {}
}

export function listenForDigest(onDigest) {
  return Notifications.addNotificationReceivedListener((notification) => {
    if (notification?.request?.content?.data?.kind === 'digest') onDigest();
  });
}

export async function runNotificationEffects(effects) {
  for (const effect of effects || []) {
    if (effect.type === 'present') await presentNow(effect.plan);
    else if (effect.type === 'cancel-digest') await cancelDigest();
  }
}