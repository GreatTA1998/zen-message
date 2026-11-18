import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const DIGEST_ID = 'zen-digest';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const quiet = notification?.request?.content?.data?.quiet === true;
    return { shouldPlaySound: !quiet, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true };
  },
});

const contentFrom = (plan) => ({
  title: plan.title,
  body: plan.body,
  data: plan.data,
  sound: plan.quiet ? false : 'default',
  interruptionLevel: plan.quiet ? 'passive' : 'active',
  priority: plan.quiet ? Notifications.AndroidNotificationPriority.LOW : Notifications.AndroidNotificationPriority.HIGH,
});

export async function prepareNotifications() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('zen-normal', { name: 'Messages', importance: Notifications.AndroidImportance.HIGH, sound: 'default' });
      await Notifications.setNotificationChannelAsync('zen-quiet', { name: 'Quiet messages', importance: Notifications.AndroidImportance.LOW, sound: null, enableVibrate: false });
    }
    if ((await Notifications.getPermissionsAsync()).status !== 'granted') await Notifications.requestPermissionsAsync();
  } catch {
    /* web / simulators */
  }
}

export function listenForDigest(onDigest) {
  return Notifications.addNotificationReceivedListener((notification) => {
    if (notification?.request?.content?.data?.kind === 'digest') onDigest();
  });
}

export async function runNotificationEffects(effects) {
  for (const effect of effects || []) {
    if (effect.type === 'present') {
      try {
        const plan = effect.plan;
        await Notifications.scheduleNotificationAsync({
          ...(plan.data?.messageIds?.[0] ? { identifier: String(plan.data.messageIds[0]).slice(0, 64) } : {}),
          content: contentFrom(plan),
          trigger: Platform.OS === 'android' ? { channelId: plan.quiet ? 'zen-quiet' : 'zen-normal' } : null,
        });
      } catch {
        /* present failed */
      }
    } else if (effect.type === 'cancel-digest' && Platform.OS !== 'web') {
      try {
        await Notifications.cancelScheduledNotificationAsync(DIGEST_ID);
      } catch {}
    }
  }
}