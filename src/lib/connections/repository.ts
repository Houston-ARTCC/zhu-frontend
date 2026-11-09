import 'server-only';
import { and, desc, eq, gte, isNotNull, lte, ne, sql, sum } from 'drizzle-orm';
import type {
    AdminStatistics,
    AdminUserStatistic,
    DailyStatistic,
    OnlineConnection,
    Session,
    Statistics,
    TopController,
    TopPosition,
    UserStatistic,
    UserStatusStatistics,
} from '@/types/connections';
import type { Endorsements } from '@/types/users';
import { db } from '@/lib/db';
import {
    connectionsControllersession,
    connectionsOnlinecontroller,
    usersUser,
} from '@/lib/db/schema';

const NON_MEMBER = 2;

export async function getOnlineControllers(): Promise<OnlineConnection[]> {
    const rows = await db
        .select({
            id: connectionsOnlinecontroller.id,
            callsign: connectionsOnlinecontroller.callsign,
            onlineSince: connectionsOnlinecontroller.onlineSince,
            lastUpdated: connectionsOnlinecontroller.lastUpdated,
            userCid: usersUser.cid,
            userFirstName: usersUser.firstName,
            userLastName: usersUser.lastName,
            userInitials: usersUser.initials,
            userProfile: usersUser.profile,
        })
        .from(connectionsOnlinecontroller)
        .innerJoin(usersUser, eq(usersUser.cid, connectionsOnlinecontroller.userId));

    return rows.map((row) => ({
        id: row.id,
        callsign: row.callsign,
        online_since: row.onlineSince,
        last_updated: row.lastUpdated,
        user: {
            cid: row.userCid,
            first_name: row.userFirstName,
            last_name: row.userLastName,
            initials: row.userInitials ?? '',
            profile: row.userProfile ?? undefined,
        },
    }));
}

export async function getTopControllers(limit: number): Promise<TopController[]> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

    const rows = await db
        .select({
            firstName: usersUser.firstName,
            lastName: usersUser.lastName,
            hours: sum(connectionsControllersession.duration).as('hours'),
        })
        .from(usersUser)
        .innerJoin(connectionsControllersession, eq(connectionsControllersession.userId, usersUser.cid))
        .where(
            and(
                ne(usersUser.status, NON_MEMBER),
                gte(connectionsControllersession.start, monthStart),
                lte(connectionsControllersession.start, monthEnd),
            ),
        )
        .groupBy(usersUser.cid, usersUser.firstName, usersUser.lastName)
        .having(isNotNull(sum(connectionsControllersession.duration)))
        .orderBy(desc(sum(connectionsControllersession.duration)))
        .limit(limit);

    return rows.map((row) => ({
        first_name: row.firstName,
        last_name: row.lastName,
        hours: formatInterval(row.hours),
    }));
}

// HOU_W_APP and HOU_APP count as the same position.
export async function getTopPositions(limit: number): Promise<TopPosition[]> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

    const rows = await db
        .select({
            position: sql<string>`REGEXP_REPLACE(${connectionsControllersession.callsign}, '_\\w+_', '_', 'g')`.as('position'),
            hours: sum(connectionsControllersession.duration).as('hours'),
        })
        .from(connectionsControllersession)
        .where(
            and(
                gte(connectionsControllersession.start, monthStart),
                lte(connectionsControllersession.start, monthEnd),
            ),
        )
        .groupBy(sql`REGEXP_REPLACE(${connectionsControllersession.callsign}, '_\\w+_', '_', 'g')`)
        .orderBy(desc(sum(connectionsControllersession.duration)))
        .limit(limit);

    return rows.map((row) => ({
        position: row.position,
        hours: formatInterval(row.hours),
    }));
}

