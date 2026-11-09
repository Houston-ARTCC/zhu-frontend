import { z } from 'zod';
import type { Metar } from '@/types/weather';

const VISIBILITY = /\b(?:(\d+) )?[PM]?(\d+)(?:\/(\d+))?SM\b/;
const CEILING_LAYER = /\b(?:BKN|OVC|VV)(\d{3})/g;

const metarResponse = z.array(z.object({ id: z.string(), metar: z.string() }));

// Statute miles, from 10SM, P6SM, 1/2SM, M1/4SM, or 1 1/2SM. Infinity when not reported.
function visibility(report: string): number {
    const match = VISIBILITY.exec(report);
    if (!match) return Infinity;

    const [, whole = '0', numerator, denominator = '1'] = match;
    return Number(whole) + Number(numerator) / Number(denominator);
}

// Feet to the lowest broken, overcast, or vertical-visibility layer. Infinity when there's no ceiling.
function ceiling(report: string): number {
    return Math.min(...[...report.matchAll(CEILING_LAYER)].map(([, hundreds]) => Number(hundreds) * 100));
}

export function flightRules(raw: string): Metar['flight_rules'] {
    const report = raw.split(' RMK ')[0];
    const vis = visibility(report);
    const ceil = ceiling(report);

    if (ceil < 500 || vis < 1) return 'LIFR';
    if (ceil < 1000 || vis < 3) return 'IFR';
    if (ceil <= 3000 || vis <= 5) return 'MVFR';
    return 'VFR';
}

export async function getMetars(): Promise<Metar[]> {
    const stations = process.env.POSITION_PREFIXES?.split(',').map((prefix) => `K${prefix}`);
    if (!stations) return [];

    try {
        const resp = await fetch(`https://metar.vatsim.net/${stations.join(',')}?format=json`, { next: { revalidate: 300 } });
        const reports = metarResponse.parse(await resp.json());

        return reports.map(({ id, metar }) => {
            const raw = `${id} ${metar}`;
            return { station: id, raw, flight_rules: flightRules(raw) };
        });
    } catch (err) {
        // The map still renders; popups show "METAR Unavailable".
        console.error('METAR fetch failed:', err);
        return [];
    }
}
