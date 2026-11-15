import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

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
    if (current.status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  } catch {
    // Permissions or channels can fail on web / simulators.
  }
}

export async function presentNow(plan) {
  const channelId = plan.quiet ? 'zen-quiet' : 'zen-normal';
  const trigger = Platform.OS === 'android' ? { channelId } : null;
  const id = plan.data?.messageIds?.[0];
  try {
    await Notifications.scheduleNotificationAsync({
      ...(id ? { identifier: String(id).slice(0, 64) } : {}),
      content: contentFrom(plan),
      trigger,
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function listenForDigest(onDigest) {
  return Notifications.addNotificationReceivedListener((notification) => {
    if (notification?.request?.content?.data?.kind === 'digest') onDigest();
  });
}

export async function runNotificationEffects(effects) {
  for (const effect of effects) {
    if (effect.type === 'present') await presentNow(effect.plan);
  }
}
