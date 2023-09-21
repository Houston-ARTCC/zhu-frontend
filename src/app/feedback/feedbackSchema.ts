'use client';

import { z } from 'zod';

export const feedbackSchema = z.object({
    controller: z.number().optional(),

    controller_callsign: z.string().optional(),

    event: z.number().optional(),

    pilot_callsign: z.string().optional(),

    rating: z.number().min(1).max(5),

    comments: z.string().min(1, 'Required'),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
