'use server';

import React from 'react';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { eventsEvent, feedbackFeedback, usersUser } from '@/lib/db/schema';
import { requireAdmin, requireMember } from '@/lib/auth/guards';
import { logCreate, logDelete, logUpdate } from '@/lib/auditlog/log';
import { FeedbackReceivedEmail } from '@/lib/feedback/emails/FeedbackReceivedEmail';
import { FeedbackSubmittedEmail } from '@/lib/feedback/emails/FeedbackSubmittedEmail';
import { sendMail } from '@/lib/mailer/send';
import { FROM_MANAGEMENT } from '@/lib/mailer/transport';

const FEEDBACK_MODEL = { appLabel: 'feedback', modelName: 'feedback' };
const FEEDBACK_EXCLUDE = ['created'] as const;

const submitSchema = z.object({
    controller: z.number().int().nullable(),
    controller_callsign: z.string().max(16).optional(),
    event: z.number().int().nullable(),
    pilot_callsign: z.string().max(16).optional(),
    rating: z.number().int().min(1).max(5),
    comments: z.string().min(1),
});

export type SubmitFeedbackInput = z.infer<typeof submitSchema>;

export async function submitFeedback(input: SubmitFeedbackInput): Promise<void> {
    const session = await requireMember();
    const data = submitSchema.parse(input);

    const [row] = await db
        .insert(feedbackFeedback)
        .values({
            controllerId: data.controller,
            controllerCallsign: data.controller_callsign,
            pilotId: session.user.cid,
            pilotCallsign: data.pilot_callsign,
            rating: data.rating,
            comments: data.comments,
            eventId: data.event,
            created: new Date().toISOString(),
            approved: false,
        })
        .returning();

    let controllerForEmail: { first_name: string; last_name: string } | undefined;
    if (row.controllerId !== null) {
        const [c] = await db
            .select({ first_name: usersUser.firstName, last_name: usersUser.lastName })
            .from(usersUser)
            .where(eq(usersUser.cid, row.controllerId));
        controllerForEmail = c;
    }

    await logCreate(FEEDBACK_MODEL, row as Record<string, unknown>, session.user.cid, FEEDBACK_EXCLUDE);

    try {
        await sendMail({
            to: session.user.email,
            from: FROM_MANAGEMENT,
            subject: 'We have received your feedback',
            react: React.createElement(FeedbackSubmittedEmail, {
                user: { first_name: session.user.first_name },
                feedback: { controller: controllerForEmail },
            }),
        });
    } catch (err) {
        console.error('feedback_submitted email failed:', err);
    }

    revalidatePath('/feedback');
    revalidatePath('/admin/queue/feedback');
}

export async function approveFeedback(id: number): Promise<void> {
    const session = await requireAdmin();

    const [before] = await db
        .select()
        .from(feedbackFeedback)
        .where(eq(feedbackFeedback.id, id));

    if (!before) {
        throw new Error(`Feedback ${id} not found`);
    }

    const [row] = await db
        .update(feedbackFeedback)
        .set({ approved: true })
        .where(eq(feedbackFeedback.id, id))
        .returning();

    if (!row) {
        throw new Error(`Feedback ${id} not found`);
    }

    await logUpdate(
        FEEDBACK_MODEL,
        before as Record<string, unknown>,
        row as Record<string, unknown>,
        session.user.cid,
        FEEDBACK_EXCLUDE,
    );

    if (row.controllerId !== null) {
        const [controller] = await db
            .select({
                first_name: usersUser.firstName,
                last_name: usersUser.lastName,
                email: usersUser.email,
            })
            .from(usersUser)
            .where(eq(usersUser.cid, row.controllerId));

        if (controller) {
            let eventName: string | undefined;
            if (row.eventId !== null) {
                const [event] = await db
                    .select({ name: eventsEvent.name })
                    .from(eventsEvent)
                    .where(eq(eventsEvent.id, row.eventId));
                eventName = event?.name;
            }

            try {
                await sendMail({
                    to: controller.email,
                    from: FROM_MANAGEMENT,
                    subject: 'Somebody left you feedback',
                    react: React.createElement(FeedbackReceivedEmail, {
                        user: { first_name: controller.first_name },
                        feedback: {
                            rating: row.rating,
                            pilot_callsign: row.pilotCallsign ?? undefined,
                            event: eventName ? { name: eventName } : undefined,
                            comments: row.comments,
                        },
                    }),
                });
            } catch (err) {
                console.error('feedback_received email failed:', err);
            }
        }
    }

    revalidatePath('/admin/queue/feedback');
    revalidatePath('/admin/feedback-history');
}

export async function rejectFeedback(id: number): Promise<void> {
    const session = await requireAdmin();

    const [row] = await db
        .select()
        .from(feedbackFeedback)
        .where(eq(feedbackFeedback.id, id));

    await db.delete(feedbackFeedback).where(eq(feedbackFeedback.id, id));

    if (row) {
        await logDelete(FEEDBACK_MODEL, row as Record<string, unknown>, session.user.cid, FEEDBACK_EXCLUDE);
    }

    revalidatePath('/admin/queue/feedback');
}
