'use client';

import { z } from 'zod';

export const roles = [
    { id: 1, value: 'ATM', label: 'Air Traffic Manager' },
    { id: 2, value: 'DATM', label: 'Deputy Air Traffic Manager' },
    { id: 3, value: 'TA', label: 'Training Administrator' },
    { id: 4, value: 'ATA', label: 'Assistant Training Administrator' },
    { id: 5, value: 'FE', label: 'Facility Engineer' },
    { id: 6, value: 'AFE', label: 'Assistant Facility Engineer' },
    { id: 7, value: 'EC', label: 'Events Coordinator' },
    { id: 8, value: 'AEC', label: 'Assistant Events Coordinator' },
    { id: 9, value: 'WM', label: 'Webmaster' },
    { id: 10, value: 'AWM', label: 'Assistant Webmaster' },
    { id: 11, value: 'INS', label: 'Instructor' },
    { id: 12, value: 'MTR', label: 'Mentor' },
    { id: 13, value: 'WEB', label: 'Web Team' },
    { id: 17, value: 'ET', label: 'Events Team' },

    { id: 14, value: 'HC', label: 'Home Controller', isFixed: true, isDisabled: true },
    { id: 15, value: 'VC', label: 'Visiting Controller', isFixed: true, isDisabled: true },
    { id: 16, value: 'MC', label: 'MAVP Controller', isFixed: true, isDisabled: true },
];

export const editUserSchema = z.object({
    first_name: z.string().min(1, 'This field is required'),
    last_name: z.string().min(1, 'This field is required'),

    email: z.string()
        .min(1, 'This field is required')
        .email('Not a valid email address'),

    home_facility: z.string().min(1, 'This field is required'),

    initials: z.string().length(2, 'Initials must be 2 letters'),

    roles: z.array(
        z.object({
            id: z.number(),
            value: z.string(),
            label: z.string(),
            isFixed: z.boolean().optional(),
            isDisabled: z.boolean().optional(),
        })
            .refine((object) => roles.some((role) => (
                role.id === object.id
                    && role.value === object.value
                    && role.label === object.label
                    && role.isFixed === object.isFixed
                    && role.isDisabled === object.isDisabled
            ))),
    ),

    prevent_event_signup: z.boolean(),
    cic_endorsed: z.boolean(),

    endorsements: z.object({
        del: z.boolean().or(z.string()),
        gnd: z.boolean().or(z.string()),
        hou_gnd: z.boolean().or(z.string()),
        iah_gnd: z.boolean().or(z.string()),
        twr: z.boolean().or(z.string()),
        hou_twr: z.boolean().or(z.string()),
        iah_twr: z.boolean().or(z.string()),
        app: z.boolean().or(z.string()),
        i90_app: z.boolean().or(z.string()),
        zhu: z.boolean().or(z.string()),
    }),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;
