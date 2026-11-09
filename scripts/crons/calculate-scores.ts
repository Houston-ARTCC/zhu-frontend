import 'dotenv/config';

import { calculateScores } from '@/lib/events/scores';

async function main(): Promise<void> {
    const result = await calculateScores();
    console.log(`Scores created: ${result.scoresCreated}, errors: ${result.errors}`);
    process.exit(0);
}

main().catch((err) => {
    console.error('fatal:', err);
    process.exit(1);
});
