'use client';

import { z } from 'zod';
import { CATEGORY_STRING } from '@/types/resources';

export const resourceSchema = z.object({
    name: z.string().min(1, 'This field is required'),

    category: z.object({
        value: z.enum(
            Object.keys(CATEGORY_STRING) as [string, ...string[]],
            { errorMap: () => ({ message: 'Invalid category' }) },
        ),
        label: z.string(),
    }, { required_error: 'This field is required' }),

    path: z.union([
        z.instanceof(File, { message: 'This field is required' }),
        z.string(),
    ]),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;
