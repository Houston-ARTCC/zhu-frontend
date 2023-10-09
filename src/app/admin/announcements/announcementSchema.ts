'use client';

import { z } from 'zod';

export const announcementSchema = z.object({
    title: z.string().min(1, 'Required'),

    body: z.string().min(1, 'Required'),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
