import { expect, test } from 'vitest';
import { getSimplifiedUsers } from './repository';

test('getSimplifiedUsers returns rows with the expected shape', async () => {
    const roster = await getSimplifiedUsers();
    expect(Array.isArray(roster.home)).toBe(true);
    expect(Array.isArray(roster.visiting)).toBe(true);
    for (const user of [...roster.home, ...roster.visiting]) {
        expect(typeof user.cid).toBe('number');
        expect(typeof user.first_name).toBe('string');
        expect(typeof user.last_name).toBe('string');
        expect(typeof user.initials).toBe('string');
    }
});
