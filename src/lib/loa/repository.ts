import 'server-only';
import { and, asc, eq, gte } from 'drizzle-orm';
import type { LeaveOfAbsence } from '@/types/loa';
import { db } from '@/lib/db';
import { loaLoa, usersUser } from '@/lib/db/schema';

function today(): string {
    return new Date().toISOString().slice(0, 10);
}

async function selectLoas(filter?: { userId?: number }): Promise<LeaveOfAbsence[]> {
    const conditions = [gte(loaLoa.end, today())];
    if (filter?.userId !== undefined) {
        conditions.push(eq(loaLoa.userId, filter.userId));
    }

    const rows = await db
        .select({
            id: loaLoa.id,
            start: loaLoa.start,
            end: loaLoa.end,
            remarks: loaLoa.remarks,
            approved: loaLoa.approved,
            userCid: usersUser.cid,
            userFirstName: usersUser.firstName,
            userLastName: usersUser.lastName,
            userInitials: usersUser.initials,
            userProfile: usersUser.profile,
        })
        .from(loaLoa)
        .innerJoin(usersUser, eq(usersUser.cid, loaLoa.userId))
        .where(and(...conditions))
        .orderBy(asc(loaLoa.start));

    return rows.map((row) => ({
        id: row.id,
        start: row.start,
        end: row.end,
        remarks: row.remarks,
        approved: row.approved,
        user: {
            cid: row.userCid,
            first_name: row.userFirstName,
            last_name: row.userLastName,
            initials: row.userInitials ?? '',
            profile: row.userProfile ?? undefined,
        },
    } satisfies LeaveOfAbsence));
}

export async function getCurrentUserLoas(cid: number): Promise<LeaveOfAbsence[]> {
    return selectLoas({ userId: cid });
}

export async function getAdminLoas(): Promise<LeaveOfAbsence[]> {
    return selectLoas();
}
