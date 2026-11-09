import { z } from 'zod';

export const announcementSchema = z.object({
    title: z.string().min(1, 'Required').max(128, 'Too long'),

    body: z.string().min(1, 'Required'),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
