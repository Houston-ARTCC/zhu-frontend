'use server';

import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import {
    eventsEvent,
    eventsEventposition,
    eventsPositionpreset,
    eventsPositionshift,
    eventsShiftrequest,
    eventsSupportrequest,
    usersUser,
} from '@/lib/db/schema';
import { requireMember, requireStaff } from '@/lib/auth/guards';
import { logCreate, logDelete, logUpdate } from '@/lib/auditlog/log';
import { postEventsWebhook } from '@/lib/discord/webhook';

const EVENT_MODEL = { appLabel: 'events', modelName: 'event' };

const HOUSTON_BASE = 'https://houston.center';
const EMBED_COLOR = 0x109cf1;

const createSchema = z.object({
    name: z.string().min(1).max(128),
    host: z.string().min(1).max(64),
    banner: z.string().optional().nullable(),
    start: z.string(),
    end: z.string(),
    description: z.string().optional().nullable(),
    hidden: z.boolean(),
    preset: z.number().int().optional(),
});

const updateSchema = z.object({
    name: z.string().min(1).max(128).optional(),
    host: z.string().min(1).max(64).optional(),
    banner: z.string().optional().nullable(),
    start: z.string().optional(),
    end: z.string().optional(),
    description: z.string().optional().nullable(),
    hidden: z.boolean().optional(),
});

export type CreateEventInput = z.infer<typeof createSchema>;
export type UpdateEventInput = z.infer<typeof updateSchema>;

function formatZ(iso: string): string {
    const d = new Date(iso);
    const mon = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const day = String(d.getUTCDate()).padStart(2, '0');
    const year = d.getUTCFullYear();
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mm = String(d.getUTCMinutes()).padStart(2, '0');
    return `${mon} ${day}, ${year} @ ${hh}${mm}z`;
}

export async function createEvent(input: CreateEventInput): Promise<number> {
    const session = await requireStaff();
    const data = createSchema.parse(input);

    const [row] = await db
        .insert(eventsEvent)
        .values({
            name: data.name,
            host: data.host,
            banner: data.banner ?? null,
            start: data.start,
            end: data.end,
            description: data.description ?? null,
            hidden: data.hidden,
        })
        .returning();

    await logCreate(EVENT_MODEL, row as Record<string, unknown>, session.user.cid);

    if (data.preset !== undefined) {
        const [preset] = await db
            .select()
            .from(eventsPositionpreset)
            .where(eq(eventsPositionpreset.id, data.preset));

        if (preset) {
            const positions = preset.positions as { callsign: string; shifts: number }[];
            for (const p of positions) {
                const [position] = await db
                    .insert(eventsEventposition)
                    .values({ eventId: row.id, callsign: p.callsign })
                    .returning();

                for (let i = 0; i < Math.floor(p.shifts); i++) {
                    await db.insert(eventsPositionshift).values({ positionId: position.id, userId: null });
                }
            }
        }
    }

    if (!data.hidden) {
        const url = `${HOUSTON_BASE}/events/${row.id}`;
        await postEventsWebhook({
            embeds: [
                {
                    title: `:calendar: ${row.name}`,
                    description: `${row.description ?? ''}\n**[Sign up for the event here!](${url})**`,
                    color: EMBED_COLOR,
                    fields: [
                        {
                            name: 'Start & End',
                            value: `${formatZ(row.start)} - ${formatZ(row.end)}`,
                            inline: false,
                        },
                        {
                            name: 'Presented by',
                            value: row.host,
                        },
                    ],
                    ...(row.banner ? { image: { url: row.banner } } : {}),
                },
            ],
        });
    }

    revalidatePath('/events');
    revalidatePath('/admin/events');

    return row.id;
}

