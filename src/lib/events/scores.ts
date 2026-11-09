import 'server-only';

import { and, eq, lt, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
    connectionsControllersession,
    eventsEvent,
    eventsEventposition,
    eventsEventscore,
    eventsPositionshift,
    feedbackFeedback,
    usersUser,
} from '@/lib/db/schema';

const STATUS_ACTIVE = 0;

export interface CalculateScoresResult {
    scoresCreated: number;
    errors: number;
}

export async function calculateScores(): Promise<CalculateScoresResult> {
    const now = new Date().toISOString();

    // Find all active users who have at least one shift in a past event with no score yet.
    // We load the candidate (userId, eventId) pairs, then process each individually.
    const candidates = await db
        .selectDistinct({
            userId: eventsPositionshift.userId,
            eventId: eventsEventposition.eventId,
        })
        .from(eventsPositionshift)
        .innerJoin(eventsEventposition, eq(eventsPositionshift.positionId, eventsEventposition.id))
        .innerJoin(eventsEvent, eq(eventsEventposition.eventId, eventsEvent.id))
        .innerJoin(usersUser, eq(eventsPositionshift.userId, usersUser.cid))
        .where(
            and(
                lt(eventsEvent.end, now),
                eq(usersUser.status, STATUS_ACTIVE),
            ),
        );

    let scoresCreated = 0;
    let errors = 0;

    for (const { userId, eventId } of candidates) {
        if (userId === null) continue;

        try {
            // Skip if score already exists for this (user, event) pair.
            const [existing] = await db
                .select({ id: eventsEventscore.id })
                .from(eventsEventscore)
                .where(
                    and(
                        eq(eventsEventscore.userId, userId),
                        eq(eventsEventscore.eventId, eventId),
                    ),
                )
                .limit(1);

            if (existing) continue;

            // Fetch the event.
            const [event] = await db
                .select({ start: eventsEvent.start, end: eventsEvent.end })
                .from(eventsEvent)
                .where(eq(eventsEvent.id, eventId));

            if (!event) continue;

            const eventStartMs = new Date(event.start).getTime();
            const eventEndMs = new Date(event.end).getTime();

            // Fetch all shifts for this user in this event, with sibling shift counts.
            // Shift times aren't stored; they're derived from the event:
            //   shift.start = event.start + index * (event_duration / total_shifts_in_position)
            //   shift.end   = shift.start + (event_duration / total_shifts_in_position)
            // The index of a shift within its position is its 0-based row_number ordered by id.
            const userShifts = await db
                .select({
                    shiftId: eventsPositionshift.id,
                    positionId: eventsPositionshift.positionId,
                    shiftIndex: sql<number>`ROW_NUMBER() OVER (
                        PARTITION BY ${eventsPositionshift.positionId}
                        ORDER BY ${eventsPositionshift.id}
                    ) - 1`.as('shift_index'),
                    totalShiftsInPosition: sql<number>`COUNT(${eventsPositionshift.id}) OVER (
                        PARTITION BY ${eventsPositionshift.positionId}
                    )`.as('total_shifts_in_position'),
                })
                .from(eventsPositionshift)
                .innerJoin(eventsEventposition, eq(eventsPositionshift.positionId, eventsEventposition.id))
                .where(
                    and(
                        eq(eventsPositionshift.userId, userId),
                        eq(eventsEventposition.eventId, eventId),
                    ),
                );

            if (userShifts.length === 0) continue;

            // Compute target_duration in seconds as sum of each assigned shift's duration.
            let targetDuration = 0;
            for (const shift of userShifts) {
                const shiftDurationMs = (eventEndMs - eventStartMs) / Number(shift.totalShiftsInPosition);
                targetDuration += shiftDurationMs / 1000;
            }

            if (targetDuration <= 0) continue;

            // Fetch controller sessions overlapping the event window.
            // Use epoch extraction in SQL to avoid parsing interval strings in JS.
            const sessions = await db
                .select({
                    start: connectionsControllersession.start,
                    durationSecs: sql<number>`EXTRACT(EPOCH FROM ${connectionsControllersession.duration})`.as('duration_secs'),
                })
                .from(connectionsControllersession)
                .where(
                    and(
                        eq(connectionsControllersession.userId, userId),
                        // Session ended after event started: start + duration > event.start
                        sql`${connectionsControllersession.start} + ${connectionsControllersession.duration} > ${event.start}::timestamptz`,
                        // Session started before event ended
                        lt(connectionsControllersession.start, event.end),
                    ),
                );

            let actualDuration = 0;
            let totalSessionDuration = 0;

            for (const session of sessions) {
                const durationSecs = Number(session.durationSecs);
                const sessionStartMs = new Date(session.start).getTime();
                const sessionEndMs = sessionStartMs + durationSecs * 1000;

                const overlapStart = Math.max(sessionStartMs, eventStartMs);
                const overlapEnd = Math.min(sessionEndMs, eventEndMs);
                const overlapSecs = Math.max(0, (overlapEnd - overlapStart) / 1000);

                actualDuration += overlapSecs;
                totalSessionDuration += durationSecs;
            }

            const extraDuration = totalSessionDuration - actualDuration;
            const totalDuration = actualDuration + Math.min(extraDuration, 3600);
            const controllingScore = (totalDuration / targetDuration) * 100;

            // Compute feedback score from approved feedback for this controller/event.
            const feedbackRows = await db
                .select({ rating: feedbackFeedback.rating })
                .from(feedbackFeedback)
                .where(
                    and(
                        eq(feedbackFeedback.controllerId, userId),
                        eq(feedbackFeedback.eventId, eventId),
                        eq(feedbackFeedback.approved, true),
                    ),
                );

            let feedbackScore = 0;
            const feedbackNotes: { rating: number }[] = [];
            for (const fb of feedbackRows) {
                feedbackScore += (fb.rating - 3) * 5;
                feedbackNotes.push({ rating: fb.rating });
            }

            const score = Math.trunc(controllingScore + feedbackScore);
            const notes = {
                target_duration: targetDuration,
                total_duration: totalDuration,
                feedback: feedbackNotes,
            };

            await db.insert(eventsEventscore).values({
                userId,
                eventId,
                score: Math.max(0, score),
                notes,
            });

            scoresCreated++;
        } catch (err) {
            errors++;
            console.error(`error scoring userId=${userId} eventId=${eventId}:`, err);
        }
    }

    return { scoresCreated, errors };
}
