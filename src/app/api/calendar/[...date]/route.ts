import { NextResponse, type NextRequest } from 'next/server';
import { alias } from 'drizzle-orm/pg-core';
import { and, count, eq, gte, lte, ne, sql } from 'drizzle-orm';
import type { Calendar } from '@/types/calendar';
import { SessionStatus } from '@/types/training';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import {
    eventsEvent,
    eventsEventposition,
    eventsPositionshift,
    trainingTrainingsession,
    usersUser,
} from '@/lib/db/schema';

const studentUser = alias(usersUser, 'student_user');

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ date: string[] }> },
): Promise<NextResponse> {
    const { date } = await params;
    // date segments: [year, month] where month is 1-indexed (component's getMonth() + 1)
    const year = parseInt(date[0] ?? '', 10);
    const month = parseInt(date[1] ?? '', 10);

    if (!year || !month || month < 1 || month > 12) {
        return NextResponse.json({ detail: 'Invalid date' }, { status: 400 });
    }

    const monthStart = new Date(Date.UTC(year, month - 1, 1)).toISOString();
    const monthEnd = new Date(Date.UTC(year, month, 1) - 1).toISOString();

    const session = await auth();
    const isStaff = session?.user.permissions.is_staff ?? false;

    const availableShiftsSubq = db
        .select({ count: count() })
        .from(eventsPositionshift)
        .innerJoin(eventsEventposition, eq(eventsPositionshift.positionId, eventsEventposition.id))
        .where(and(eq(eventsEventposition.eventId, eventsEvent.id)));

    const eventRows = await db
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
        .where(
            and(
                gte(eventsEvent.start, monthStart),
                lte(eventsEvent.start, monthEnd),
                ...(isStaff ? [] : [eq(eventsEvent.hidden, false)]),
            ),
        );

    const sessionRows = await db
        .select({
            id: trainingTrainingsession.id,
            start: trainingTrainingsession.start,
            end: trainingTrainingsession.end,
            position: trainingTrainingsession.position,
            type: trainingTrainingsession.type,
            level: trainingTrainingsession.level,
            studentCid: studentUser.cid,
            studentFirstName: studentUser.firstName,
            studentLastName: studentUser.lastName,
            studentInitials: studentUser.initials,
            studentProfile: studentUser.profile,
        })
        .from(trainingTrainingsession)
        .innerJoin(studentUser, eq(studentUser.cid, trainingTrainingsession.studentId))
        .where(
            and(
                ne(trainingTrainingsession.status, SessionStatus.Cancelled),
                gte(trainingTrainingsession.start, monthStart),
                lte(trainingTrainingsession.start, monthEnd),
            ),
        );

    const data: Calendar = {
        events: eventRows.map((row) => ({
            id: row.id,
            name: row.name,
            banner: row.banner ?? '',
            start: row.start,
            end: row.end,
            host: row.host,
            hidden: row.hidden,
            archived: new Date(row.end) < new Date(),
            available_shifts: Number(row.available_shifts),
        })),
        sessions: sessionRows.map((row) => ({
            id: row.id,
            start: row.start,
            end: row.end,
            position: row.position,
            type: row.type,
            level: row.level,
            student: {
                cid: row.studentCid,
                first_name: row.studentFirstName,
                last_name: row.studentLastName,
                initials: row.studentInitials ?? '',
                profile: row.studentProfile ?? undefined,
            },
        })),
    };

    return NextResponse.json(data);
}
