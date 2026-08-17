import { pushApi } from '../api/push.api.js';

export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
}

export async function getPushSubscription() {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return null;
  return registration.pushManager.getSubscription();
}

export async function enablePush() {
  const { enabled, publicKey } = await pushApi.publicKey();
  if (!enabled) {
    throw new Error('Notifications are not configured on the server.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notifications are blocked. Allow them for this site in your browser settings.');
  }

  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  await pushApi.subscribe(subscription.toJSON());
}

export async function disablePush() {
  const subscription = await getPushSubscription();
  if (!subscription) return;

  await pushApi.unsubscribe(subscription.endpoint).catch(() => {});
  await subscription.unsubscribe();
}
