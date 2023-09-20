'use client';

import { z } from 'zod';

export const visitSchema = z.object({
    reason: z.string().min(1, 'Required'),

    agreeEmail: z.boolean()
        .refine((val) => val, 'You must agree to continue'),

    agreePrivacy: z.boolean()
        .refine((val) => val, 'You must agree to continue'),
});

export type VisitFormValues = z.infer<typeof visitSchema>;
