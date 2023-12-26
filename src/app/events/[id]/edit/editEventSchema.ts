'use client';

import { z } from 'zod';

export const editEventSchema = z.object({
    name: z.string().min(1, 'Required'),
    host: z.string().min(1, 'Required'),
    banner: z.string(),
    description: z.string(),

    start: z.date(),
    end: z.date(),

    hidden: z.boolean(),
});

export type EditEventFormValues = z.infer<typeof editEventSchema>;
