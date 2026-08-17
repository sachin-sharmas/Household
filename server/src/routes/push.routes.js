import express from 'express';
import { getPublicKey, subscribe, unsubscribe } from '../controllers/push.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { subscribeSchema, unsubscribeSchema } from '../validators/push.validators.js';

export const pushRouter = express.Router();

pushRouter.use(requireAuth);

pushRouter.get('/public-key', getPublicKey);
pushRouter.post('/subscribe', validate(subscribeSchema), subscribe);
pushRouter.post('/unsubscribe', validate(unsubscribeSchema), unsubscribe);
