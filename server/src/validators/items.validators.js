import { z } from 'zod';
import { ITEM_STATUSES } from '../constants/index.js';
import { objectIdSchema } from './common.validators.js';

export const statusEnum = z.enum(Object.values(ITEM_STATUSES));
const scopeEnum = z.enum(['all', 'mine', 'assigned']);
export const dateFilterEnum = z.enum(['all', 'today', 'yesterday', 'twoDaysAgo', 'week', 'month']);

export const listItemsSchema = z.object({
  query: z.object({
    search: z.string().trim().optional().default(''),
    status: statusEnum.optional(),
    scope: scopeEnum.default('all'),
    dateFilter: dateFilterEnum.default('all'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20)
  }),
  body: z.any().optional(),
  params: z.any().optional()
});

export const itemStatsSchema = z.object({
  query: z.object({
    scope: scopeEnum.default('all')
  }),
  body: z.any().optional(),
  params: z.any().optional()
});

export const createItemSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    category: z.string().trim().min(1, 'Category is required'),
    quantity: z.string().trim().min(1, 'Quantity is required'),
    assignedTo: objectIdSchema,
    notes: z.string().trim().optional().default(''),
    status: statusEnum.optional().default(ITEM_STATUSES.PENDING)
  }),
  query: z.any().optional(),
  params: z.any().optional()
});

export const updateItemSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).optional(),
      category: z.string().trim().min(1).optional(),
      quantity: z.string().trim().min(1).optional(),
      assignedTo: objectIdSchema.optional(),
      notes: z.string().trim().optional(),
      status: statusEnum.optional()
    })
    .refine((data) => Object.keys(data).length > 0, { message: 'At least one field is required' }),
  params: z.object({ id: objectIdSchema }),
  query: z.any().optional()
});

export const itemIdParamsSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.any().optional(),
  query: z.any().optional()
});
