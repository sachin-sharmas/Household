import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const idParamsSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.any().optional(),
  query: z.any().optional()
});
