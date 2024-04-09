'use client';

import { z } from 'zod';
import { differenceInDays, isAfter } from 'date-fns';

export const requestLoaSchema = z.object({
    start: z.date(),
    end: z.date(),
    remarks: z.string().min(1, 'This field is required'),
})
    .refine(
        (data) => isAfter(data.end, data.start),
        { message: 'Must be after start date', path: ['end'] },
    )
    .refine(
        (data) => differenceInDays(data.end, data.start) >= 30,
        { message: 'Must be at least 30 days', path: ['end'] },
    );

export type RequestLOAFormValues = z.infer<typeof requestLoaSchema>;
