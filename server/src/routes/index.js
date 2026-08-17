import express from 'express';
import { adminRouter } from './admin.routes.js';
import { authRouter } from './auth.routes.js';
import { itemsRouter } from './items.routes.js';
import { pushRouter } from './push.routes.js';
import { usersRouter } from './users.routes.js';

export const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/items', itemsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/push', pushRouter);
apiRouter.use('/admin', adminRouter);
