import 'dotenv/config';

import { lte } from 'drizzle-orm';
import { db } from '@/lib/db';
import { trainingTrainingrequest } from '@/lib/db/schema';
import { logDelete } from '@/lib/auditlog/log';

const TRAINING_REQUEST_MODEL = { appLabel: 'training', modelName: 'trainingrequest' };

async function main(): Promise<void> {
    const expired = await db
        .select()
        .from(trainingTrainingrequest)
        .where(lte(trainingTrainingrequest.end, new Date().toISOString()));

    for (const row of expired) {
        await logDelete(TRAINING_REQUEST_MODEL, row as Record<string, unknown>, null);
    }

    await db
        .delete(trainingTrainingrequest)
        .where(lte(trainingTrainingrequest.end, new Date().toISOString()));

    console.log(`Cleared ${expired.length} expired training requests`);
    process.exit(0);
}

main().catch((err) => {
    console.error('fatal:', err);
    process.exit(1);
});
