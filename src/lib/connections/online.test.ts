import { and, eq } from 'drizzle-orm';
import { TransactionRollbackError } from 'drizzle-orm/errors';
import { expect, test } from 'vitest';
import { db } from '@/lib/db';
import { connectionsControllersession, connectionsOnlinecontroller, usersUser } from '@/lib/db/schema';
import { isTrackedCallsign, syncOnlineControllers } from './online';

test('isTrackedCallsign matches facility prefixes and skips SUP and OBS', () => {
    const prefixes = ['HOU', 'IAH', 'I90'];
    expect(isTrackedCallsign('HOU_CTR', prefixes)).toBe(true);
    expect(isTrackedCallsign('I90_D_APP', prefixes)).toBe(true);
    expect(isTrackedCallsign('AUS_APP', prefixes)).toBe(false);
    expect(isTrackedCallsign('HOU_SUP', prefixes)).toBe(false);
    expect(isTrackedCallsign('IAH_OBS', prefixes)).toBe(false);
});

test('syncOnlineControllers closes stale connections, refreshes live ones, and opens new ones', async () => {
    const [userA, userB] = await db.select({ cid: usersUser.cid }).from(usersUser).limit(2);
    const now = Date.now();
    const hourAgo = new Date(now - 60 * 60 * 1000).toISOString();
    const tenMinutesAgo = new Date(now - 10 * 60 * 1000).toISOString();

    await expect(db.transaction(async (tx) => {
        await tx.delete(connectionsOnlinecontroller);
        await tx.insert(connectionsOnlinecontroller).values([
            { userId: userA.cid, callsign: 'HOU_CTR', onlineSince: hourAgo, lastUpdated: tenMinutesAgo },
            { userId: userB.cid, callsign: 'IAH_TWR', onlineSince: hourAgo, lastUpdated: tenMinutesAgo },
        ]);

        await syncOnlineControllers([
            { cid: userB.cid, callsign: 'IAH_TWR', logon_time: hourAgo },
            { cid: userA.cid, callsign: 'I90_APP', logon_time: '2026-11-08T15:37:20.1234567Z' },
            { cid: userA.cid, callsign: 'HOU_SUP', logon_time: '2026-11-08T15:37:20Z' },
            { cid: userA.cid, callsign: 'AUS_APP', logon_time: '2026-11-08T15:37:20Z' },
            { cid: 999999999, callsign: 'HOU_GND', logon_time: '2026-11-08T15:37:20Z' },
        ], ['HOU', 'IAH', 'I90'], tx);

        const online = await tx.select().from(connectionsOnlinecontroller);
        expect(online.map((row) => row.callsign).sort()).toEqual(['I90_APP', 'IAH_TWR']);
        expect(new Date(online.find((row) => row.callsign === 'I90_APP')!.onlineSince).toISOString())
            .toBe('2026-11-08T15:37:20.123Z');
        expect(new Date(online.find((row) => row.callsign === 'IAH_TWR')!.lastUpdated).getTime())
            .toBeGreaterThan(new Date(tenMinutesAgo).getTime());

        const [session] = await tx
            .select()
            .from(connectionsControllersession)
            .where(and(
                eq(connectionsControllersession.userId, userA.cid),
                eq(connectionsControllersession.callsign, 'HOU_CTR'),
                eq(connectionsControllersession.start, hourAgo),
            ));
        expect(session.duration).toBe('00:50:00');

        tx.rollback();
    })).rejects.toThrow(TransactionRollbackError);
});
