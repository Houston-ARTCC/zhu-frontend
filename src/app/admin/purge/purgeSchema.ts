'use client';

import { z } from 'zod';

export const purgeSchema = z.object({
    reason: z.string().min(1, 'Required'),

    agree: z.boolean()
        .refine((val) => val, 'You must agree to continue'),
});

export type PurgeFormValues = z.infer<typeof purgeSchema>;
