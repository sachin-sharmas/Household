import { z } from 'zod';

export const phoneSchema = z
  .string()
  .trim()
  .min(7, 'A valid phone number is required')
  .max(20, 'Phone number is too long')
  .regex(/^[+\d][\d\s-]*$/, 'Enter a valid phone number');

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.string().trim().email('A valid email is required'),
    phone: phoneSchema,
    password: z.string().min(6, 'Password must be at least 6 characters')
  }),
  query: z.any().optional(),
  params: z.any().optional()
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('A valid email is required'),
    password: z.string().min(1, 'Password is required')
  }),
  query: z.any().optional(),
  params: z.any().optional()
});
