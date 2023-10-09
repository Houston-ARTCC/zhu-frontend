'use client';

import { z } from 'zod';

export const supportSchema = z.object({
    name: z.string().min(1, 'Required'),
    host: z.string().min(1, 'Required'),
    banner_url: z.string().min(1, 'Required').url('Must be a URL'),

    start: z.coerce.date(),
    end: z.coerce.date(),

    description: z.string().min(1, 'Required'),
});

export type SupportFormValues = z.infer<typeof supportSchema>;
