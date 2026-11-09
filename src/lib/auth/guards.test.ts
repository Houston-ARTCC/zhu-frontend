import type { Session } from 'next-auth';
import { beforeEach, expect, test, vi } from 'vitest';
import {
    requireAdmin,
    requireAuditLogViewer,
    requireMember,
    requireSession,
    requireStaff,
    requireTrainingAdmin,
    requireTrainingStaff,
} from './guards';

const { auth } = vi.hoisted(() => ({ auth: vi.fn<() => Promise<Session | null>>() }));
vi.mock('@/auth', () => ({ auth }));

// Set by next.config's experimental.authInterrupts at build time.
process.env.__NEXT_EXPERIMENTAL_AUTH_INTERRUPTS = 'true';
const FORBIDDEN = 'NEXT_HTTP_ERROR_FALLBACK;403';
const UNAUTHORIZED = 'NEXT_HTTP_ERROR_FALLBACK;401';

function sessionWith(permissions: Partial<Session['user']['permissions']>): Session {
    return {
        user: {
            cid: 1,
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            rating: 'S1',
            home_facility: 'ZHU',
            endorsements: null,
            permissions: {
                is_member: false,
                is_staff: false,
                is_admin: false,
                is_training_staff: false,
                is_training_admin: false,
                endorsement_scope: 'own',
                can_view_audit_log: false,
                ...permissions,
            },
        },
    } as Session;
}

const cases = [
    { name: 'requireMember', guard: requireMember, grant: { is_member: true } },
    { name: 'requireStaff', guard: requireStaff, grant: { is_staff: true } },
    { name: 'requireAdmin', guard: requireAdmin, grant: { is_admin: true } },
    { name: 'requireTrainingStaff', guard: requireTrainingStaff, grant: { is_training_staff: true } },
    { name: 'requireTrainingAdmin', guard: requireTrainingAdmin, grant: { is_training_admin: true } },
    { name: 'requireAuditLogViewer', guard: requireAuditLogViewer, grant: { can_view_audit_log: true } },
] as const;

function signIn(session: Session | null) {
    auth.mockResolvedValue(session);
}

beforeEach(() => signIn(null));

test('requireSession returns the session when present', async () => {
    const session = sessionWith({});
    signIn(session);
    await expect(requireSession()).resolves.toBe(session);
});

test('requireSession renders the 401 page when signed out', async () => {
    await expect(requireSession()).rejects.toThrow(UNAUTHORIZED);
});

test.each(cases)('$name returns the session when the permission is set', async ({ guard, grant }) => {
    const session = sessionWith(grant);
    signIn(session);
    await expect(guard()).resolves.toBe(session);
});

test.each(cases)('$name renders the 403 page when the permission is missing', async ({ guard }) => {
    signIn(sessionWith({}));
    await expect(guard()).rejects.toThrow(FORBIDDEN);
});

test.each(cases)('$name renders the 401 page when signed out', async ({ guard }) => {
    await expect(guard()).rejects.toThrow(UNAUTHORIZED);
});
