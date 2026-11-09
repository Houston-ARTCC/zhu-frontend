import 'server-only';
import { eq, inArray, sql } from 'drizzle-orm';
import { type PgDatabase } from 'drizzle-orm/pg-core';
import { db as defaultDb } from '@/lib/db';
import { connectionsControllersession, connectionsOnlinecontroller, usersUser } from '@/lib/db/schema';

export interface VatsimController {
    cid: number;
    callsign: string;
    logon_time: string;
}

export function isTrackedCallsign(callsign: string, prefixes: string[]): boolean {
    const parts = callsign.split('_');
    return prefixes.includes(parts[0]) && !['SUP', 'OBS'].includes(parts[parts.length - 1]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Database = PgDatabase<any, any, any>;

export async function syncOnlineControllers(
    controllers: VatsimController[],
    prefixes: string[],
    db: Database = defaultDb,
): Promise<void> {
    const connections = new Map(controllers.map((controller) => [controller.callsign, controller]));
    const now = new Date().toISOString();

    for (const online of await db.select().from(connectionsOnlinecontroller)) {
        if (connections.get(online.callsign)?.cid === online.userId) {
            await db
                .update(connectionsOnlinecontroller)
                .set({ lastUpdated: now })
                .where(eq(connectionsOnlinecontroller.id, online.id));
            continue;
        }

        // Matches OnlineController.convert_to_session: the session ends at the last update, not now.
        await db.insert(connectionsControllersession).values({
            userId: online.userId,
            callsign: online.callsign,
            start: online.onlineSince,
            duration: sql`${online.lastUpdated}::timestamptz - ${online.onlineSince}::timestamptz`,
        });
        await db.delete(connectionsOnlinecontroller).where(eq(connectionsOnlinecontroller.id, online.id));
    }

    const tracked = controllers.filter((controller) => isTrackedCallsign(controller.callsign, prefixes));
    if (tracked.length === 0) return;

    const users = await db
        .select({ cid: usersUser.cid })
        .from(usersUser)
        .where(inArray(usersUser.cid, tracked.map((controller) => controller.cid)));
    const knownCids = new Set(users.map((user) => user.cid));
    const alreadyOnline = new Set(
        (await db.select().from(connectionsOnlinecontroller)).map((online) => `${online.userId}:${online.callsign}`),
    );

    for (const controller of tracked) {
        if (!knownCids.has(controller.cid) || alreadyOnline.has(`${controller.cid}:${controller.callsign}`)) continue;

        await db.insert(connectionsOnlinecontroller).values({
            userId: controller.cid,
            callsign: controller.callsign,
            onlineSince: new Date(controller.logon_time).toISOString(),
            lastUpdated: now,
        });
    }
}
