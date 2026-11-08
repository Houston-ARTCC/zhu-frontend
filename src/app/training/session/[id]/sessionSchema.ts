'use client';

import { z } from 'zod';
import { SessionType } from '@/types/training';
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
})
    .superRefine(({ type, position }, ctx) => {
        if (type.value === SessionType.Classroom && position === '') return;
        // Matches VATUSA's CTRS validation, which rejects the whole filing otherwise.
        if (/^[A-Z0-9]{2,3}(_[A-Z0-9]{1,3})?_(DEL|GND|TWR|APP|DEP|CTR|FSS)$/i.test(position)) return;
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['position'],
            message: 'Enter a position like HOU_GND or I90_D_APP',
        });
    })
    .transform((values) => ({ ...values, position: values.position || 'ZHU_GND' }));

export type SessionFormInput = z.input<typeof sessionSchema>;
export type SessionFormValues = z.infer<typeof sessionSchema>;
