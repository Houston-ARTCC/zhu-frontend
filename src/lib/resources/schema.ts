import { z } from 'zod';
import { CATEGORY_STRING } from '@/types/resources';

export const resourceSchema = z.object({
    name: z.string().min(1, 'Required').max(128, 'Too long'),
    category: z.enum(Object.keys(CATEGORY_STRING) as [string, ...string[]], { error: 'Invalid category' }),
});

export type ResourceInput = z.infer<typeof resourceSchema>;
