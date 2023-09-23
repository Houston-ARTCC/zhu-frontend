'use client';

import { z } from 'zod';

export const feedbackSchema = z.object({
    controller: z.object({
        value: z.number().nullable(),
        label: z.string(),
    }),

    controller_callsign: z.string().optional(),

    event: z.object({
        value: z.number(),
        label: z.string(),
    })
        .optional(),

    pilot_callsign: z.string().optional(),

    rating: z.number().min(1).max(5),

    comments: z.string().min(1, 'Required'),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
