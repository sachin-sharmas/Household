import express from 'express';
import { createUser, getStats, listAllItems, listUsers, removeUser, updateUser } from '../controllers/admin.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { adminCreateUserSchema, adminListItemsSchema, adminUpdateUserSchema } from '../validators/admin.validators.js';
import { idParamsSchema } from '../validators/common.validators.js';

export const adminRouter = express.Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/users', listUsers);
adminRouter.post('/users', validate(adminCreateUserSchema), createUser);
adminRouter.patch('/users/:id', validate(adminUpdateUserSchema), updateUser);
adminRouter.delete('/users/:id', validate(idParamsSchema), removeUser);
adminRouter.get('/items', validate(adminListItemsSchema), listAllItems);
adminRouter.get('/stats', getStats);
