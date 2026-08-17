import webpush from 'web-push';
import { env } from '../config/env.js';
import { PushSubscription } from '../models/PushSubscription.js';
import { logger } from './logger.js';

export const isPushConfigured = Boolean(env.vapid.publicKey && env.vapid.privateKey);

if (isPushConfigured) {
  webpush.setVapidDetails(env.vapid.subject, env.vapid.publicKey, env.vapid.privateKey);
}

// Best-effort browser push to every subscription a user has registered.
// Never throws; expired/revoked subscriptions (404/410) are pruned as we go.
export async function sendPushToUser(userId, payload) {
  if (!isPushConfigured) {
    logger.warn('Skipping push notification: VAPID keys are not configured.');
    return;
  }

  const subscriptions = await PushSubscription.find({ user: userId });
  if (!subscriptions.length) return;

  const body = JSON.stringify(payload);

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          { endpoint: subscription.endpoint, keys: subscription.keys },
          body
        );
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          await PushSubscription.deleteOne({ _id: subscription._id }).catch(() => {});
        } else {
          logger.warn(`Failed to send push notification: ${error.message}`);
        }
      }
    })
  );
}
