import 'server-only';
import { and, asc, count, desc, eq, gt, inArray, isNull, lt, sql } from 'drizzle-orm';
import type { BasicEvent, Event, EventScore, EventSignup, PositionPreset } from '@/types/events';
import type { SupportRequest } from '@/types/admin';
import { db } from '@/lib/db';
import {
    eventsEvent,
    eventsEventposition,
    eventsEventscore,
    eventsPositionpreset,
    eventsPositionshift,
    eventsShiftrequest,
    eventsSupportrequest,
    usersUser,
} from '@/lib/db/schema';
import { computeShiftTimes, groupPositionsByBucket } from '@/lib/events/shifts';

export async function getPositionPresets(): Promise<PositionPreset[]> {
    const rows = await db
        .select()
        .from(eventsPositionpreset)
        .orderBy(asc(eventsPositionpreset.id));

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        positions: row.positions as PositionPreset['positions'],
    }));
}

export async function getArchivedEvents(includeHidden = false): Promise<BasicEvent[]> {
    const now = new Date().toISOString();

    const availableShiftsSubq = db
        .select({ count: count() })
        .from(eventsPositionshift)
        .innerJoin(eventsEventposition, eq(eventsPositionshift.positionId, eventsEventposition.id))
        .where(and(eq(eventsEventposition.eventId, eventsEvent.id), isNull(eventsPositionshift.userId)));

    const rows = await db
        .select({
            id: eventsEvent.id,
            name: eventsEvent.name,
            banner: eventsEvent.banner,
            start: eventsEvent.start,
            end: eventsEvent.end,
            host: eventsEvent.host,
            hidden: eventsEvent.hidden,
            available_shifts: sql<number>`(${availableShiftsSubq})`,
        })
        .from(eventsEvent)
        .where(includeHidden ? lt(eventsEvent.end, now) : and(lt(eventsEvent.end, now), eq(eventsEvent.hidden, false)))
        .orderBy(desc(eventsEvent.start));

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        banner: row.banner ?? '',
        start: row.start,
        end: row.end,
        host: row.host,
        hidden: row.hidden,
        archived: true,
        available_shifts: Number(row.available_shifts),
    }));
}

export async function getEvents(
    { includeHidden = false, limit }: { includeHidden?: boolean; limit?: number } = {},
): Promise<BasicEvent[]> {
    const now = new Date().toISOString();

    const availableShiftsSubq = db
        .select({ count: count() })
        .from(eventsPositionshift)
        .innerJoin(eventsEventposition, eq(eventsPositionshift.positionId, eventsEventposition.id))
        .where(and(eq(eventsEventposition.eventId, eventsEvent.id), isNull(eventsPositionshift.userId)));

    const query = db
        .select({
            id: eventsEvent.id,
            name: eventsEvent.name,
            banner: eventsEvent.banner,
            start: eventsEvent.start,
            end: eventsEvent.end,
            host: eventsEvent.host,
            hidden: eventsEvent.hidden,
            available_shifts: sql<number>`(${availableShiftsSubq})`,
        })
        .from(eventsEvent)
        .where(includeHidden ? gt(eventsEvent.end, now) : and(gt(eventsEvent.end, now), eq(eventsEvent.hidden, false)))
        .orderBy(eventsEvent.start);

    const rows = limit === undefined ? await query : await query.limit(limit);

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        banner: row.banner ?? '',
        start: row.start,
        end: row.end,
        host: row.host,
        hidden: row.hidden,
        archived: false,
        available_shifts: Number(row.available_shifts),
    }));
}

export async function getEventById(id: number): Promise<Event | null> {
    const [event] = await db
        .select()
        .from(eventsEvent)
        .where(eq(eventsEvent.id, id));

    if (!event) return null;

    const positions = await db
        .select()
        .from(eventsEventposition)
        .where(eq(eventsEventposition.eventId, id))
        .orderBy(eventsEventposition.id);

    const positionIds = positions.map((p) => p.id);

    const shifts = positionIds.length > 0
        ? await db
            .select({
                id: eventsPositionshift.id,
                positionId: eventsPositionshift.positionId,
                userCid: usersUser.cid,
                userFirstName: usersUser.firstName,
                userLastName: usersUser.lastName,
                userInitials: usersUser.initials,
                userProfile: usersUser.profile,
            })
            .from(eventsPositionshift)
            .leftJoin(usersUser, eq(usersUser.cid, eventsPositionshift.userId))
            .where(inArray(eventsPositionshift.positionId, positionIds))
            .orderBy(eventsPositionshift.id)
        : [];

    const shiftIds = shifts.map((s) => s.id);

    const requests = shiftIds.length > 0
        ? await db
            .select({
                id: eventsShiftrequest.id,
                shiftId: eventsShiftrequest.shiftId,
                userCid: usersUser.cid,
                userFirstName: usersUser.firstName,
                userLastName: usersUser.lastName,
                userInitials: usersUser.initials,
                userProfile: usersUser.profile,
            })
            .from(eventsShiftrequest)
            .innerJoin(usersUser, eq(usersUser.cid, eventsShiftrequest.userId))
            .where(inArray(eventsShiftrequest.shiftId, shiftIds))
        : [];

    const requestsByShiftId = new Map<number, typeof requests>();
    for (const req of requests) {
        const list = requestsByShiftId.get(req.shiftId) ?? [];
        list.push(req);
        requestsByShiftId.set(req.shiftId, list);
    }

    const shiftsByPositionId = new Map<number, typeof shifts>();
    for (const shift of shifts) {
        const list = shiftsByPositionId.get(shift.positionId) ?? [];
        list.push(shift);
        shiftsByPositionId.set(shift.positionId, list);
    }

    const builtPositions = positions.map((pos) => {
        const posShifts = shiftsByPositionId.get(pos.id) ?? [];
        return {
            id: pos.id,
            callsign: pos.callsign,
            shifts: posShifts.map((shift, index) => ({
                id: shift.id,
                user: shift.userCid !== null
                    ? {
                        cid: shift.userCid,
                        first_name: shift.userFirstName ?? '',
                        last_name: shift.userLastName ?? '',
                        initials: shift.userInitials ?? '',
                        profile: shift.userProfile ?? undefined,
                    }
                    : null,
                ...computeShiftTimes(event.start, event.end, posShifts.length, index),
                requests: (requestsByShiftId.get(shift.id) ?? []).map((req) => ({
                    id: req.id,
                    user: {
                        cid: req.userCid,
                        first_name: req.userFirstName,
                        last_name: req.userLastName,
                        initials: req.userInitials ?? '',
                        profile: req.userProfile ?? undefined,
                    },
                })),
            })),
        };
    });

    return {
        id: event.id,
        name: event.name,
        banner: event.banner ?? '',
        start: event.start,
        end: event.end,
        host: event.host,
        hidden: event.hidden,
        archived: new Date(event.end) < new Date(),
        description: event.description ?? '',
        positions: groupPositionsByBucket(builtPositions),
    };
}

