import { expect, test } from 'vitest';
import { bucketForCallsign, computeShiftTimes, groupPositionsByBucket } from './shifts';

test('computeShiftTimes splits the event duration into N equal slices', () => {
    const start = '2026-01-01T00:00:00.000Z';
    const end = '2026-01-01T04:00:00.000Z';
    const { start: s0, end: e0 } = computeShiftTimes(start, end, 4, 0);
    const { start: s1, end: e1 } = computeShiftTimes(start, end, 4, 1);
    expect(s0).toBe('2026-01-01T00:00:00.000Z');
    expect(e0).toBe('2026-01-01T01:00:00.000Z');
    expect(s1).toBe('2026-01-01T01:00:00.000Z');
    expect(e1).toBe('2026-01-01T02:00:00.000Z');
});

test('bucketForCallsign assigns suffix groups', () => {
    expect(bucketForCallsign('ZHU_CTR')).toBe('enroute');
    expect(bucketForCallsign('ZHU_FSS')).toBe('enroute');
    expect(bucketForCallsign('ZHU_TMU')).toBe('enroute');
    expect(bucketForCallsign('I90_APP')).toBe('tracon');
    expect(bucketForCallsign('I90_DEP')).toBe('tracon');
    expect(bucketForCallsign('IAH_TWR')).toBe('local');
    expect(bucketForCallsign('IAH_GND')).toBe('local');
    expect(bucketForCallsign('IAH_DEL')).toBe('local');
});

test('groupPositionsByBucket splits a flat list', () => {
    const positions = [
        { id: 1, callsign: 'ZHU_CTR', shifts: [] },
        { id: 2, callsign: 'I90_APP', shifts: [] },
        { id: 3, callsign: 'IAH_TWR', shifts: [] },
    ];
    const grouped = groupPositionsByBucket(positions);
    expect(grouped.enroute).toHaveLength(1);
    expect(grouped.tracon).toHaveLength(1);
    expect(grouped.local).toHaveLength(1);
});
