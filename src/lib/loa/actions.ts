'use server';

import React from 'react';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { loaLoa, usersUser } from '@/lib/db/schema';
import { requireAdmin, requireMember } from '@/lib/auth/guards';
import { logCreate, logDelete, logUpdate } from '@/lib/auditlog/log';
import { LoaApprovedEmail } from '@/lib/loa/emails/LoaApprovedEmail';
import { LoaCancelledEmail } from '@/lib/loa/emails/LoaCancelledEmail';
import { LoaRejectedEmail } from '@/lib/loa/emails/LoaRejectedEmail';
import { sendMail } from '@/lib/mailer/send';
import { FROM_MANAGEMENT } from '@/lib/mailer/transport';
import { syncUserLoaStatus } from '@/lib/loa/sync';

const LOA_MODEL = { appLabel: 'loa', modelName: 'loa' };

const requestSchema = z
    .object({
        start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        remarks: z.string().min(1),
    })
    .refine((data) => data.end >= data.start, { message: 'End must be on or after start' })
    .refine((data) => daysBetween(data.start, data.end) >= 30, {
        message: 'LOA must be at least 30 days',
    });

function daysBetween(start: string, end: string): number {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    return Math.round(ms / (1000 * 60 * 60 * 24));
}

function yesterday(): string {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
}

export type RequestLoaInput = z.infer<typeof requestSchema>;

export async function requestLoa(input: RequestLoaInput): Promise<void> {
    const session = await requireMember();
    const data = requestSchema.parse(input);

    const [row] = await db
        .insert(loaLoa)
        .values({
            userId: session.user.cid,
            start: data.start,
            end: data.end,
            remarks: data.remarks,
            approved: false,
        })
        .returning();

    await logCreate(LOA_MODEL, row as Record<string, unknown>, session.user.cid);

    revalidatePath('/dashboard/loa');
    revalidatePath('/admin/queue/loa');
}

export async function cancelOwnLoa(id: number): Promise<void> {
    const session = await requireMember();

    const [before] = await db
        .select()
        .from(loaLoa)
        .where(and(eq(loaLoa.id, id), eq(loaLoa.userId, session.user.cid)));

    if (!before) {
        throw new Error(`LOA ${id} not found or not owned by current user`);
    }

    const [row] = await db
        .update(loaLoa)
        .set({ end: yesterday() })
        .where(and(eq(loaLoa.id, id), eq(loaLoa.userId, session.user.cid)))
        .returning();

    if (!row) {
        throw new Error(`LOA ${id} not found or not owned by current user`);
    }

    await logUpdate(LOA_MODEL, before as Record<string, unknown>, row as Record<string, unknown>, session.user.cid);

    await syncUserLoaStatus(session.user.cid);

    revalidatePath('/dashboard/loa');
}

export async function approveLoa(id: number): Promise<void> {
    const session = await requireAdmin();

    const [before] = await db.select().from(loaLoa).where(eq(loaLoa.id, id));

    if (!before) {
        throw new Error(`LOA ${id} not found`);
    }

    if (before.approved) {
        throw new Error(`LOA ${id} is already approved`);
    }

    const [row] = await db
        .update(loaLoa)
        .set({ approved: true })
        .where(eq(loaLoa.id, id))
        .returning();

    if (!row) {
        throw new Error(`LOA ${id} not found`);
    }

    await logUpdate(LOA_MODEL, before as Record<string, unknown>, row as Record<string, unknown>, session.user.cid);

    const [owner] = await db
        .select({
            first_name: usersUser.firstName,
            email: usersUser.email,
        })
        .from(usersUser)
        .where(eq(usersUser.cid, row.userId));

    if (owner) {
        try {
            await sendMail({
                to: owner.email,
                from: FROM_MANAGEMENT,
                subject: 'Your LOA has been approved',
                react: React.createElement(LoaApprovedEmail, {
                    user: { first_name: owner.first_name },
                    loa: { start: row.start, end: row.end },
                }),
            });
        } catch (err) {
            console.error('loa_approved email failed:', err);
        }
    }

    revalidatePath('/admin/queue/loa');
    revalidatePath('/admin/loa');
}

export async function cancelApprovedLoa(id: number): Promise<void> {
    const session = await requireAdmin();

    const [before] = await db.select().from(loaLoa).where(eq(loaLoa.id, id));

    if (!before) {
        throw new Error(`LOA ${id} not found`);
    }

    if (!before.approved) {
        throw new Error('Pending LOAs must be rejected, not cancelled');
    }

    const [after] = await db
        .update(loaLoa)
        .set({ end: yesterday() })
        .where(eq(loaLoa.id, id))
        .returning();

    if (!after) {
        throw new Error(`LOA ${id} not found`);
    }

    await logUpdate(LOA_MODEL, before as Record<string, unknown>, after as Record<string, unknown>, session.user.cid);

    const [owner] = await db
        .select({
            first_name: usersUser.firstName,
            email: usersUser.email,
        })
        .from(usersUser)
        .where(eq(usersUser.cid, before.userId));

    if (owner) {
        try {
            await sendMail({
                to: owner.email,
                from: FROM_MANAGEMENT,
                subject: 'Your leave of absence has been cancelled',
                react: React.createElement(LoaCancelledEmail, {
                    user: { first_name: owner.first_name },
                    loa: { start: before.start, end: before.end },
                }),
            });
        } catch (err) {
            console.error('loa_cancelled email failed:', err);
        }
    }

    await syncUserLoaStatus(before.userId);

    revalidatePath('/admin/loa');
    revalidatePath('/dashboard/loa');
}

export async function rejectLoa({ id, reason }: { id: number; reason?: string }): Promise<void> {
    const session = await requireAdmin();

    const [row] = await db.select().from(loaLoa).where(eq(loaLoa.id, id));

    if (!row) {
        throw new Error(`LOA ${id} not found`);
    }

    if (row.approved) {
        throw new Error('Approved LOAs cannot be rejected');
    }

    await db.delete(loaLoa).where(eq(loaLoa.id, id));

    await logDelete(LOA_MODEL, { ...row, id } as Record<string, unknown>, session.user.cid);

    const [owner] = await db
        .select({
            first_name: usersUser.firstName,
            email: usersUser.email,
        })
        .from(usersUser)
        .where(eq(usersUser.cid, row.userId));

    if (owner) {
        try {
            await sendMail({
                to: owner.email,
                from: FROM_MANAGEMENT,
                subject: 'An update on your LOA request',
                react: React.createElement(LoaRejectedEmail, {
                    user: { first_name: owner.first_name },
                    loa: { start: row.start, end: row.end },
                    reason,
                }),
            });
        } catch (err) {
            console.error('loa_rejected email failed:', err);
        }
    }

    revalidatePath('/admin/queue/loa');
}
