'use client';

import { z } from 'zod';

export const rejectRequestSchema = z.object({
    reason: z.string().min(1, 'Required'),
});

export type RejectRequestFormValues = z.infer<typeof rejectRequestSchema>;
