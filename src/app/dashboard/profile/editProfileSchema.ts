'use client';

import { z } from 'zod';

export const editProfileSchema = z.object({
    biography: z.string(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
