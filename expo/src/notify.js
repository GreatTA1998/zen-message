import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const DIGEST_ID = 'zen-digest';
/** Generic wake copy — never freeze a per-message plan (#63). */
const wake = () => ({ title: 'Zen Message', body: 'Focus summary ready', quiet: false, data: { kind: 'digest', quiet: false } });

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const quiet = notification?.request?.content?.data?.quiet === true;
    return { shouldPlaySound: !quiet, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true };
  },
});

const contentFrom = (plan) => ({
  title: plan.title, body: plan.body, data: plan.data, sound: plan.quiet ? false : 'default',
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
  } catch { /* web / simulators */ }
}

async function cancelDigest() {
  if (Platform.OS === 'web') return;
  try { await Notifications.cancelScheduledNotificationAsync(DIGEST_ID); } catch {}
}

async function armDigest(at) {
  if (Platform.OS === 'web') return false;
  await cancelDigest();
  const when = Number(at);
  if (!Number.isFinite(when) || when <= Date.now()) return false;
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: DIGEST_ID, content: contentFrom(wake()),
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(when), ...(Platform.OS === 'android' ? { channelId: 'zen-normal' } : {}) },
    });
    return true;
  } catch { return false; }
}

export function listenForDigest(onDigest) {
  return Notifications.addNotificationReceivedListener((notification) => {
    if (notification?.request?.content?.data?.kind === 'digest') onDigest();
  });
}

export async function runNotificationEffects(effects) {
  let armedDigest = false;
  for (const effect of effects || []) {
    if (effect.type === 'present') {
      try {
        const plan = effect.plan;
        await Notifications.scheduleNotificationAsync({
          ...(plan.data?.messageIds?.[0] ? { identifier: String(plan.data.messageIds[0]).slice(0, 64) } : {}),
          content: contentFrom(plan),
          trigger: Platform.OS === 'android' ? { channelId: plan.quiet ? 'zen-quiet' : 'zen-normal' } : null,
        });
      } catch { /* present failed */ }
    } else if (effect.type === 'schedule-digest') armedDigest = (await armDigest(effect.at)) || armedDigest;
    else if (effect.type === 'cancel-digest') await cancelDigest();
  }
  return armedDigest;
}
