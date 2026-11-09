import { expect, test } from 'vitest';
import { getAnnouncements, getRecentAnnouncements } from './repository';

test('getAnnouncements returns announcements newest-first with an author', async () => {
    const announcements = await getAnnouncements();
    expect(announcements.length).toBeGreaterThan(0);

    const first = announcements[0];
    expect(typeof first.id).toBe('number');
    expect(typeof first.title).toBe('string');
    expect(typeof first.body).toBe('string');
    expect(typeof first.posted).toBe('string');
    expect(first.author).not.toBeNull();
    expect(typeof first.author?.cid).toBe('number');

    const postedTimes = announcements.map((a) => new Date(a.posted).getTime());
    const sorted = [...postedTimes].sort((a, b) => b - a);
    expect(postedTimes).toEqual(sorted);
});

test('getRecentAnnouncements caps the result at the given limit', async () => {
    const recent = await getRecentAnnouncements(4);
    expect(recent.length).toBeLessThanOrEqual(4);
});
