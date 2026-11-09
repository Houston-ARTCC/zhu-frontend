import { expect, test } from 'vitest';
import { getAdminLoas, getCurrentUserLoas } from './repository';

test('getAdminLoas returns rows shaped as LeaveOfAbsence', async () => {
    const rows = await getAdminLoas();
    expect(Array.isArray(rows)).toBe(true);
    for (const row of rows) {
        expect(typeof row.id).toBe('number');
        expect(typeof row.start).toBe('string');
        expect(typeof row.end).toBe('string');
        expect(typeof row.remarks).toBe('string');
        expect(typeof row.approved).toBe('boolean');
        expect(row.user).toBeDefined();
        expect(typeof row.user.cid).toBe('number');
        expect(row.end >= new Date().toISOString().slice(0, 10)).toBe(true);
    }
});

test('getCurrentUserLoas filters to the given cid', async () => {
    const all = await getAdminLoas();
    if (all.length === 0) {
        return;
    }
    const someCid = all[0].user.cid;
    const filtered = await getCurrentUserLoas(someCid);
    expect(filtered.every((row) => row.user.cid === someCid)).toBe(true);
});
