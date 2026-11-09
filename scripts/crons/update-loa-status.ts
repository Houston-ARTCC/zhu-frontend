import 'dotenv/config';

import { inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { usersUser } from '@/lib/db/schema';
import { syncUserLoaStatus } from '@/lib/loa/sync';

const STATUS_ACTIVE = 0;
const STATUS_LOA = 1;

async function main(): Promise<void> {
    const users = await db
        .select({ cid: usersUser.cid })
        .from(usersUser)
        .where(inArray(usersUser.status, [STATUS_ACTIVE, STATUS_LOA]));

    console.log(`Syncing LOA status for ${users.length} users`);

    let errors = 0;

    for (const u of users) {
        try {
            await syncUserLoaStatus(u.cid);
        } catch (err) {
            errors++;
            console.error('sync failed for cid', u.cid, ':', err);
        }
    }

    console.log(`Done. errors=${errors}`);
    process.exit(0);
}

main().catch((err) => {
    console.error('fatal:', err);
    process.exit(1);
});
