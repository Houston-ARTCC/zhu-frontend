'use server';

import React from 'react';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { SESSION_LEVEL_STRING, SESSION_TYPE_STRING } from '@/types/training';
import { logCreate, logDelete, logUpdate } from '@/lib/auditlog/log';
import { requireMember, requireTrainingStaff } from '@/lib/auth/guards';
import { db } from '@/lib/db';
import { trainingTrainingrequest, trainingTrainingsession, usersUser } from '@/lib/db/schema';
import { sendMail } from '@/lib/mailer/send';
import { FROM_TRAINING } from '@/lib/mailer/transport';
import { TrainingCancelledEmail } from '@/lib/training/emails/TrainingCancelledEmail';
import { TrainingFiledEmail } from '@/lib/training/emails/TrainingFiledEmail';
import { TrainingScheduledEmail } from '@/lib/training/emails/TrainingScheduledEmail';
import { postSessionRecord, putSessionRecord } from '@/lib/training/ctrs';
import { getOwnTrainingRequests } from '@/lib/training/repository';
import { bookSessionSchema, requestTrainingSchema } from '@/lib/training/schema';

const TRAINING_REQUEST_MODEL = { appLabel: 'training', modelName: 'trainingrequest' };
const TRAINING_SESSION_MODEL = { appLabel: 'training', modelName: 'trainingsession' };

const MAX_ACTIVE_REQUESTS = 7;
const MAX_DAYS_AHEAD = 30;

export interface SubmitTrainingRequestInput {
    start: Date;
    end: Date;
    type: { value: number; label: string };
    level: { value: number; label: string };
    remarks?: string;
}

