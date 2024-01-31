'use client';

import { z } from 'zod';

export const requestLoaSchema = z.object({
    start: z.date(),
    end: z.date(),
    remarks: z.string().min(1, 'This field is required'),
});

export type RequestLOAFormValues = z.infer<typeof requestLoaSchema>;