export async function updateEvent(id: number, input: UpdateEventInput): Promise<void> {
    const session = await requireStaff();
    const data = updateSchema.parse(input);

    const [before] = await db.select().from(eventsEvent).where(eq(eventsEvent.id, id));

    if (!before) {
        throw new Error(`Event ${id} not found`);
    }

    const [row] = await db
        .update(eventsEvent)
        .set({
            ...(data.name !== undefined ? { name: data.name } : {}),
            ...(data.host !== undefined ? { host: data.host } : {}),
            ...('banner' in data ? { banner: data.banner ?? null } : {}),
            ...(data.start !== undefined ? { start: data.start } : {}),
            ...(data.end !== undefined ? { end: data.end } : {}),
            ...('description' in data ? { description: data.description ?? null } : {}),
            ...(data.hidden !== undefined ? { hidden: data.hidden } : {}),
        })
        .where(eq(eventsEvent.id, id))
        .returning();

    if (!row) {
        throw new Error(`Event ${id} not found`);
    }

    await logUpdate(EVENT_MODEL, before as Record<string, unknown>, row as Record<string, unknown>, session.user.cid);

    // Fire webhook when event transitions from hidden to visible.
    if (before.hidden && !row.hidden) {
        const url = `${HOUSTON_BASE}/events/${row.id}`;
        await postEventsWebhook({
            embeds: [
                {
                    title: `:calendar: ${row.name}`,
                    description: `${row.description ?? ''}\n**[Sign up for the event here!](${url})**`,
                    color: EMBED_COLOR,
                    fields: [
                        {
                            name: 'Start & End',
                            value: `${formatZ(row.start)} - ${formatZ(row.end)}`,
                            inline: false,
                        },
                        {
                            name: 'Presented by',
                            value: row.host,
                        },
                    ],
                    ...(row.banner ? { image: { url: row.banner } } : {}),
                },
            ],
        });
    }

    revalidatePath('/events');
    revalidatePath(`/events/${id}`);
    revalidatePath('/admin/events');
}

export async function deleteEvent(id: number): Promise<void> {
    const session = await requireStaff();

    const [row] = await db.select().from(eventsEvent).where(eq(eventsEvent.id, id));

    if (!row) {
        throw new Error(`Event ${id} not found`);
    }

    await db.delete(eventsEvent).where(eq(eventsEvent.id, id));

    await logDelete(EVENT_MODEL, row as Record<string, unknown>, session.user.cid);

    revalidatePath('/events');
    revalidatePath('/admin/events');
}

export async function postEventPositionsAnnouncement(id: number): Promise<void> {
    await requireStaff();

    const [event] = await db.select().from(eventsEvent).where(eq(eventsEvent.id, id));

    if (!event) {
        throw new Error(`Event ${id} not found`);
    }

    const positions = await db
        .select()
        .from(eventsEventposition)
        .where(eq(eventsEventposition.eventId, id));

    const fields: { name: string; value: string }[] = [];

    for (const position of positions) {
        const shifts = await db
            .select({
                userId: eventsPositionshift.userId,
                firstName: usersUser.firstName,
                lastName: usersUser.lastName,
            })
            .from(eventsPositionshift)
            .leftJoin(usersUser, eq(eventsPositionshift.userId, usersUser.cid))
            .where(eq(eventsPositionshift.positionId, position.id));

        const lines = shifts.map((s, i) => {
            if (s.userId !== null && s.firstName !== null && s.lastName !== null) {
                return `\`${i + 1}\` *${s.firstName} ${s.lastName}*`;
            }
            return `\`${i + 1}\``;
        });

        fields.push({
            name: position.callsign,
            value: lines.join('\n') || 'No shifts assigned',
        });
    }

    const url = `${HOUSTON_BASE}/events/${event.id}`;
    await postEventsWebhook({
        embeds: [
            {
                title: `:calendar: "${event.name}"`,
                description:
                    'Below are the tentative event position assignments as they currently stand. Assignments are'
                    + 'subject to change on the day of the event so you should always double check the event page'
                    + `before logging on to control.\n**[View the event page here!](${url})**`,
                color: EMBED_COLOR,
                fields,
                ...(event.banner ? { image: { url: event.banner } } : {}),
            },
        ],
    });
}

const addPositionsSchema = z.array(z.object({
    callsign: z.string().min(1).max(16),
    shifts: z.number().int().min(0),
}));

export async function addPositions(eventId: number, input: z.infer<typeof addPositionsSchema>): Promise<void> {
    await requireStaff();
    const positions = addPositionsSchema.parse(input);
    for (const p of positions) {
        const [pos] = await db
            .insert(eventsEventposition)
            .values({ eventId, callsign: p.callsign })
            .returning();
        if (p.shifts > 0) {
            await db.insert(eventsPositionshift).values(
                Array.from({ length: p.shifts }, () => ({ positionId: pos.id, userId: null })),
            );
        }
    }
    revalidatePath(`/events/${eventId}/edit`);
    revalidatePath(`/events/${eventId}`);
}

export async function deletePosition(positionId: number): Promise<void> {
    await requireStaff();
    const [pos] = await db
        .select({ eventId: eventsEventposition.eventId })
        .from(eventsEventposition)
        .where(eq(eventsEventposition.id, positionId));
    if (!pos) return;
    await db.delete(eventsEventposition).where(eq(eventsEventposition.id, positionId));
    revalidatePath(`/events/${pos.eventId}/edit`);
    revalidatePath(`/events/${pos.eventId}`);
}

