import { eq } from 'drizzle-orm';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { db } from '@/lib/db/client';
import { usersUser, usersUserRoles } from '@/lib/db/schema';
import { upsertUserFromVatsim } from './provisioning';

const TEST_CID = 999000111;

function vatsimData() {
    return {
        cid: TEST_CID,
        personal: { email: 'test@example.com', name_first: 'Test', name_last: 'User' },
        vatsim: { rating: { short: 'S1' }, division: { id: 'USA' } },
    };
}

async function cleanup() {
    await db.delete(usersUserRoles).where(eq(usersUserRoles.userId, TEST_CID));
    await db.delete(usersUser).where(eq(usersUser.cid, TEST_CID));
}

beforeEach(cleanup);
afterEach(async () => {
    await cleanup();
    vi.restoreAllMocks();
});

test('creates a new non-ZHU user as a NON_MEMBER', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(
        async () => new Response(JSON.stringify({ data: { facility: 'ZLA' } }), { status: 200 }),
    );
    await upsertUserFromVatsim(vatsimData());

    const [user] = await db.select().from(usersUser).where(eq(usersUser.cid, TEST_CID));
    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user.homeFacility).toBe('ZLA');
    expect(user.status).toBe(2);
});

test('a ZHU user is transitioned to active membership', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(
        async () => new Response(JSON.stringify({ data: { facility: 'ZHU' } }), { status: 200 }),
    );
    await upsertUserFromVatsim(vatsimData());

    const [user] = await db.select().from(usersUser).where(eq(usersUser.cid, TEST_CID));
    expect(user.status).toBe(0);
    expect(user.homeFacility).toBe('ZHU');
    expect(user.endorsements).not.toBeNull();
});

test('a second call updates rather than duplicating the user', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(
        async () => new Response(JSON.stringify({ data: { facility: 'ZLA' } }), { status: 200 }),
    );
    await upsertUserFromVatsim(vatsimData());
    await upsertUserFromVatsim(vatsimData());

    const rows = await db.select().from(usersUser).where(eq(usersUser.cid, TEST_CID));
    expect(rows).toHaveLength(1);
});
