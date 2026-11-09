import 'dotenv/config';

import { eq, ne } from 'drizzle-orm';
import { db } from '@/lib/db';
import { usersUser } from '@/lib/db/schema';

const STATUS_NON_MEMBER = 2;

function ratingIntToShort(ratingInt: number): string {
    switch (ratingInt) {
        case 1: return 'OBS';
        case 2: return 'S1';
        case 3: return 'S2';
        case 4: return 'S3';
        case 5: return 'C1';
        case 7: return 'C3';
        case 8: return 'I1';
        case 10: return 'I3';
        case 11: return 'SUP';
        case 12: return 'ADM';
        default: return '';
    }
}

async function updateRating(cid: number): Promise<void> {
    const resp = await fetch(`https://api.vatsim.net/api/ratings/${cid}`, {
        signal: AbortSignal.timeout(10000),
    });
    if (!resp.ok) {
        return;
    }
    const data = (await resp.json()) as { rating?: number };
    const short = ratingIntToShort(data.rating ?? 0);
    if (short) {
        await db.update(usersUser).set({ rating: short }).where(eq(usersUser.cid, cid));
    }
}

async function main(): Promise<void> {
    const users = await db
        .select({ cid: usersUser.cid })
        .from(usersUser)
        .where(ne(usersUser.status, STATUS_NON_MEMBER));

    console.log(`Updating ratings for ${users.length} users`);

    let errors = 0;

    for (const u of users) {
        try {
            await updateRating(u.cid);
        } catch (err) {
            errors++;
            console.error('update_rating failed for cid', u.cid, ':', err);
        }
    }

    console.log(`Done. errors=${errors}`);
    process.exit(0);
}

main().catch((err) => {
    console.error('fatal:', err);
    process.exit(1);
});
