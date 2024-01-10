'use client';

import { z } from 'zod';
import { sessionLevels, sessionTypes } from '../../selectOptions';

export const requestTrainingSchema = z.object({
    start: z.date(),
    end: z.date(),

    type: z.object({
        value: z.number(),
        label: z.string(),
    })
        .refine((object) => sessionTypes.some((type) => (
            type.value === object.value
            && type.label === object.label
        ))),

    level: z.object({
        value: z.number(),
        label: z.string(),
    })
        .refine((object) => sessionLevels.some((level) => (
            level.value === object.value
            && level.label === object.label
        ))),

    remarks: z.string().optional(),
});

export type RequestTrainingFormValues = z.infer<typeof requestTrainingSchema>;