export async function appendShift(positionId: number): Promise<void> {
    await requireStaff();
    await db.insert(eventsPositionshift).values({ positionId, userId: null });
    const [pos] = await db
        .select({ eventId: eventsEventposition.eventId })
        .from(eventsEventposition)
        .where(eq(eventsEventposition.id, positionId));
    if (pos) {
        revalidatePath(`/events/${pos.eventId}/edit`);
        revalidatePath(`/events/${pos.eventId}`);
    }
}

export async function deleteShift(shiftId: number): Promise<void> {
    await requireStaff();
    const [shift] = await db
        .select({ positionId: eventsPositionshift.positionId })
        .from(eventsPositionshift)
        .where(eq(eventsPositionshift.id, shiftId));
    if (!shift) return;
    await db.delete(eventsPositionshift).where(eq(eventsPositionshift.id, shiftId));
    const [pos] = await db
        .select({ eventId: eventsEventposition.eventId })
        .from(eventsEventposition)
        .where(eq(eventsEventposition.id, shift.positionId));
    if (pos) {
        revalidatePath(`/events/${pos.eventId}/edit`);
        revalidatePath(`/events/${pos.eventId}`);
    }
}

export async function assignShift(shiftId: number, userCid: number | null): Promise<void> {
    await requireStaff();
    await db
        .update(eventsPositionshift)
        .set({ userId: userCid })
        .where(eq(eventsPositionshift.id, shiftId));
    if (userCid !== null) {
        await db.delete(eventsShiftrequest).where(eq(eventsShiftrequest.shiftId, shiftId));
    }
    const [shift] = await db
        .select({ positionId: eventsPositionshift.positionId })
        .from(eventsPositionshift)
        .where(eq(eventsPositionshift.id, shiftId));
    if (shift) {
        const [pos] = await db
            .select({ eventId: eventsEventposition.eventId })
            .from(eventsEventposition)
            .where(eq(eventsEventposition.id, shift.positionId));
        if (pos) {
            revalidatePath(`/events/${pos.eventId}/edit`);
            revalidatePath(`/events/${pos.eventId}`);
        }
    }
}

export async function requestShift(shiftId: number): Promise<void> {
    const session = await requireMember();
    const [user] = await db
        .select({ preventEventSignup: usersUser.preventEventSignup })
        .from(usersUser)
        .where(eq(usersUser.cid, session.user.cid));
    if (user?.preventEventSignup) {
        throw new Error('You are not allowed to sign up for event shifts');
    }
    const [shiftRow] = await db
        .select({ positionId: eventsPositionshift.positionId, eventId: eventsEventposition.eventId, hidden: eventsEvent.hidden })
        .from(eventsPositionshift)
        .innerJoin(eventsEventposition, eq(eventsEventposition.id, eventsPositionshift.positionId))
        .innerJoin(eventsEvent, eq(eventsEvent.id, eventsEventposition.eventId))
        .where(eq(eventsPositionshift.id, shiftId));
    if (shiftRow?.hidden && !session.user.permissions.is_staff) {
        throw new Error('You do not have permission to interact with this event');
    }
    const existing = await db
        .select({ id: eventsShiftrequest.id })
        .from(eventsShiftrequest)
        .where(and(eq(eventsShiftrequest.shiftId, shiftId), eq(eventsShiftrequest.userId, session.user.cid)));
    if (existing.length === 0) {
        await db.insert(eventsShiftrequest).values({ shiftId, userId: session.user.cid });
    }
    if (shiftRow) revalidatePath(`/events/${shiftRow.eventId}`);
}

export async function unrequestShift(shiftId: number): Promise<void> {
    const session = await requireMember();
    const [shiftRow] = await db
        .select({ positionId: eventsPositionshift.positionId, eventId: eventsEventposition.eventId, hidden: eventsEvent.hidden })
        .from(eventsPositionshift)
        .innerJoin(eventsEventposition, eq(eventsEventposition.id, eventsPositionshift.positionId))
        .innerJoin(eventsEvent, eq(eventsEvent.id, eventsEventposition.eventId))
        .where(eq(eventsPositionshift.id, shiftId));
    if (shiftRow?.hidden && !session.user.permissions.is_staff) {
        throw new Error('You do not have permission to interact with this event');
    }
    await db.delete(eventsShiftrequest).where(
        and(eq(eventsShiftrequest.shiftId, shiftId), eq(eventsShiftrequest.userId, session.user.cid)),
    );
    if (shiftRow) revalidatePath(`/events/${shiftRow.eventId}`);
}

