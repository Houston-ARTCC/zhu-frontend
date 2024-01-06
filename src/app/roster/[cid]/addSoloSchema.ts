'use client';

import { z } from 'zod';

export const addSoloSchema = z.object({
    position: z.string().min(1, 'This field is required'),
});

export type AddSoloFormValues = z.infer<typeof addSoloSchema>;
