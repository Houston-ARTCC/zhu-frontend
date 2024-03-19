'use client';

import { z } from 'zod';
import { otsStatuses, progress, sessionLevels, sessionTypes } from '../../selectOptions';

export const sessionSchema = z.object({
    instructor: z.object({
        value: z.number(),
        label: z.string(),
    }),

    start: z.coerce.date(),
    end: z.coerce.date(),

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

    ots_status: z.object({
        value: z.number(),
        label: z.string(),
    })
        .refine((object) => otsStatuses.some((level) => (
            level.value === object.value
            && level.label === object.label
        ))),

    progress: z.object({
        value: z.number(),
        label: z.string(),
    })
        .refine((object) => progress.some((level) => (
            level.value === object.value
            && level.label === object.label
        ))),

    movements: z.number().nonnegative('May not be negative'),

    position: z.string(),

    notes: z.string(),

    solo_granted: z.boolean(),
});

export type SessionFormValues = z.infer<typeof sessionSchema>;
