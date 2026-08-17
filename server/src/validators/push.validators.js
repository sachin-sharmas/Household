import { z } from 'zod';

export const subscribeSchema = z.object({
  body: z.object({
    endpoint: z.string().url('A valid subscription endpoint is required'),
    keys: z.object({
      p256dh: z.string().min(1, 'p256dh key is required'),
      auth: z.string().min(1, 'auth key is required')
    })
  }),
  query: z.any().optional(),
  params: z.any().optional()
});

export const unsubscribeSchema = z.object({
  body: z.object({
    endpoint: z.string().url('A valid subscription endpoint is required')
  }),
  query: z.any().optional(),
  params: z.any().optional()
});