export async function submitTrainingRequest(input: SubmitTrainingRequestInput): Promise<void> {
    const session = await requireMember();
    const data = requestTrainingSchema.parse(input);

    const now = new Date();
    if (data.end <= data.start) {
        throw new Error('End must be after start');
    }

    const daysAhead = (data.start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (daysAhead > MAX_DAYS_AHEAD) {
        throw new Error(`Start may not be more than ${MAX_DAYS_AHEAD} days from now`);
    }

    const existing = await getOwnTrainingRequests(session.user.cid);
    if (existing.length >= MAX_ACTIVE_REQUESTS) {
        throw new Error(`You may not have more than ${MAX_ACTIVE_REQUESTS} active training requests`);
    }

    const [row] = await db
        .insert(trainingTrainingrequest)
        .values({
            userId: session.user.cid,
            start: data.start.toISOString(),
            end: data.end.toISOString(),
            type: data.type.value,
            level: data.level.value,
            remarks: data.remarks ?? null,
        })
        .returning();

    await logCreate(TRAINING_REQUEST_MODEL, row as Record<string, unknown>, session.user.cid);

    revalidatePath('/training/request');
    revalidatePath('/training/requests');
}

export async function cancelOwnTrainingRequest(id: number): Promise<void> {
    const session = await requireMember();

    const [row] = await db
        .select()
        .from(trainingTrainingrequest)
        .where(eq(trainingTrainingrequest.id, id));

    if (!row) {
        throw new Error(`Training request ${id} not found`);
    }

    if (row.userId !== session.user.cid) {
        throw new Error('Not authorized to cancel this request');
    }

    await logDelete(TRAINING_REQUEST_MODEL, row as Record<string, unknown>, session.user.cid);

    await db.delete(trainingTrainingrequest).where(eq(trainingTrainingrequest.id, id));

    revalidatePath('/training/request');
    revalidatePath('/training/requests');
}

export interface AcceptTrainingRequestInput {
    start: Date;
    end: Date;
    type: { value: number; label: string };
    level: { value: number; label: string };
    position?: string;
}

export async function acceptTrainingRequest(
    requestId: number,
    sessionInput: AcceptTrainingRequestInput,
): Promise<void> {
    const mentorSession = await requireTrainingStaff();
    const mentorCid = mentorSession.user.cid;

    const sessionData = bookSessionSchema.parse(sessionInput);

    const [request] = await db
        .select()
        .from(trainingTrainingrequest)
        .where(eq(trainingTrainingrequest.id, requestId));

    if (!request) {
        throw new Error(`Training request ${requestId} not found`);
    }

    await logDelete(TRAINING_REQUEST_MODEL, request as Record<string, unknown>, mentorCid);
    await db.delete(trainingTrainingrequest).where(eq(trainingTrainingrequest.id, requestId));

    const [trainingSession] = await db
        .insert(trainingTrainingsession)
        .values({
            studentId: request.userId,
            instructorId: mentorCid,
            start: sessionData.start.toISOString(),
            end: sessionData.end.toISOString(),
            type: sessionData.type.value,
            level: sessionData.level.value,
            position: sessionData.position ?? null,
            status: 0,
            progress: 3,
            movements: 0,
            otsStatus: 0,
            soloGranted: false,
        })
        .returning();

    await logCreate(TRAINING_SESSION_MODEL, trainingSession as Record<string, unknown>, mentorCid);

    const [student] = await db
        .select({
            first_name: usersUser.firstName,
            last_name: usersUser.lastName,
            email: usersUser.email,
        })
        .from(usersUser)
        .where(eq(usersUser.cid, request.userId));

    const [instructor] = await db
        .select({
            first_name: usersUser.firstName,
            last_name: usersUser.lastName,
            email: usersUser.email,
        })
        .from(usersUser)
        .where(eq(usersUser.cid, mentorCid));

    if (student && instructor) {
        const emailProps = {
            user: { first_name: student.first_name },
            session: {
                instructor: { full_name: `${instructor.first_name} ${instructor.last_name}` },
                start: trainingSession.start,
                end: trainingSession.end,
                position: trainingSession.position,
                type_display: SESSION_TYPE_STRING[sessionData.type.value as keyof typeof SESSION_TYPE_STRING],
                level_display: SESSION_LEVEL_STRING[sessionData.level.value as keyof typeof SESSION_LEVEL_STRING],
            },
        };

        try {
            await sendMail({
                from: FROM_TRAINING,
                to: student.email,
                cc: instructor.email,
                subject: 'Training session scheduled',
                react: React.createElement(TrainingScheduledEmail, emailProps),
            });
        } catch (err) {
            console.error('training_scheduled email failed:', err);
        }
    }

    revalidatePath('/training/requests');
    revalidatePath('/training/scheduled');
}

export interface SessionFormInput {
    instructor: number;
    start: string;
    end: string;
    type: number;
    level: number;
    ots_status: number;
    progress: number;
    movements: number;
    position: string | null;
    notes: string | null;
    solo_granted: boolean;
}

async function fetchSessionParticipants(studentId: number, instructorId: number) {
    const [student] = await db
        .select({ first_name: usersUser.firstName, last_name: usersUser.lastName, email: usersUser.email })
        .from(usersUser)
        .where(eq(usersUser.cid, studentId));

    const [instructor] = await db
        .select({ first_name: usersUser.firstName, last_name: usersUser.lastName, email: usersUser.email })
        .from(usersUser)
        .where(eq(usersUser.cid, instructorId));

    return { student, instructor };
}

function toCtrsSession(input: SessionFormInput) {
    return {
        instructorId: input.instructor,
        start: input.start,
        end: input.end,
        position: input.position,
        movements: input.movements,
        progress: input.progress,
        notes: input.notes,
        type: input.type,
        otsStatus: input.ots_status,
    };
}

async function sendFiledEmail(session: typeof trainingTrainingsession.$inferSelect) {
    if (!session.studentId || !session.instructorId) return;
    try {
        const { student, instructor } = await fetchSessionParticipants(session.studentId, session.instructorId);
        if (!student || !instructor) return;
        await sendMail({
            from: FROM_TRAINING,
            to: student.email,
            subject: 'Training session filed',
            react: React.createElement(TrainingFiledEmail, {
                user: { first_name: student.first_name },
                session: {
                    instructor: { full_name: `${instructor.first_name} ${instructor.last_name}` },
                    start: session.start,
                },
            }),
        });
    } catch (err) {
        console.error('Training filed email failed:', err);
    }
}

export async function fileSession(id: number, input: SessionFormInput): Promise<void> {
    const mentorSession = await requireTrainingStaff();
    const actorCid = mentorSession.user.cid;

    const [before] = await db
        .select()
        .from(trainingTrainingsession)
        .where(eq(trainingTrainingsession.id, id));

    if (!before) {
        throw new Error(`Training session ${id} not found`);
    }

    const ctrsId = await postSessionRecord(toCtrsSession(input), before.studentId!);

    const [after] = await db
        .update(trainingTrainingsession)
        .set({
            instructorId: input.instructor,
            start: input.start,
            end: input.end,
            type: input.type,
            level: input.level,
            otsStatus: input.ots_status,
            progress: input.progress,
            movements: input.movements,
            position: input.position,
            notes: input.notes,
            soloGranted: input.solo_granted,
            status: 1,
            ctrsId: ctrsId ?? undefined,
        })
        .where(eq(trainingTrainingsession.id, id))
        .returning();

    await sendFiledEmail(after);

    await logUpdate(TRAINING_SESSION_MODEL, before as Record<string, unknown>, after as Record<string, unknown>, actorCid);

    revalidatePath('/training/scheduled');
    revalidatePath(`/training/session/${id}/edit`);
    revalidatePath(`/training/session/${id}/file`);
}

/** Logs a completed session that wasn't booked from a training request. */
export async function logSession(studentCid: number, input: SessionFormInput): Promise<void> {
    const mentorSession = await requireTrainingStaff();

    if (new Date(input.end) < new Date(input.start)) {
        throw new Error('The end time cannot be before the start time');
    }

    const [student] = await db.select({ cid: usersUser.cid }).from(usersUser).where(eq(usersUser.cid, studentCid));
    if (!student) {
        throw new Error(`User ${studentCid} not found`);
    }

    const ctrsId = await postSessionRecord(toCtrsSession(input), studentCid);

    const [row] = await db
        .insert(trainingTrainingsession)
        .values({
            studentId: studentCid,
            instructorId: input.instructor,
            start: input.start,
            end: input.end,
            type: input.type,
            level: input.level,
            otsStatus: input.ots_status,
            progress: input.progress,
            movements: input.movements,
            position: input.position,
            notes: input.notes,
            soloGranted: input.solo_granted,
            status: 1,
            ctrsId: ctrsId ?? undefined,
        })
        .returning();

    await sendFiledEmail(row);

    await logCreate(TRAINING_SESSION_MODEL, row as Record<string, unknown>, mentorSession.user.cid);

    revalidatePath(`/training/profile/${studentCid}`);
}

export async function editSession(id: number, input: SessionFormInput): Promise<void> {
    const mentorSession = await requireTrainingStaff();
    const actorCid = mentorSession.user.cid;

    const [before] = await db
        .select()
        .from(trainingTrainingsession)
        .where(eq(trainingTrainingsession.id, id));

    if (!before) {
        throw new Error(`Training session ${id} not found`);
    }

    const [after] = await db
        .update(trainingTrainingsession)
        .set({
            instructorId: input.instructor,
            start: input.start,
            end: input.end,
            type: input.type,
            level: input.level,
            otsStatus: input.ots_status,
            progress: input.progress,
            movements: input.movements,
            position: input.position,
            notes: input.notes,
            soloGranted: input.solo_granted,
        })
        .where(eq(trainingTrainingsession.id, id))
        .returning();

    if (after.status === 1) {
        const sessionForCtrs = {
            instructorId: after.instructorId ?? input.instructor,
            start: after.start,
            end: after.end,
            position: after.position,
            movements: after.movements,
            progress: after.progress,
            notes: after.notes,
            type: after.type,
            otsStatus: after.otsStatus,
        };

        if (after.ctrsId !== null && after.ctrsId !== undefined) {
            try {
                await putSessionRecord(sessionForCtrs, after.ctrsId);
            } catch (err) {
                console.error('editSession CTRS put failed:', err);
            }
        } else {
            // POST is a prerequisite: if it throws, the action throws (no swallow).
            const ctrsId = await postSessionRecord(sessionForCtrs, after.studentId!);
            if (ctrsId !== null) {
                await db
                    .update(trainingTrainingsession)
                    .set({ ctrsId })
                    .where(eq(trainingTrainingsession.id, id));
                after.ctrsId = ctrsId;
            }
        }
    }

    await logUpdate(TRAINING_SESSION_MODEL, before as Record<string, unknown>, after as Record<string, unknown>, actorCid);

    revalidatePath(`/training/session/${id}/edit`);
    revalidatePath(`/training/session/${id}`);
}

export async function cancelSession(id: number): Promise<void> {
    const mentorSession = await requireTrainingStaff();
    const actorCid = mentorSession.user.cid;

    const [before] = await db
        .select()
        .from(trainingTrainingsession)
        .where(eq(trainingTrainingsession.id, id));

    if (!before) {
        throw new Error(`Training session ${id} not found`);
    }

    const [after] = await db
        .update(trainingTrainingsession)
        .set({ status: 2 })
        .where(eq(trainingTrainingsession.id, id))
        .returning();

    if (after.studentId && after.instructorId) {
        try {
            const { student, instructor } = await fetchSessionParticipants(after.studentId, after.instructorId);
            if (student && instructor) {
                const emailProps = {
                    user: { first_name: student.first_name },
                    session: {
                        instructor: { full_name: `${instructor.first_name} ${instructor.last_name}` },
                        start: after.start,
                    },
                };
                await sendMail({
                    from: FROM_TRAINING,
                    to: student.email,
                    cc: instructor.email,
                    subject: 'Training session cancelled',
                    react: React.createElement(TrainingCancelledEmail, emailProps),
                });
            }
        } catch (err) {
            console.error('cancelSession email failed:', err);
        }
    }

    await logUpdate(TRAINING_SESSION_MODEL, before as Record<string, unknown>, after as Record<string, unknown>, actorCid);

    revalidatePath('/training/scheduled');
}

export async function noShowSession(id: number): Promise<void> {
    const mentorSession = await requireTrainingStaff();
    const actorCid = mentorSession.user.cid;

    const [before] = await db
        .select()
        .from(trainingTrainingsession)
        .where(eq(trainingTrainingsession.id, id));

    if (!before) {
        throw new Error(`Training session ${id} not found`);
    }

    const [after] = await db
        .update(trainingTrainingsession)
        .set({ status: 3 })
        .where(eq(trainingTrainingsession.id, id))
        .returning();

    await logUpdate(TRAINING_SESSION_MODEL, before as Record<string, unknown>, after as Record<string, unknown>, actorCid);

    revalidatePath('/training/scheduled');
}
