import { z } from 'zod';
import { ROLES } from '../constants/index.js';
import { phoneSchema } from './auth.validators.js';
import { dateFilterEnum, statusEnum } from './items.validators.js';
import { objectIdSchema } from './common.validators.js';

export const adminListItemsSchema = z.object({
  query: z.object({
    search: z.string().trim().optional().default(''),
    status: statusEnum.optional(),
    dateFilter: dateFilterEnum.default('all'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20)
  }),
  body: z.any().optional(),
  params: z.any().optional()
});

export const adminCreateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.string().trim().email('A valid email is required'),
    phone: phoneSchema.optional().default(''),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(Object.values(ROLES)).optional().default(ROLES.USER)
  }),
  query: z.any().optional(),
  params: z.any().optional()
});

export const adminUpdateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').optional(),
    email: z.string().trim().email('A valid email is required').optional(),
    phone: phoneSchema.optional().or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: z.enum(Object.values(ROLES)).optional()
  }),
  query: z.any().optional(),
  params: z.object({ id: objectIdSchema })
});
