import express from 'express';
import { createItem, deleteItem, getItemStats, listItems, updateItem } from '../controllers/items.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { itemIdParamsSchema } from '../validators/items.validators.js';
import { createItemSchema, itemStatsSchema, listItemsSchema, updateItemSchema } from '../validators/items.validators.js';

export const itemsRouter = express.Router();

itemsRouter.use(requireAuth);

itemsRouter.get('/', validate(listItemsSchema), listItems);
itemsRouter.get('/stats', validate(itemStatsSchema), getItemStats);
itemsRouter.post('/', validate(createItemSchema), createItem);
itemsRouter.put('/:id', validate(updateItemSchema), updateItem);
itemsRouter.delete('/:id', validate(itemIdParamsSchema), deleteItem);
