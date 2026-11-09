'use server';

import React from 'react';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { usersUser, visitVisitingapplication } from '@/lib/db/schema';
import { requireAdmin, requireSession } from '@/lib/auth/guards';
import { logCreate, logDelete } from '@/lib/auditlog/log';
import { VisitRequestReceivedEmail } from '@/lib/visit/emails/VisitRequestReceivedEmail';
import { VisitRequestRejectedEmail } from '@/lib/visit/emails/VisitRequestRejectedEmail';
import { getVisitEligibility } from '@/lib/visit/eligibility';
import { sendMail } from '@/lib/mailer/send';
import { FROM_MANAGEMENT } from '@/lib/mailer/transport';
import { setVisitingMembership } from '@/lib/users/repository';

const VISIT_MODEL = { appLabel: 'visit', modelName: 'visitingapplication' };

const submitSchema = z.object({
    reason: z.string().min(1),
});

export type SubmitVisitInput = z.infer<typeof submitSchema>;

export async function submitVisitApplication(input: SubmitVisitInput): Promise<void> {
    const session = await requireSession();
    const data = submitSchema.parse(input);

    const eligibility = await getVisitEligibility(session.user.cid);
    if (!eligibility.is_eligible) {
        throw new Error('Not eligible to apply');
    }

    const [row] = await db
        .insert(visitVisitingapplication)
        .values({
            userId: session.user.cid,
            reason: data.reason,
            submitted: new Date().toISOString(),
        })
        .returning();

    await logCreate(VISIT_MODEL, row as Record<string, unknown>, session.user.cid);

    try {
        await sendMail({
            to: session.user.email,
            from: FROM_MANAGEMENT,
            subject: 'We have received your visiting request',
            react: React.createElement(VisitRequestReceivedEmail, {
                user: { first_name: session.user.first_name },
            }),
        });
    } catch (err) {
        console.error('visiting_request_received email failed:', err);
    }

    revalidatePath('/visit');
    revalidatePath('/admin/queue/visit');
}

export async function approveVisitApplication(id: number): Promise<void> {
    const session = await requireAdmin();

    const [row] = await db.select().from(visitVisitingapplication).where(eq(visitVisitingapplication.id, id));

    if (!row) {
        throw new Error(`Visit application ${id} not found`);
    }

    await setVisitingMembership(row.userId);
    await db.delete(visitVisitingapplication).where(eq(visitVisitingapplication.id, id));

    await logDelete(VISIT_MODEL, row as Record<string, unknown>, session.user.cid);

    revalidatePath('/admin/queue/visit');
}

export async function rejectVisitApplication({ id, reason }: { id: number; reason?: string }): Promise<void> {
    const session = await requireAdmin();

    const [row] = await db.select().from(visitVisitingapplication).where(eq(visitVisitingapplication.id, id));

    if (!row) {
        throw new Error(`Visit application ${id} not found`);
    }

    const [owner] = await db
        .select({ first_name: usersUser.firstName, email: usersUser.email })
        .from(usersUser)
        .where(eq(usersUser.cid, row.userId));

    await db.delete(visitVisitingapplication).where(eq(visitVisitingapplication.id, id));

    await logDelete(VISIT_MODEL, row as Record<string, unknown>, session.user.cid);

    if (owner) {
        try {
            await sendMail({
                to: owner.email,
                from: FROM_MANAGEMENT,
                subject: 'An update on your visiting request',
                react: React.createElement(VisitRequestRejectedEmail, {
                    user: { first_name: owner.first_name },
                    reason,
                }),
            });
        } catch (err) {
            console.error('visiting_request_rejected email failed:', err);
        }
    }

    revalidatePath('/admin/queue/visit');
}
