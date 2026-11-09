import 'dotenv/config';

import { syncOnlineControllers, type VatsimController } from '@/lib/connections/online';

async function main(): Promise<void> {
    const prefixes = process.env.POSITION_PREFIXES?.split(',');
    if (!prefixes) {
        throw new Error('POSITION_PREFIXES is not configured');
    }

    const resp = await fetch('https://data.vatsim.net/v3/vatsim-data.json', { signal: AbortSignal.timeout(30000) });
    if (!resp.ok) {
        throw new Error(`VATSIM data feed failed: ${resp.status}`);
    }
    const data = (await resp.json()) as { controllers: VatsimController[] };

    await syncOnlineControllers(data.controllers, prefixes);

    console.log(`${new Date().toISOString()} :: update-online-controllers :: SUCCESS`);
    process.exit(0);
}

main().catch((err) => {
    console.error('fatal:', err);
    process.exit(1);
});
