import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import type { BasicFeedback, Feedback } from '@/types/feedback';
import { db } from '@/lib/db';
import { eventsEvent, feedbackFeedback, usersUser } from '@/lib/db/schema';

const controllerUser = alias(usersUser, 'controller_user');
const pilotUser = alias(usersUser, 'pilot_user');

async function selectFeedback(approved: boolean): Promise<Feedback[]> {
    const rows = await db
        .select({
            id: feedbackFeedback.id,
            rating: feedbackFeedback.rating,
            comments: feedbackFeedback.comments,
            created: feedbackFeedback.created,
            controllerCallsign: feedbackFeedback.controllerCallsign,
            pilotCallsign: feedbackFeedback.pilotCallsign,
            controllerCid: controllerUser.cid,
            controllerFirstName: controllerUser.firstName,
            controllerLastName: controllerUser.lastName,
            controllerInitials: controllerUser.initials,
            controllerProfile: controllerUser.profile,
            controllerEmail: controllerUser.email,
            pilotCid: pilotUser.cid,
            pilotFirstName: pilotUser.firstName,
            pilotLastName: pilotUser.lastName,
            pilotInitials: pilotUser.initials,
            pilotProfile: pilotUser.profile,
            pilotEmail: pilotUser.email,
            eventId: eventsEvent.id,
            eventName: eventsEvent.name,
            eventBanner: eventsEvent.banner,
            eventStart: eventsEvent.start,
            eventEnd: eventsEvent.end,
            eventHost: eventsEvent.host,
            eventHidden: eventsEvent.hidden,
        })
        .from(feedbackFeedback)
        .leftJoin(controllerUser, eq(controllerUser.cid, feedbackFeedback.controllerId))
        .innerJoin(pilotUser, eq(pilotUser.cid, feedbackFeedback.pilotId))
        .leftJoin(eventsEvent, eq(eventsEvent.id, feedbackFeedback.eventId))
        .where(eq(feedbackFeedback.approved, approved))
        .orderBy(desc(feedbackFeedback.created));

    return rows.map((row) => ({
        id: row.id,
        rating: row.rating,
        comments: row.comments,
        created: row.created,
        controller_callsign: row.controllerCallsign ?? undefined,
        pilot_callsign: row.pilotCallsign ?? undefined,
        controller: row.controllerCid !== null
            ? {
                cid: row.controllerCid,
                first_name: row.controllerFirstName ?? '',
                last_name: row.controllerLastName ?? '',
                initials: row.controllerInitials ?? '',
                profile: row.controllerProfile ?? undefined,
                email: row.controllerEmail ?? '',
            }
            : undefined,
        pilot: {
            cid: row.pilotCid,
            first_name: row.pilotFirstName,
            last_name: row.pilotLastName,
            initials: row.pilotInitials ?? '',
            profile: row.pilotProfile ?? undefined,
            email: row.pilotEmail,
        },
        event: row.eventId !== null
            ? {
                id: row.eventId,
                name: row.eventName ?? '',
                banner: row.eventBanner ?? '',
                start: row.eventStart ?? '',
                end: row.eventEnd ?? '',
                host: row.eventHost ?? '',
                hidden: row.eventHidden ?? false,
                archived: false,
                available_shifts: 0,
            }
            : undefined,
    } satisfies Feedback));
}

export async function getPendingFeedback(): Promise<Feedback[]> {
    return selectFeedback(false);
}

export async function getApprovedFeedback(): Promise<Feedback[]> {
    return selectFeedback(true);
}

export async function getFeedbackByController(cid: number): Promise<BasicFeedback[]> {
    const rows = await db
        .select({
            id: feedbackFeedback.id,
            controllerCallsign: feedbackFeedback.controllerCallsign,
            pilotCallsign: feedbackFeedback.pilotCallsign,
            rating: feedbackFeedback.rating,
            comments: feedbackFeedback.comments,
            created: feedbackFeedback.created,
            eventId: eventsEvent.id,
            eventName: eventsEvent.name,
            eventBanner: eventsEvent.banner,
            eventStart: eventsEvent.start,
            eventEnd: eventsEvent.end,
            eventHost: eventsEvent.host,
            eventHidden: eventsEvent.hidden,
        })
        .from(feedbackFeedback)
        .leftJoin(eventsEvent, eq(eventsEvent.id, feedbackFeedback.eventId))
        .where(and(eq(feedbackFeedback.controllerId, cid), eq(feedbackFeedback.approved, true)))
        .orderBy(desc(feedbackFeedback.created));

    return rows.map((row) => ({
        id: row.id,
        controller_callsign: row.controllerCallsign ?? undefined,
        pilot_callsign: row.pilotCallsign ?? undefined,
        rating: row.rating,
        comments: row.comments,
        created: row.created,
        event: row.eventId !== null
            ? {
                id: row.eventId,
                name: row.eventName ?? '',
                banner: row.eventBanner ?? '',
                start: row.eventStart ?? '',
                end: row.eventEnd ?? '',
                host: row.eventHost ?? '',
                hidden: row.eventHidden ?? false,
                archived: false,
                available_shifts: 0,
            }
            : undefined,
    } satisfies BasicFeedback));
}
