import { expect, test } from 'vitest';
import { db } from '@/lib/db/client';
import { usersUser } from '@/lib/db/schema';
import { getPermissions } from './permissions';

test('getPermissions returns the full permission shape for a real user', async () => {
    const [user] = await db.select({ cid: usersUser.cid }).from(usersUser).limit(1);
    expect(user).toBeDefined();

    const perms = await getPermissions(user.cid);

    expect(typeof perms.is_member).toBe('boolean');
    expect(typeof perms.is_staff).toBe('boolean');
    expect(typeof perms.is_admin).toBe('boolean');
    expect(typeof perms.is_training_staff).toBe('boolean');
    expect(typeof perms.is_training_admin).toBe('boolean');
    expect(['all', 'own']).toContain(perms.endorsement_scope);
});

test('admin users are also staff (sampled, since admin roles are a subset of staff roles)', async () => {
    const rows = await db.select({ cid: usersUser.cid }).from(usersUser).limit(50);
    for (const { cid } of rows) {
        const perms = await getPermissions(cid);
        if (perms.is_admin) {
            expect(perms.is_staff).toBe(true);
        }
    }
});

test('throws for an unknown cid', async () => {
    await expect(getPermissions(-1)).rejects.toThrow();
});
