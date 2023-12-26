'use client';

import { z } from 'zod';

export const newPresetSchema = z.object({
    name: z.string().min(1, 'Required'),
});

export type NewPresetFormValues = z.infer<typeof newPresetSchema>;
