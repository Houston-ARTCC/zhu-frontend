'use server';

import { revalidatePath } from 'next/cache';
import { and, eq, inArray } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth/guards';
import { db } from '@/lib/db';
import { usersRole, usersUser, usersUserRoles } from '@/lib/db/schema';
import { logUpdate } from '@/lib/auditlog/log';
import { deleteHomeController, deleteVisitingController } from '@/lib/vatusa/client';

const USER_MODEL = { appLabel: 'users', modelName: 'user' };

// VATUSA roster removal is best-effort; failures are logged, not surfaced.
export async function purgeUsers(cids: number[], reason: string): Promise<void> {
    const session = await requireAdmin();
    const actorCid = session.user.cid;

    await Promise.all(
        cids.map(async (cid) => {
            const [user] = await db.select().from(usersUser).where(eq(usersUser.cid, cid));
            if (!user) return;

            // Determine membership (HC/VC) before clearing roles.
            const membershipRoles = await db
                .select({ short: usersRole.short })
                .from(usersUserRoles)
                .innerJoin(usersRole, eq(usersRole.id, usersUserRoles.roleId))
                .where(and(eq(usersUserRoles.userId, cid), inArray(usersRole.short, ['HC', 'VC'])));
            const membership = membershipRoles[0]?.short ?? null;

            await db.delete(usersUserRoles).where(eq(usersUserRoles.userId, cid));
            const [after] = await db
                .update(usersUser)
                .set({ status: 2, endorsements: null })
                .where(eq(usersUser.cid, cid))
                .returning();

            if (after) {
                await logUpdate(
                    USER_MODEL,
                    user as Record<string, unknown>,
                    after as Record<string, unknown>,
                    actorCid,
                    ['password'],
                );
            }

            // Best-effort VATUSA roster removal — errors are logged, not re-thrown.
            try {
                if (membership === 'HC') {
                    await deleteHomeController(cid, reason, actorCid);
                } else if (membership === 'VC') {
                    await deleteVisitingController(cid, reason);
                }
            } catch (err) {
                console.error(`VATUSA roster remove failed for cid ${cid}:`, err);
            }
        }),
    );

    revalidatePath('/admin/purge');
    revalidatePath('/roster');
}
