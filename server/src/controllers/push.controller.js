import { env } from '../config/env.js';
import { catchAsync } from '../utils/catchAsync.js';
import { isPushConfigured } from '../utils/push.js';
import { PushSubscription } from '../models/PushSubscription.js';

export const getPublicKey = catchAsync(async (_req, res) => {
  res.json({ enabled: isPushConfigured, publicKey: env.vapid.publicKey || null });
});

export const subscribe = catchAsync(async (req, res) => {
  const { endpoint, keys } = req.body;

  // Upsert: a browser re-subscribing (or another user on the same browser)
  // should take over the endpoint instead of erroring on the unique index.
  await PushSubscription.findOneAndUpdate(
    { endpoint },
    { user: req.user._id, endpoint, keys },
    { upsert: true, new: true }
  );

  res.status(201).json({ message: 'Subscribed to notifications' });
});

export const unsubscribe = catchAsync(async (req, res) => {
  await PushSubscription.deleteOne({ endpoint: req.body.endpoint, user: req.user._id });
  res.json({ message: 'Unsubscribed from notifications' });
});
