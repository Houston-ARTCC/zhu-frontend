import 'server-only';
import { and, count, desc, asc, eq, gt, gte, isNotNull, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import type { TrainingNotifications, TrainingRequest, TrainingRequestHistoryEntry, TrainingSession, UserTrainingRequests } from '@/types/training';
import { SessionStatus } from '@/types/training';
import { db } from '@/lib/db';
import { auditlogLogentry, djangoContentType, trainingTrainingrequest, trainingTrainingsession, usersUser } from '@/lib/db/schema';

const instructorUser = alias(usersUser, 'instructor_user');
const studentUser = alias(usersUser, 'student_user');

const AUDIT_ACTION_CREATE = 0;

let trainingRequestContentTypeId: number | null = null;

async function getTrainingRequestContentTypeId(): Promise<number> {
    if (trainingRequestContentTypeId !== null) return trainingRequestContentTypeId;

    const [row] = await db
        .select({ id: djangoContentType.id })
        .from(djangoContentType)
        .where(
            and(
                eq(djangoContentType.appLabel, 'training'),
                eq(djangoContentType.model, 'trainingrequest'),
            ),
        );

    if (!row) throw new Error('No content type found for training.trainingrequest');
    trainingRequestContentTypeId = row.id;
    return row.id;
}

function buildSessionFromRow(row: {
    id: number;
    start: string;
    end: string;
    position: string | null;
    type: number;
    level: number;
    status: number;
    otsStatus: number;
    movements: number;
    progress: number;
    notes: string | null;
    soloGranted: boolean;
    instructorCid: number | null;
    instructorFirstName: string | null;
    instructorLastName: string | null;
    instructorInitials: string | null;
    instructorProfile: string | null;
    studentCid: number | null;
    studentFirstName: string | null;
    studentLastName: string | null;
    studentInitials: string | null;
    studentProfile: string | null;
}): TrainingSession | null {
    if (row.instructorCid === null || row.studentCid === null) return null;

    return {
        id: row.id,
        start: row.start,
        end: row.end,
        position: row.position,
        type: row.type as TrainingSession['type'],
        level: row.level as TrainingSession['level'],
        status: row.status as TrainingSession['status'],
        ots_status: row.otsStatus as TrainingSession['ots_status'],
        movements: row.movements,
        progress: row.progress,
        notes: row.notes,
        solo_granted: row.soloGranted,
        instructor: {
            cid: row.instructorCid,
            first_name: row.instructorFirstName ?? '',
            last_name: row.instructorLastName ?? '',
            initials: row.instructorInitials ?? '',
            profile: row.instructorProfile ?? undefined,
        },
        student: {
            cid: row.studentCid,
            first_name: row.studentFirstName ?? '',
            last_name: row.studentLastName ?? '',
            initials: row.studentInitials ?? '',
            profile: row.studentProfile ?? undefined,
        },
    } satisfies TrainingSession;
}

const SESSION_SELECT = {
    id: trainingTrainingsession.id,
    start: trainingTrainingsession.start,
    end: trainingTrainingsession.end,
    position: trainingTrainingsession.position,
    type: trainingTrainingsession.type,
    level: trainingTrainingsession.level,
    status: trainingTrainingsession.status,
    otsStatus: trainingTrainingsession.otsStatus,
    movements: trainingTrainingsession.movements,
    progress: trainingTrainingsession.progress,
    notes: trainingTrainingsession.notes,
    soloGranted: trainingTrainingsession.soloGranted,
    instructorCid: instructorUser.cid,
    instructorFirstName: instructorUser.firstName,
    instructorLastName: instructorUser.lastName,
    instructorInitials: instructorUser.initials,
    instructorProfile: instructorUser.profile,
    studentCid: studentUser.cid,
    studentFirstName: studentUser.firstName,
    studentLastName: studentUser.lastName,
    studentInitials: studentUser.initials,
    studentProfile: studentUser.profile,
};

export async function getTrainingNotifications(cid: number): Promise<TrainingNotifications> {
    const now = new Date().toISOString();
    const [scheduledResult, requestsResult, instructorResult] = await Promise.all([
        db
            .select({ value: count() })
            .from(trainingTrainingsession)
            .where(and(eq(trainingTrainingsession.studentId, cid), eq(trainingTrainingsession.status, SessionStatus.Scheduled))),
        // Distinct-user count of non-expired pending requests (badges the Training Requests queue for staff).
        db
            .select({ value: sql<number>`count(distinct ${trainingTrainingrequest.userId})` })
            .from(trainingTrainingrequest)
            .where(gt(trainingTrainingrequest.end, now)),
        db
            .select({ value: count() })
            .from(trainingTrainingsession)
            .where(and(eq(trainingTrainingsession.instructorId, cid), eq(trainingTrainingsession.status, SessionStatus.Scheduled))),
    ]);

    return {
        scheduled_sessions: scheduledResult[0].value,
        training_requests: Number(requestsResult[0].value),
        instructor_sessions: instructorResult[0].value,
    } satisfies TrainingNotifications;
}

export async function getSessionsByStudent(cid: number): Promise<TrainingSession[]> {
    const rows = await db
        .select(SESSION_SELECT)
        .from(trainingTrainingsession)
        .leftJoin(instructorUser, eq(instructorUser.cid, trainingTrainingsession.instructorId))
        .innerJoin(studentUser, eq(studentUser.cid, trainingTrainingsession.studentId))
        .where(eq(trainingTrainingsession.studentId, cid))
        .orderBy(desc(trainingTrainingsession.start));

    return rows.flatMap((row) => {
        const session = buildSessionFromRow(row);
        return session ? [session] : [];
    });
}

export async function getSessionsByInstructor(cid: number): Promise<TrainingSession[]> {
    const rows = await db
        .select(SESSION_SELECT)
        .from(trainingTrainingsession)
        .innerJoin(instructorUser, eq(instructorUser.cid, trainingTrainingsession.instructorId))
        .leftJoin(studentUser, eq(studentUser.cid, trainingTrainingsession.studentId))
        .where(eq(trainingTrainingsession.instructorId, cid))
        .orderBy(desc(trainingTrainingsession.start));

    return rows.flatMap((row) => {
        const session = buildSessionFromRow(row);
        return session ? [session] : [];
    });
}

export async function getAllScheduledSessions(): Promise<TrainingSession[]> {
    const rows = await db
        .select(SESSION_SELECT)
        .from(trainingTrainingsession)
        .leftJoin(instructorUser, eq(instructorUser.cid, trainingTrainingsession.instructorId))
        .leftJoin(studentUser, eq(studentUser.cid, trainingTrainingsession.studentId))
        .where(eq(trainingTrainingsession.status, SessionStatus.Scheduled))
        .orderBy(asc(trainingTrainingsession.start));

    return rows.flatMap((row) => {
        const session = buildSessionFromRow(row);
        return session ? [session] : [];
    });
}

export async function getAllSessionsLast30Days(): Promise<TrainingSession[]> {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const rows = await db
        .select(SESSION_SELECT)
        .from(trainingTrainingsession)
        .leftJoin(instructorUser, eq(instructorUser.cid, trainingTrainingsession.instructorId))
        .leftJoin(studentUser, eq(studentUser.cid, trainingTrainingsession.studentId))
        .where(gte(trainingTrainingsession.start, cutoff))
        .orderBy(desc(trainingTrainingsession.start));

    return rows.flatMap((row) => {
        const session = buildSessionFromRow(row);
        return session ? [session] : [];
    });
}

export async function getSessionById(id: number): Promise<TrainingSession | null> {
    const rows = await db
        .select(SESSION_SELECT)
        .from(trainingTrainingsession)
        .leftJoin(instructorUser, eq(instructorUser.cid, trainingTrainingsession.instructorId))
        .leftJoin(studentUser, eq(studentUser.cid, trainingTrainingsession.studentId))
        .where(eq(trainingTrainingsession.id, id));

    if (rows.length === 0) return null;
    return buildSessionFromRow(rows[0]);
}

export async function getPendingRequests(): Promise<UserTrainingRequests[]> {
    const rows = await db
        .select({
            requestId: trainingTrainingrequest.id,
            requestStart: trainingTrainingrequest.start,
            requestEnd: trainingTrainingrequest.end,
            requestType: trainingTrainingrequest.type,
            requestLevel: trainingTrainingrequest.level,
            requestRemarks: trainingTrainingrequest.remarks,
            userCid: usersUser.cid,
            userFirstName: usersUser.firstName,
            userLastName: usersUser.lastName,
            userInitials: usersUser.initials,
            userProfile: usersUser.profile,
        })
        .from(trainingTrainingrequest)
        .innerJoin(usersUser, eq(usersUser.cid, trainingTrainingrequest.userId))
        .where(gt(trainingTrainingrequest.end, new Date().toISOString()))
        .orderBy(asc(trainingTrainingrequest.start));

    // Group by user
    const byUser = new Map<number, { user: UserTrainingRequests['user']; requests: TrainingRequest[] }>();
    for (const row of rows) {
        if (!byUser.has(row.userCid)) {
            byUser.set(row.userCid, {
                user: {
                    cid: row.userCid,
                    first_name: row.userFirstName,
                    last_name: row.userLastName,
                    initials: row.userInitials ?? '',
                    profile: row.userProfile ?? undefined,
                },
                requests: [],
            });
        }
        byUser.get(row.userCid)!.requests.push({
            id: row.requestId,
            start: row.requestStart,
            end: row.requestEnd,
            type: row.requestType as TrainingRequest['type'],
            level: row.requestLevel as TrainingRequest['level'],
            remarks: row.requestRemarks ?? '',
        } satisfies TrainingRequest);
    }

    const userCids = [...byUser.keys()];

    // For each user, find last completed session
    const lastSessions = await Promise.all(
        userCids.map(async (cid) => {
            const [row] = await db
                .select({ start: trainingTrainingsession.start })
                .from(trainingTrainingsession)
                .where(
                    and(
                        eq(trainingTrainingsession.studentId, cid),
                        eq(trainingTrainingsession.status, SessionStatus.Completed),
                    ),
                )
                .orderBy(desc(trainingTrainingsession.start))
                .limit(1);
            return { cid, lastSession: row?.start ?? null };
        }),
    );

    return userCids.map((cid) => {
        const entry = byUser.get(cid)!;
        const last = lastSessions.find((s) => s.cid === cid)!;
        return {
            user: entry.user,
            requests: entry.requests,
            last_session: last.lastSession,
        } satisfies UserTrainingRequests;
    });
}

export async function getOwnTrainingRequests(cid: number): Promise<TrainingRequest[]> {
    const rows = await db
        .select({
            id: trainingTrainingrequest.id,
            start: trainingTrainingrequest.start,
            end: trainingTrainingrequest.end,
            type: trainingTrainingrequest.type,
            level: trainingTrainingrequest.level,
            remarks: trainingTrainingrequest.remarks,
        })
        .from(trainingTrainingrequest)
        .where(and(eq(trainingTrainingrequest.userId, cid), gt(trainingTrainingrequest.end, new Date().toISOString())))
        .orderBy(asc(trainingTrainingrequest.start));

    return rows.map((row) => ({
        id: row.id,
        start: row.start,
        end: row.end,
        type: row.type as TrainingRequest['type'],
        level: row.level as TrainingRequest['level'],
        remarks: row.remarks ?? '',
    } satisfies TrainingRequest));
}

export async function getTrainingRequestHistory(): Promise<TrainingRequestHistoryEntry[]> {
    const contentTypeId = await getTrainingRequestContentTypeId();

    const rows = await db
        .select({
            actorCid: usersUser.cid,
            actorFirstName: usersUser.firstName,
            actorLastName: usersUser.lastName,
            actorInitials: usersUser.initials,
            actorProfile: usersUser.profile,
            requestCount: count(auditlogLogentry.id),
            lastRequest: sql<string>`max(${auditlogLogentry.timestamp})`,
        })
        .from(auditlogLogentry)
        .innerJoin(usersUser, eq(usersUser.cid, auditlogLogentry.actorId))
        .where(
            and(
                eq(auditlogLogentry.contentTypeId, contentTypeId),
                eq(auditlogLogentry.action, AUDIT_ACTION_CREATE),
                isNotNull(auditlogLogentry.actorId),
            ),
        )
        .groupBy(
            usersUser.cid,
            usersUser.firstName,
            usersUser.lastName,
            usersUser.initials,
            usersUser.profile,
        )
        .orderBy(desc(sql`max(${auditlogLogentry.timestamp})`));

    return rows.map((row) => ({
        user: {
            cid: row.actorCid,
            first_name: row.actorFirstName,
            last_name: row.actorLastName,
            initials: row.actorInitials ?? '',
            profile: row.actorProfile ?? undefined,
        },
        count: row.requestCount,
        last_request: row.lastRequest,
    } satisfies TrainingRequestHistoryEntry));
}