export async function getDailyStatistics(year: number): Promise<DailyStatistic[]> {
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year}-12-31`;

    const rows = await db
        .select({
            date: sql<string>`DATE(${connectionsControllersession.start})`.as('date'),
            totalSeconds: sql<string>`EXTRACT(EPOCH FROM SUM(${connectionsControllersession.duration}))`.as('total_seconds'),
        })
        .from(connectionsControllersession)
        .where(
            and(
                gte(sql`DATE(${connectionsControllersession.start})`, yearStart),
                lte(sql`DATE(${connectionsControllersession.start})`, yearEnd),
            ),
        )
        .groupBy(sql`DATE(${connectionsControllersession.start})`)
        .orderBy(sql`DATE(${connectionsControllersession.start})`);

    return rows.map((row) => ({
        date: row.date,
        count: Number(row.totalSeconds) / 3600,
    }));
}

export async function getStatistics(): Promise<Statistics> {
    const now = new Date();
    const year = now.getFullYear();
    const quarter = Math.floor(now.getMonth() / 3);
    return getStatisticsForQuarter(year, quarter);
}

async function getStatisticsForQuarter(year: number, quarter: number): Promise<Statistics> {
    const m1Start = new Date(year, quarter * 3, 1);
    const m1End = new Date(year, quarter * 3 + 1, 0);
    const m2Start = new Date(year, quarter * 3 + 1, 1);
    const m2End = new Date(year, quarter * 3 + 2, 0);
    const m3Start = new Date(year, quarter * 3 + 2, 1);
    const m3End = new Date(year, quarter * 3 + 3, 0);

    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    const TRAINING_COMPLETED = 1;

    const result = await db.execute(sql`
        SELECT
            u.cid,
            u.first_name,
            u.last_name,
            u.initials,
            u.profile,
            u.rating,
            r.short AS membership,
            EXTRACT(EPOCH FROM SUM(CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m1End)} THEN cs.duration END)) AS month_1_secs,
            EXTRACT(EPOCH FROM SUM(CASE WHEN DATE(cs.start) BETWEEN ${fmt(m2Start)} AND ${fmt(m2End)} THEN cs.duration END)) AS month_2_secs,
            EXTRACT(EPOCH FROM SUM(CASE WHEN DATE(cs.start) BETWEEN ${fmt(m3Start)} AND ${fmt(m3End)} THEN cs.duration END)) AS month_3_secs,
            EXTRACT(EPOCH FROM SUM(CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)} THEN cs.duration END)) AS quarter_secs,
            EXISTS (
                SELECT 1 FROM users_user_roles ur2
                INNER JOIN users_role r2 ON r2.id = ur2.role_id
                WHERE ur2.user_id = u.cid
                  AND r2.short IN ('ATM','DATM','TA','ATA','FE','AFE','EC','AEC','WM','AWM')
            ) AS is_staff_role,
            (
                SELECT EXTRACT(EPOCH FROM SUM(ts.end - ts.start))
                FROM training_trainingsession ts
                WHERE ts.student_id = u.cid
                  AND ts.status = ${TRAINING_COMPLETED}
                  AND DATE(ts.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
            ) AS training_secs
        FROM users_user u
        INNER JOIN users_user_roles ur ON ur.user_id = u.cid
        INNER JOIN users_role r ON r.id = ur.role_id AND r.short IN ('HC', 'VC')
        LEFT JOIN connections_controllersession cs ON cs.user_id = u.cid
        WHERE u.status != ${NON_MEMBER}
        GROUP BY u.cid, u.first_name, u.last_name, u.initials, u.profile, u.rating, r.short
        ORDER BY u.first_name
    `);
    const rows = (result.rows as unknown) as Record<string, unknown>[];

    const home: UserStatistic[] = [];
    const visiting: UserStatistic[] = [];

    for (const row of rows as Record<string, unknown>[]) {
        const quarterSecs = row.quarter_secs != null ? Number(row.quarter_secs) : 0;
        const quotaSecs = row.is_staff_role ? 6 * 3600 : 3 * 3600;
        const quarterActive = quarterSecs >= quotaSecs;
        const trainingSecs = row.training_secs != null ? Number(row.training_secs) : 0;
        const trainingActive = trainingSecs >= 3 * 3600;
        const active = String(row.rating) === 'OBS' ? trainingActive : quarterActive;

        const stat: UserStatistic = {
            cid: Number(row.cid),
            first_name: String(row.first_name),
            last_name: String(row.last_name),
            initials: String(row.initials ?? ''),
            profile: row.profile ? String(row.profile) : undefined,
            rating: String(row.rating),
            month_1_hours: row.month_1_secs != null ? secsToHHMM(Number(row.month_1_secs)) : undefined,
            month_2_hours: row.month_2_secs != null ? secsToHHMM(Number(row.month_2_secs)) : undefined,
            month_3_hours: row.month_3_secs != null ? secsToHHMM(Number(row.month_3_secs)) : undefined,
            quarter_hours: row.quarter_secs != null ? secsToHHMM(quarterSecs) : undefined,
            quarter_active: active,
        };

        if (String(row.membership) === 'HC') home.push(stat);
        else visiting.push(stat);
    }

    return { home, visiting };
}

function formatInterval(interval: string | null | undefined): string {
    if (!interval) return '00:00';
    // Postgres interval strings: '01:23:45' or '00:00:00.123456'
    const parts = interval.split(':');
    const hours = parseInt(parts[0] ?? '0', 10);
    const minutes = parseInt(parts[1] ?? '0', 10);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// Converts total seconds (as returned by EXTRACT(EPOCH FROM interval)) to HH:MM.
function secsToHHMM(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// `quarter` is zero-indexed.
export async function getUserQuarterlyStatus(
    cid: number,
    year?: number,
    quarter?: number,
): Promise<UserStatusStatistics> {
    const now = new Date();
    const y = year ?? now.getFullYear();
    const q = quarter ?? Math.floor(now.getMonth() / 3);

    const m1Start = new Date(y, q * 3, 1);
    const m1End = new Date(y, q * 3 + 1, 0);
    const m2Start = new Date(y, q * 3 + 1, 1);
    const m2End = new Date(y, q * 3 + 2, 0);
    const m3Start = new Date(y, q * 3 + 2, 1);
    const m3End = new Date(y, q * 3 + 3, 0);

    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const TRAINING_COMPLETED = 1;

    const statusResult = await db.execute(sql`
        SELECT
            u.cid,
            u.rating,
            u.endorsements,
            EXISTS (
                SELECT 1 FROM users_user_roles ur2
                INNER JOIN users_role r2 ON r2.id = ur2.role_id
                WHERE ur2.user_id = u.cid
                  AND r2.short IN ('ATM','DATM','TA','ATA','FE','AFE','EC','AEC','WM','AWM')
            ) AS is_staff_role,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m1End)}
                THEN cs.duration END)) AS month_1_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m2Start)} AND ${fmt(m2End)}
                THEN cs.duration END)) AS month_2_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m3Start)} AND ${fmt(m3End)}
                THEN cs.duration END)) AS month_3_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
                THEN cs.duration END)) AS quarter_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
                     AND cs.callsign ~* '^HOU(_\\w+)?_GND$'
                THEN cs.duration END)) AS hou_gnd_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
                     AND cs.callsign ~* '^HOU(_\\w+)?_TWR$'
                THEN cs.duration END)) AS hou_twr_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
                     AND cs.callsign ~* '^IAH(_\\w+)?_GND$'
                THEN cs.duration END)) AS iah_gnd_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
                     AND cs.callsign ~* '^IAH(_\\w+)?_TWR$'
                THEN cs.duration END)) AS iah_twr_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
                     AND cs.callsign ~* '^I90(_\\w+)?_APP$'
                THEN cs.duration END)) AS i90_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
                     AND cs.callsign ~* '^HOU(_\\w+)?_CTR$'
                THEN cs.duration END)) AS zhu_secs,
            (
                SELECT EXTRACT(EPOCH FROM SUM(ts.end - ts.start))
                FROM training_trainingsession ts
                WHERE ts.student_id = u.cid
                  AND ts.status = ${TRAINING_COMPLETED}
                  AND DATE(ts.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
            ) AS training_secs
        FROM users_user u
        LEFT JOIN connections_controllersession cs ON cs.user_id = u.cid
        WHERE u.cid = ${cid}
        GROUP BY u.cid, u.rating, u.endorsements
    `);
    const [row] = (statusResult.rows as unknown) as Record<string, unknown>[];

    if (!row) {
        throw new Error(`getUserQuarterlyStatus: no user with cid ${cid}`);
    }

    const endorsements = (row.endorsements as Endorsements | null) ?? defaultEndorsements();
    const isStaffRole = Boolean(row.is_staff_role);
    const quotaSecs = isStaffRole ? 6 * 3600 : 3 * 3600;
    const quarterSecs = row.quarter_secs != null ? Number(row.quarter_secs) : 0;
    const quarterActive = quarterSecs >= quotaSecs;

    const houGndSecs = Number(row.hou_gnd_secs ?? 0);
    const houTwrSecs = Number(row.hou_twr_secs ?? 0);
    const iahGndSecs = Number(row.iah_gnd_secs ?? 0);
    const iahTwrSecs = Number(row.iah_twr_secs ?? 0);
    const i90Secs = Number(row.i90_secs ?? 0);
    const zhuSecs = Number(row.zhu_secs ?? 0);
    const trainingSecs = row.training_secs != null ? Number(row.training_secs) : 0;

    const t1Secs = computeT1Secs(endorsements, i90Secs, zhuSecs, iahGndSecs, iahTwrSecs);
    const t1Active = t1Secs >= 3 * 3600;
    const trainingActive = trainingSecs >= 3 * 3600;
    const active = String(row.rating) === 'OBS' ? trainingActive : quarterActive;

    return {
        rating: String(row.rating),
        month_1_hours: row.month_1_secs != null ? secsToHHMM(Number(row.month_1_secs)) : undefined,
        month_2_hours: row.month_2_secs != null ? secsToHHMM(Number(row.month_2_secs)) : undefined,
        month_3_hours: row.month_3_secs != null ? secsToHHMM(Number(row.month_3_secs)) : undefined,
        quarter_hours: row.quarter_secs != null ? secsToHHMM(quarterSecs) : undefined,
        quarter_active: active,
        quarter_quota: secsToHHMM(quotaSecs),
        endorsements,
        hou_gnd_hours: houGndSecs > 0 ? secsToHHMM(houGndSecs) : undefined,
        hou_twr_hours: houTwrSecs > 0 ? secsToHHMM(houTwrSecs) : undefined,
        iah_gnd_hours: iahGndSecs > 0 ? secsToHHMM(iahGndSecs) : undefined,
        iah_twr_hours: iahTwrSecs > 0 ? secsToHHMM(iahTwrSecs) : undefined,
        i90_hours: i90Secs > 0 ? secsToHHMM(i90Secs) : undefined,
        zhu_hours: zhuSecs > 0 ? secsToHHMM(zhuSecs) : undefined,
        t1_hours: t1Secs > 0 ? secsToHHMM(t1Secs) : undefined,
        t1_active: t1Active,
        training_hours: trainingSecs > 0 ? secsToHHMM(trainingSecs) : undefined,
        training_active: trainingActive,
    };
}

// HOU is tier two, with no currency requirement.
function computeT1Secs(
    e: Endorsements,
    i90Secs: number,
    zhuSecs: number,
    iahGndSecs: number,
    iahTwrSecs: number,
): number {
    if (e.zhu) return zhuSecs + i90Secs;
    if (e.i90) return i90Secs;
    if (e.iah_twr) return iahTwrSecs;
    if (e.iah_gnd) return iahGndSecs;
    return 0;
}

function defaultEndorsements(): Endorsements {
    return {
        gnd: false,
        hou_gnd: false,
        iah_gnd: false,
        twr: false,
        hou_twr: false,
        iah_twr: false,
        app: false,
        i90: false,
        zhu: false,
    };
}

export async function getAdminStatistics(): Promise<AdminStatistics> {
    const now = new Date();
    const year = now.getFullYear();
    const quarter = Math.floor(now.getMonth() / 3);
    return getAdminStatisticsForQuarter(year, quarter);
}

export async function getAdminStatisticsForQuarter(year: number, quarter: number): Promise<AdminStatistics> {
    const m1Start = new Date(year, quarter * 3, 1);
    const m1End = new Date(year, quarter * 3 + 1, 0);
    const m2Start = new Date(year, quarter * 3 + 1, 1);
    const m2End = new Date(year, quarter * 3 + 2, 0);
    const m3Start = new Date(year, quarter * 3 + 2, 1);
    const m3End = new Date(year, quarter * 3 + 3, 0);

    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const TRAINING_COMPLETED = 1;

    const result = await db.execute(sql`
        SELECT
            u.cid,
            u.first_name,
            u.last_name,
            u.initials,
            u.profile,
            u.rating,
            u.endorsements,
            r.short AS membership,
            EXISTS (
                SELECT 1 FROM users_user_roles ur2
                INNER JOIN users_role r2 ON r2.id = ur2.role_id
                WHERE ur2.user_id = u.cid
                  AND r2.short IN ('ATM','DATM','TA','ATA','FE','AFE','EC','AEC','WM','AWM')
            ) AS is_staff_role,
            EXTRACT(EPOCH FROM SUM(CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m1End)} THEN cs.duration END)) AS month_1_secs,
            EXTRACT(EPOCH FROM SUM(CASE WHEN DATE(cs.start) BETWEEN ${fmt(m2Start)} AND ${fmt(m2End)} THEN cs.duration END)) AS month_2_secs,
            EXTRACT(EPOCH FROM SUM(CASE WHEN DATE(cs.start) BETWEEN ${fmt(m3Start)} AND ${fmt(m3End)} THEN cs.duration END)) AS month_3_secs,
            EXTRACT(EPOCH FROM SUM(CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)} THEN cs.duration END)) AS quarter_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
                     AND cs.callsign ~* '^IAH(_\\w+)?_GND$'
                THEN cs.duration END)) AS iah_gnd_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
                     AND cs.callsign ~* '^IAH(_\\w+)?_TWR$'
                THEN cs.duration END)) AS iah_twr_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
                     AND cs.callsign ~* '^I90(_\\w+)?_APP$'
                THEN cs.duration END)) AS i90_secs,
            EXTRACT(EPOCH FROM SUM(
                CASE WHEN DATE(cs.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
                     AND cs.callsign ~* '^HOU(_\\w+)?_CTR$'
                THEN cs.duration END)) AS zhu_secs,
            (
                SELECT EXTRACT(EPOCH FROM SUM(ts.end - ts.start))
                FROM training_trainingsession ts
                WHERE ts.student_id = u.cid
                  AND ts.status = ${TRAINING_COMPLETED}
                  AND DATE(ts.start) BETWEEN ${fmt(m1Start)} AND ${fmt(m3End)}
            ) AS training_secs
        FROM users_user u
        INNER JOIN users_user_roles ur ON ur.user_id = u.cid
        INNER JOIN users_role r ON r.id = ur.role_id AND r.short IN ('HC', 'VC')
        LEFT JOIN connections_controllersession cs ON cs.user_id = u.cid
        WHERE u.status != ${NON_MEMBER}
        GROUP BY u.cid, u.first_name, u.last_name, u.initials, u.profile, u.rating, u.endorsements, r.short
        ORDER BY u.first_name
    `);
    const rows = (result.rows as unknown) as Record<string, unknown>[];

    const home: AdminUserStatistic[] = [];
    const visiting: AdminUserStatistic[] = [];

    for (const row of rows) {
        const isStaffRole = Boolean(row.is_staff_role);
        const quotaSecs = isStaffRole ? 6 * 3600 : 3 * 3600;
        const quarterSecs = row.quarter_secs != null ? Number(row.quarter_secs) : 0;
        const quarterActive = quarterSecs >= quotaSecs;

        const endorsements = (row.endorsements as Endorsements | null) ?? defaultEndorsements();
        const iahGndSecs = Number(row.iah_gnd_secs ?? 0);
        const iahTwrSecs = Number(row.iah_twr_secs ?? 0);
        const i90Secs = Number(row.i90_secs ?? 0);
        const zhuSecs = Number(row.zhu_secs ?? 0);
        const trainingSecs = row.training_secs != null ? Number(row.training_secs) : 0;

        const t1Secs = computeT1Secs(endorsements, i90Secs, zhuSecs, iahGndSecs, iahTwrSecs);
        const t1Active = t1Secs >= 3 * 3600;
        const trainingActive = trainingSecs >= 3 * 3600;
        const active = String(row.rating) === 'OBS' ? trainingActive : quarterActive;

        const stat: AdminUserStatistic = {
            cid: Number(row.cid),
            first_name: String(row.first_name),
            last_name: String(row.last_name),
            initials: String(row.initials ?? ''),
            profile: row.profile ? String(row.profile) : undefined,
            rating: String(row.rating),
            month_1_hours: row.month_1_secs != null ? secsToHHMM(Number(row.month_1_secs)) : undefined,
            month_2_hours: row.month_2_secs != null ? secsToHHMM(Number(row.month_2_secs)) : undefined,
            month_3_hours: row.month_3_secs != null ? secsToHHMM(Number(row.month_3_secs)) : undefined,
            quarter_hours: row.quarter_secs != null ? secsToHHMM(quarterSecs) : undefined,
            quarter_active: active,
            is_staff: isStaffRole,
            t1_hours: t1Secs > 0 ? secsToHHMM(t1Secs) : undefined,
            t1_active: t1Active,
            training_hours: trainingSecs > 0 ? secsToHHMM(trainingSecs) : undefined,
            training_active: trainingActive,
        };

        if (String(row.membership) === 'HC') home.push(stat);
        else visiting.push(stat);
    }

    return { home, visiting };
}

export async function getUserSessions(cid: number): Promise<Session[]> {
    const rows = await db
        .select({
            id: connectionsControllersession.id,
            callsign: connectionsControllersession.callsign,
            start: connectionsControllersession.start,
            duration: connectionsControllersession.duration,
        })
        .from(connectionsControllersession)
        .where(eq(connectionsControllersession.userId, cid))
        .orderBy(desc(connectionsControllersession.start));

    return rows.map((row) => ({
        id: row.id,
        callsign: row.callsign,
        start: row.start,
        duration: formatInterval(row.duration),
    }));
}

export async function getUserDailyStatistics(cid: number, year: number): Promise<DailyStatistic[]> {
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year}-12-31`;

    const rows = await db
        .select({
            date: sql<string>`DATE(${connectionsControllersession.start})`.as('date'),
            totalSeconds: sql<string>`EXTRACT(EPOCH FROM SUM(${connectionsControllersession.duration}))`.as('total_seconds'),
        })
        .from(connectionsControllersession)
        .where(
            and(
                eq(connectionsControllersession.userId, cid),
                gte(sql`DATE(${connectionsControllersession.start})`, yearStart),
                lte(sql`DATE(${connectionsControllersession.start})`, yearEnd),
            ),
        )
        .groupBy(sql`DATE(${connectionsControllersession.start})`)
        .orderBy(sql`DATE(${connectionsControllersession.start})`);

    return rows.map((row) => ({
        date: row.date,
        count: Number(row.totalSeconds) / 3600,
    }));
}

