import express from 'express';
import { listUsers } from '../controllers/users.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const usersRouter = express.Router();

usersRouter.use(requireAuth);

usersRouter.get('/', listUsers);
