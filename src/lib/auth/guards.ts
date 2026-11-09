import { forbidden, unauthorized } from 'next/navigation';
import type { Session } from 'next-auth';
import { auth } from '@/auth';

export async function requireSession(): Promise<Session> {
    const session = await auth();
    if (!session) {
        unauthorized();
    }
    return session;
}

type Permissions = Session['user']['permissions'];
type BooleanPermission = {
    [K in keyof Permissions]: Permissions[K] extends boolean ? K : never;
}[keyof Permissions];

function permissionGuard(flag: BooleanPermission) {
    return async (): Promise<Session> => {
        const session = await requireSession();
        if (!session.user.permissions[flag]) {
            forbidden();
        }
        return session;
    };
}

export const requireMember = permissionGuard('is_member');
export const requireStaff = permissionGuard('is_staff');
export const requireAdmin = permissionGuard('is_admin');
export const requireTrainingStaff = permissionGuard('is_training_staff');
export const requireTrainingAdmin = permissionGuard('is_training_admin');
export const requireAuditLogViewer = permissionGuard('can_view_audit_log');