export async function getEventScoresForUser(cid: number): Promise<EventScore[]> {
    const rows = await db
        .select({
            score: eventsEventscore.score,
            notes: eventsEventscore.notes,
            eventId: eventsEvent.id,
            eventName: eventsEvent.name,
            eventBanner: eventsEvent.banner,
            eventStart: eventsEvent.start,
            eventEnd: eventsEvent.end,
            eventHost: eventsEvent.host,
            eventHidden: eventsEvent.hidden,
        })
        .from(eventsEventscore)
        .innerJoin(eventsEvent, eq(eventsEvent.id, eventsEventscore.eventId))
        .where(eq(eventsEventscore.userId, cid))
        .orderBy(desc(eventsEvent.start));

    return rows.map((row) => ({
        score: row.score,
        notes: row.notes as EventScore['notes'],
        event: {
            id: row.eventId,
            name: row.eventName,
            banner: row.eventBanner ?? '',
            start: row.eventStart,
            end: row.eventEnd,
            host: row.eventHost,
            hidden: row.eventHidden,
            archived: true,
            available_shifts: 0,
        },
    }));
}

export async function getPendingSupportRequests(): Promise<SupportRequest[]> {
    const rows = await db.select({
        id: eventsSupportrequest.id,
        name: eventsSupportrequest.name,
        banner: eventsSupportrequest.banner,
        start: eventsSupportrequest.start,
        end: eventsSupportrequest.end,
        host: eventsSupportrequest.host,
        requestedFields: eventsSupportrequest.requestedFields,
        description: eventsSupportrequest.description,
        userCid: usersUser.cid,
        userFirstName: usersUser.firstName,
        userLastName: usersUser.lastName,
        userInitials: usersUser.initials,
        userProfile: usersUser.profile,
        userEmail: usersUser.email,
    })
        .from(eventsSupportrequest)
        .innerJoin(usersUser, eq(usersUser.cid, eventsSupportrequest.userId))
        .orderBy(asc(eventsSupportrequest.start));

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        banner: row.banner ?? '',
        start: row.start,
        end: row.end,
        host: row.host,
        requested_fields: (row.requestedFields as string[]) ?? [],
        description: row.description ?? '',
        user: {
            cid: row.userCid,
            first_name: row.userFirstName,
            last_name: row.userLastName,
            initials: row.userInitials ?? '',
            profile: row.userProfile ?? undefined,
            email: row.userEmail,
        },
    } satisfies SupportRequest));
}

/** Everyone who requested a shift for the event, with their average event score across all events. */
export async function getEventSignups(eventId: number): Promise<EventSignup[]> {
    const averageScore = db
        .select({ userId: eventsEventscore.userId, score: sql<string>`avg(${eventsEventscore.score})`.as('score') })
        .from(eventsEventscore)
        .groupBy(eventsEventscore.userId)
        .as('average_score');

    const rows = await db
        .select({
            cid: usersUser.cid,
            first_name: usersUser.firstName,
            last_name: usersUser.lastName,
            initials: usersUser.initials,
            profile: usersUser.profile,
            rating: usersUser.rating,
            requests: count(eventsShiftrequest.id),
            score: averageScore.score,
        })
        .from(eventsShiftrequest)
        .innerJoin(eventsPositionshift, eq(eventsPositionshift.id, eventsShiftrequest.shiftId))
        .innerJoin(eventsEventposition, eq(eventsEventposition.id, eventsPositionshift.positionId))
        .innerJoin(usersUser, eq(usersUser.cid, eventsShiftrequest.userId))
        .leftJoin(averageScore, eq(averageScore.userId, usersUser.cid))
        .where(eq(eventsEventposition.eventId, eventId))
        .groupBy(usersUser.cid, averageScore.score)
        .orderBy(asc(usersUser.cid));

    return rows.map((row) => ({
        ...row,
        initials: row.initials ?? '',
        profile: row.profile ?? undefined,
        score: row.score === null ? null : Number(row.score),
    }));
}
