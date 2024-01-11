'use client';

import { z } from 'zod';

export const newEventSchema = z.object({
    name: z.string().min(1, 'Required'),
    host: z.string().min(1, 'Required'),
    banner: z.string(),
    description: z.string(),

    preset: z.object({
        value: z.number(),
        label: z.string(),
    })
        .optional()
        .nullable(),

    start: z.date(),
    end: z.date(),

    hidden: z.boolean(),
});

export type NewEventFormValues = z.infer<typeof newEventSchema>;
