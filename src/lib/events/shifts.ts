import 'server-only';
import type { EventPosition } from '@/types/events';

export function computeShiftTimes(
    eventStart: string,
    eventEnd: string,
    shiftCount: number,
    shiftIndex: number,
): { start: string; end: string } {
    const startMs = new Date(eventStart).getTime();
    const endMs = new Date(eventEnd).getTime();
    const shiftDurationMs = (endMs - startMs) / shiftCount;

    const start = new Date(startMs + shiftDurationMs * shiftIndex).toISOString();
    const end = new Date(startMs + shiftDurationMs * (shiftIndex + 1)).toISOString();

    return { start, end };
}

export type CallsignBucket = 'enroute' | 'tracon' | 'local';

export function bucketForCallsign(callsign: string): CallsignBucket {
    const cs = callsign.toLowerCase();
    if (cs.endsWith('_ctr') || cs.endsWith('_fss') || cs.endsWith('_tmu')) return 'enroute';
    if (cs.endsWith('_app') || cs.endsWith('_dep')) return 'tracon';
    return 'local';
}

export function groupPositionsByBucket(positions: EventPosition[]): {
    enroute: EventPosition[];
    tracon: EventPosition[];
    local: EventPosition[];
} {
    const groups = {
        enroute: [] as EventPosition[],
        tracon: [] as EventPosition[],
        local: [] as EventPosition[],
    };
    for (const p of positions) {
        groups[bucketForCallsign(p.callsign)].push(p);
    }
    return groups;
}
