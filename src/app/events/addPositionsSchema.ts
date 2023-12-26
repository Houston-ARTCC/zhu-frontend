'use client';

import { z } from 'zod';

export const addPositionsSchema = z.object({
    positions: z
        .object({
            callsign: z.string().min(1, 'Required'),
            shifts: z.number({ invalid_type_error: 'Required' }).positive('Must be positive'),
        })
        .array(),
});

export type AddPositionsFormValues = z.infer<typeof addPositionsSchema>;