const PRESET_MODEL = { appLabel: 'events', modelName: 'positionpreset' };

const presetPositionsSchema = z.array(z.object({
    callsign: z.string().min(1).max(16),
    shifts: z.number().int().min(0),
}));

export async function createPreset(input: { name: string }): Promise<number> {
    const session = await requireStaff();
    const name = z.string().min(1).max(64).parse(input.name);

    const [row] = await db.insert(eventsPositionpreset)
        .values({ name, positions: [] })
        .returning();

    await logCreate(PRESET_MODEL, row as Record<string, unknown>, session.user.cid);

    revalidatePath('/events/presets');
    return row.id;
}

export async function updatePresetPositions(id: number, positions: { callsign: string; shifts: number }[]): Promise<void> {
    const session = await requireStaff();
    const validated = presetPositionsSchema.parse(positions);

    const [before] = await db.select().from(eventsPositionpreset).where(eq(eventsPositionpreset.id, id));
    if (!before) {
        throw new Error(`Preset ${id} not found`);
    }

    const [after] = await db.update(eventsPositionpreset)
        .set({ positions: validated })
        .where(eq(eventsPositionpreset.id, id))
        .returning();

    await logUpdate(PRESET_MODEL, before as Record<string, unknown>, after as Record<string, unknown>, session.user.cid);

    revalidatePath('/events/presets');
}

export async function deletePreset(id: number): Promise<void> {
    const session = await requireStaff();

    const [row] = await db.select().from(eventsPositionpreset).where(eq(eventsPositionpreset.id, id));
    if (!row) {
        throw new Error(`Preset ${id} not found`);
    }

    await db.delete(eventsPositionpreset).where(eq(eventsPositionpreset.id, id));

    await logDelete(PRESET_MODEL, row as Record<string, unknown>, session.user.cid);

    revalidatePath('/events/presets');
}

const SUPPORT_MODEL = { appLabel: 'events', modelName: 'supportrequest' };

const submitSupportSchema = z.object({
    name: z.string().min(1).max(128),
    host: z.string().min(1).max(32),
    banner: z.string().optional().nullable(),
    start: z.string(),
    end: z.string(),
    requested_fields: z.array(z.string()),
    description: z.string().optional().nullable(),
});

export async function submitSupportRequest(input: z.infer<typeof submitSupportSchema>): Promise<void> {
    const session = await requireMember();
    const data = submitSupportSchema.parse(input);

    const [row] = await db.insert(eventsSupportrequest)
        .values({
            userId: session.user.cid,
            name: data.name,
            host: data.host,
            banner: data.banner ?? null,
            start: data.start,
            end: data.end,
            requestedFields: data.requested_fields,
            description: data.description ?? null,
        })
        .returning();

    await logCreate(SUPPORT_MODEL, row as Record<string, unknown>, session.user.cid);

    revalidatePath('/admin/queue/events');
}

export async function approveSupportRequest(id: number): Promise<void> {
    const session = await requireStaff();

    const [request] = await db.select().from(eventsSupportrequest).where(eq(eventsSupportrequest.id, id));
    if (!request) {
        throw new Error(`Support request ${id} not found`);
    }

    // Convert to a hidden Event.
    const [event] = await db.insert(eventsEvent)
        .values({
            name: request.name,
            host: request.host,
            banner: request.banner,
            start: request.start,
            end: request.end,
            description: request.description,
            hidden: true,
        })
        .returning();

    await logCreate(EVENT_MODEL, event as Record<string, unknown>, session.user.cid);

    await db.delete(eventsSupportrequest).where(eq(eventsSupportrequest.id, id));
    await logDelete(SUPPORT_MODEL, request as Record<string, unknown>, session.user.cid);

    revalidatePath('/admin/queue/events');
    revalidatePath('/events');
}

export async function rejectSupportRequest(id: number): Promise<void> {
    const session = await requireStaff();

    const [row] = await db.select().from(eventsSupportrequest).where(eq(eventsSupportrequest.id, id));
    if (!row) {
        throw new Error(`Support request ${id} not found`);
    }

    await db.delete(eventsSupportrequest).where(eq(eventsSupportrequest.id, id));

    await logDelete(SUPPORT_MODEL, row as Record<string, unknown>, session.user.cid);

    revalidatePath('/admin/queue/events');
}
