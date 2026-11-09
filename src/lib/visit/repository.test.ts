import { expect, test } from 'vitest';
import { getPendingVisitApplications } from './repository';

test('getPendingVisitApplications returns rows shaped as VisitRequest', async () => {
    const rows = await getPendingVisitApplications();
    expect(Array.isArray(rows)).toBe(true);
    for (const row of rows) {
        expect(typeof row.id).toBe('number');
        expect(typeof row.reason).toBe('string');
        expect(row.user).toBeDefined();
        expect(typeof row.user.cid).toBe('number');
    }
});
