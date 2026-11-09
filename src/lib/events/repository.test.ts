import { expect, test } from 'vitest';
import { getArchivedEvents, getEventById, getEvents, getEventScoresForUser, getPendingSupportRequests } from './repository';

test('getArchivedEvents returns rows with the expected shape', async () => {
    const rows = await getArchivedEvents();
    expect(Array.isArray(rows)).toBe(true);
    for (const row of rows) {
        expect(typeof row.id).toBe('number');
        expect(typeof row.name).toBe('string');
        expect(typeof row.start).toBe('string');
        expect(typeof row.end).toBe('string');
        expect(typeof row.host).toBe('string');
        expect(typeof row.hidden).toBe('boolean');
        expect(row.archived).toBe(true);
        expect(typeof row.available_shifts).toBe('number');
    }
});

test('getEvents returns rows with the expected shape and end >= today', async () => {
    const rows = await getEvents();
    const now = new Date();
    expect(Array.isArray(rows)).toBe(true);
    for (const row of rows) {
        expect(typeof row.id).toBe('number');
        expect(typeof row.name).toBe('string');
        expect(typeof row.start).toBe('string');
        expect(typeof row.end).toBe('string');
        expect(typeof row.host).toBe('string');
        expect(typeof row.hidden).toBe('boolean');
        expect(row.archived).toBe(false);
        expect(typeof row.available_shifts).toBe('number');
        expect(new Date(row.end).getTime()).toBeGreaterThan(now.getTime());
    }
});

test('getEventById returns the full Event shape or null', async () => {
    const events = await getEvents();
    if (events.length === 0) {
        return;
    }
    const event = await getEventById(events[0].id);
    expect(event).not.toBeNull();
    if (!event) return;
    expect(typeof event.description).toBe('string');
    expect(event.positions.enroute).toBeDefined();
    expect(event.positions.tracon).toBeDefined();
    expect(event.positions.local).toBeDefined();
    for (const bucket of [event.positions.enroute, event.positions.tracon, event.positions.local]) {
        for (const position of bucket) {
            for (const shift of position.shifts) {
                expect(typeof shift.start).toBe('string');
                expect(typeof shift.end).toBe('string');
                expect(shift.start < shift.end).toBe(true);
            }
        }
    }
});

test('getEventById returns null for an unknown id', async () => {
    const event = await getEventById(0);
    expect(event).toBeNull();
});

test('getEventScoresForUser returns scores shaped as EventScore[]', async () => {
    const scores = await getEventScoresForUser(0);
    expect(Array.isArray(scores)).toBe(true);
    for (const score of scores) {
        expect(typeof score.score).toBe('number');
        expect(score.event).toBeDefined();
        expect(typeof score.event.id).toBe('number');
        expect(score.notes).toBeDefined();
    }
});

test('getPendingSupportRequests returns rows shaped as SupportRequest', async () => {
    const rows = await getPendingSupportRequests();
    expect(Array.isArray(rows)).toBe(true);
    for (const row of rows) {
        expect(typeof row.id).toBe('number');
        expect(typeof row.name).toBe('string');
        expect(typeof row.host).toBe('string');
        expect(Array.isArray(row.requested_fields)).toBe(true);
        expect(row.user).toBeDefined();
        expect(typeof row.user.cid).toBe('number');
    }
});
