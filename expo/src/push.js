import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

export async function readExpoPushToken() {
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId ?? null;
  if (!projectId) return null;
  const current = await Notifications.getPermissionsAsync();
  if (current.status !== 'granted') {
    const asked = await Notifications.requestPermissionsAsync();
    if (asked.status !== 'granted') return null;
  }
  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data ?? null;
}
