import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { usersRole, usersUser, usersUserRoles } from '@/lib/db/schema';

const STAFF_ROLES = ['ATM', 'DATM', 'TA', 'ATA', 'FE', 'AFE', 'EC', 'AEC', 'WM', 'AWM'];
const ADMIN_ROLES = ['ATM', 'DATM'];
const TRAINING_STAFF_ROLES = ['INS', 'MTR'];
const TRAINING_ADMIN_ROLES = ['ATM', 'DATM', 'TA', 'ATA'];
const AUDIT_LOG_ROLES = ['ATM', 'DATM', 'FE', 'WM'];
const STATUS_NON_MEMBER = 2;

export interface Permissions {
    is_member: boolean;
    is_training_staff: boolean;
    is_training_admin: boolean;
    is_staff: boolean;
    is_admin: boolean;
    endorsement_scope: 'all' | 'own';
    can_view_audit_log: boolean;
}

export async function getPermissions(cid: number): Promise<Permissions> {
    const [user] = await db
        .select({ status: usersUser.status, isSuperuser: usersUser.isSuperuser })
        .from(usersUser)
        .where(eq(usersUser.cid, cid));

    if (!user) {
        throw new Error(`getPermissions: no user with cid ${cid}`);
    }

    const roleRows = await db
        .select({ short: usersRole.short })
        .from(usersUserRoles)
        .innerJoin(usersRole, eq(usersUserRoles.roleId, usersRole.id))
        .where(eq(usersUserRoles.userId, cid));
    const shorts = new Set(roleRows.map((row) => row.short));

    const hasAny = (codes: string[]) => codes.some((code) => shorts.has(code));

    const isStaff = hasAny(STAFF_ROLES) || user.isSuperuser;
    const isAdmin = hasAny(ADMIN_ROLES) || user.isSuperuser;
    const isTrainingStaff = hasAny(TRAINING_STAFF_ROLES) || user.isSuperuser;
    const isTrainingAdmin = hasAny(TRAINING_ADMIN_ROLES) || user.isSuperuser;

    return {
        is_member: user.status !== STATUS_NON_MEMBER,
        is_staff: isStaff,
        is_admin: isAdmin,
        is_training_staff: isTrainingStaff,
        is_training_admin: isTrainingAdmin,
        endorsement_scope: (isTrainingAdmin || isStaff || shorts.has('INS')) ? 'all' : 'own',
        can_view_audit_log: hasAny(AUDIT_LOG_ROLES) || user.isSuperuser,
    };
}
