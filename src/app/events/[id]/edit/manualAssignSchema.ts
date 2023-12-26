'use client';

import { z } from 'zod';

export const manualAssignSchema = z.object({
    controller: z.object({
        value: z.number(),
        label: z.string(),
    }),
});

export type ManualAssignFormValues = z.infer<typeof manualAssignSchema>;
