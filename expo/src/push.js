import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

export async function readExpoPushToken() {
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId ?? null;
  if (!projectId) return null;
  const current = await Notifications.getPermissionsAsync();
  if (current.status !== 'granted' && (await Notifications.requestPermissionsAsync()).status !== 'granted') return null;
  return (await Notifications.getExpoPushTokenAsync({ projectId })).data ?? null;
}