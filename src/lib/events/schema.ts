import { z } from 'zod';
import { type SelectOption } from '@/components/Forms';

export const newEventSchema = z.object({
    name: z.string().min(1, 'Required'),
    host: z.string().min(1, 'Required'),
    banner: z.string().optional(),
    description: z.string(),

    preset: z.object({
        value: z.number(),
        label: z.string(),
    })
        .optional()
        .nullable(),

    start: z.date(),
    end: z.date(),

    hidden: z.boolean(),
});

export type NewEventFormValues = z.infer<typeof newEventSchema>;

export const editEventSchema = z.object({
    name: z.string().min(1, 'Required'),
    host: z.string().min(1, 'Required'),
    banner: z.string().optional(),
    description: z.string(),

    start: z.date(),
    end: z.date(),

    hidden: z.boolean(),
});

export type EditEventFormValues = z.infer<typeof editEventSchema>;

export const addPositionsSchema = z.object({
    positions: z
        .object({
            callsign: z.string().min(1, 'Required'),
            shifts: z.number({ error: 'Required' }).positive('Must be positive'),
        })
        .array(),
});

export type AddPositionsFormValues = z.infer<typeof addPositionsSchema>;

export const manualAssignSchema = z.object({
    controller: z.object({
        value: z.number(),
        label: z.string(),
    }),
});

export type ManualAssignFormValues = z.infer<typeof manualAssignSchema>;

export const newPresetSchema = z.object({
    name: z.string().min(1, 'Required'),
});

export type NewPresetFormValues = z.infer<typeof newPresetSchema>;

export const supportSchema = z.object({
    name: z.string().min(1, 'Required'),
    host: z.string().min(1, 'Required'),
    banner_url: z.string().min(1, 'Required').url('Must be a URL'),

    start: z.coerce.date<Date>(),
    end: z.coerce.date<Date>(),

    requested_fields: z.array(
        z.object({
            value: z.string(),
            label: z.string(),
        }),
    ),

    description: z.string().min(1, 'Required'),
});

export type SupportFormValues = z.infer<typeof supportSchema>;

export const airports: SelectOption<string>[] = [
    { value: 'KIAH', label: 'Houston/George Bush Intercontinental' },
    { value: 'KAUS', label: 'Austin-Bergstrom International' },
    { value: 'KMSY', label: 'Louis Armstrong New Orleans International' },

    { value: 'KAEX', label: 'Alexandria International' },
    { value: 'KARA', label: 'Acadiana Regional' },
    { value: 'KBAZ', label: 'New Braunfels Natl' },
    { value: 'KBFM', label: 'Mobile International' },
    { value: 'KBIX', label: 'Keesler AFB' },
    { value: 'KBPT', label: 'Jack Brooks Regional' },
    { value: 'KBRO', label: 'Brownsville/South Padre Island International' },
    { value: 'KBTR', label: 'Baton Rouge Metro/Ryan Field' },
    { value: 'KCLL', label: 'Easterwood Field' },
    { value: 'KCRP', label: 'Corpus Christi International' },
    { value: 'KCWF', label: 'Chennault International' },
    { value: 'KCXO', label: 'Conroe/North Houston Regional' },
    { value: 'KDLF', label: 'Laughlin AFB' },
    { value: 'KDWH', label: 'David Wayne Hooks Memorial' },
    { value: 'KEDC', label: 'Austin Executive' },
    { value: 'KEFD', label: 'Ellington' },
    { value: 'KGLS', label: 'Galveston/Scholes International' },
    { value: 'KGPT', label: 'Gulfport-Biloxi International' },
    { value: 'KGTU', label: 'Georgetown Executive' },
    { value: 'KHDC', label: 'Hammond Northshore Regional' },
    { value: 'KHOU', label: 'William P Hobby' },
    { value: 'KHRL', label: 'Valley International' },
    { value: 'KHSA', label: 'Stennis International' },
    { value: 'KHUM', label: 'Houma-Terrebonne' },
    { value: 'KHYI', label: 'San Marcos Regional' },
    { value: 'KLCH', label: 'Lake Charles Regional' },
    { value: 'KLFT', label: 'Lafayette Regional' },
    { value: 'KLRD', label: 'Laredo International' },
    { value: 'KMFE', label: 'McAllen Miller International' },
    { value: 'KMOB', label: 'Mobile Regional' },
    { value: 'KNBG', label: 'Alvin Callender Field/New Orleans NAS' },
    { value: 'KNEW', label: 'Lakefront' },
    { value: 'KNGP', label: 'Corpus Christi NAS/Traux Field' },
    { value: 'KNGW', label: 'Cabaniss Field Nolf' },
    { value: 'KNOG', label: 'Orange Grove Nalf' },
    { value: 'KNQI', label: 'Kingsville NAS' },
    { value: 'KPOE', label: 'Polk AAF' },
    { value: 'KPQL', label: 'Trent Lott International' },
    { value: 'KRND', label: 'Randolph AFB' },
    { value: 'KSAT', label: 'San Antonio International' },
    { value: 'KSGR', label: 'Sugar Land Regional' },
    { value: 'KSKF', label: 'Kelly Field' },
    { value: 'KSSF', label: 'Stinson Municipal' },
    { value: 'KTME', label: 'Houston Executive' },
    { value: 'KVCT', label: 'Victoria Regional' },
];
