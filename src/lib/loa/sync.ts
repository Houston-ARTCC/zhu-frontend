import 'server-only';
import React from 'react';
import { and, eq, gte, lt } from 'drizzle-orm';
import { db } from '@/lib/db';
import { loaLoa, usersUser } from '@/lib/db/schema';
import { LoaActivatedEmail } from '@/lib/loa/emails/LoaActivatedEmail';
import { LoaDeactivatedEmail } from '@/lib/loa/emails/LoaDeactivatedEmail';
import { sendMail } from '@/lib/mailer/send';
import { FROM_MANAGEMENT } from '@/lib/mailer/transport';

const STATUS_ACTIVE = 0;
const STATUS_LOA = 1;

function today(): string {
    return new Date().toISOString().slice(0, 10);
}

export async function syncUserLoaStatus(cid: number): Promise<void> {
    const [user] = await db
        .select({ status: usersUser.status, firstName: usersUser.firstName, email: usersUser.email })
        .from(usersUser)
        .where(eq(usersUser.cid, cid));

    if (!user || (user.status !== STATUS_ACTIVE && user.status !== STATUS_LOA)) {
        return;
    }

    const t = today();

    if (user.status === STATUS_ACTIVE) {
        // Activate if an approved LOA covers today: start < today AND end >= today.
        const [activeLoa] = await db
            .select({ start: loaLoa.start, end: loaLoa.end })
            .from(loaLoa)
            .where(
                and(
                    eq(loaLoa.userId, cid),
                    eq(loaLoa.approved, true),
                    lt(loaLoa.start, t),
                    gte(loaLoa.end, t),
                ),
            )
            .limit(1);

        if (activeLoa) {
            await db.update(usersUser).set({ status: STATUS_LOA }).where(eq(usersUser.cid, cid));
            try {
                await sendMail({
                    to: user.email,
                    from: FROM_MANAGEMENT,
                    subject: 'See you soon!',
                    react: React.createElement(LoaActivatedEmail, {
                        user: { first_name: user.firstName },
                        loa: { start: activeLoa.start, end: activeLoa.end },
                    }),
                });
            } catch (err) {
                console.error('loa_activated email failed for cid', cid, ':', err);
            }
        }
    } else {
        // Deactivate if an approved LOA has fully ended: start < today AND end < today.
        const [endedLoa] = await db
            .select({ id: loaLoa.id })
            .from(loaLoa)
            .where(
                and(
                    eq(loaLoa.userId, cid),
                    eq(loaLoa.approved, true),
                    lt(loaLoa.start, t),
                    lt(loaLoa.end, t),
                ),
            )
            .limit(1);

        if (endedLoa) {
            await db.update(usersUser).set({ status: STATUS_ACTIVE }).where(eq(usersUser.cid, cid));
            try {
                await sendMail({
                    to: user.email,
                    from: FROM_MANAGEMENT,
                    subject: 'Welcome back!',
                    react: React.createElement(LoaDeactivatedEmail, {
                        user: { first_name: user.firstName },
                    }),
                });
            } catch (err) {
                console.error('loa_deactivated email failed for cid', cid, ':', err);
            }
        }
    }
}
