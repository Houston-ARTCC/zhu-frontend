import { expect, test } from 'vitest';
import { getApprovedFeedback, getPendingFeedback } from './repository';

test('getPendingFeedback returns rows shaped as Feedback', async () => {
    const rows = await getPendingFeedback();
    expect(Array.isArray(rows)).toBe(true);
    for (const row of rows) {
        expect(typeof row.id).toBe('number');
        expect(typeof row.rating).toBe('number');
        expect(typeof row.comments).toBe('string');
        expect(typeof row.created).toBe('string');
        expect(row.pilot).toBeDefined();
        expect(typeof row.pilot.cid).toBe('number');
    }
});

test('getApprovedFeedback returns rows ordered by created desc', async () => {
    const rows = await getApprovedFeedback();
    expect(Array.isArray(rows)).toBe(true);
    for (let i = 1; i < rows.length; i++) {
        expect(rows[i - 1].created >= rows[i].created).toBe(true);
    }
});
