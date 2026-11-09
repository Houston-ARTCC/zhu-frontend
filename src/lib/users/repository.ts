import 'server-only';
import { and, asc, desc, eq, inArray, ne } from 'drizzle-orm';
import type { AuthenticatedUser, BasicUser, Roster, Staff, User } from '@/types/users';
import { db } from '@/lib/db';
import { usersRole, usersUser, usersUserRoles } from '@/lib/db/schema';
import { postVisitorRosterAdd } from '@/lib/vatusa/client';
import { getInitials } from '@/lib/users/initials';

const ACTIVE = 0;

async function queryActiveUsersByRole(roleShort: string): Promise<BasicUser[]> {
    const rows = await db
        .select({
            cid: usersUser.cid,
            firstName: usersUser.firstName,
            lastName: usersUser.lastName,
            initials: usersUser.initials,
            profile: usersUser.profile,
        })
        .from(usersUser)
        .innerJoin(usersUserRoles, eq(usersUserRoles.userId, usersUser.cid))
        .innerJoin(usersRole, eq(usersRole.id, usersUserRoles.roleId))
        .where(and(eq(usersUser.status, ACTIVE), eq(usersRole.short, roleShort)))
        .orderBy(asc(usersUser.firstName));

    return rows.map((row) => ({
        cid: row.cid,
        first_name: row.firstName,
        last_name: row.lastName,
        initials: row.initials ?? '',
        profile: row.profile ?? undefined,
    }));
}

export async function getSimplifiedUsers(): Promise<Roster<BasicUser>> {
    const [home, visiting] = await Promise.all([
        queryActiveUsersByRole('HC'),
        queryActiveUsersByRole('VC'),
    ]);
    return { home, visiting };
}

export async function getTrainingStaff(): Promise<{ ins: BasicUser[]; mtr: BasicUser[] }> {
    const [ins, mtr] = await Promise.all([
        queryActiveUsersByRole('INS'),
        queryActiveUsersByRole('MTR'),
    ]);
    return { ins, mtr };
}

const STATUS_NON_MEMBER = 2;

function defaultEndorsements() {
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

// Drops every role, not just HC/VC.
export async function clearMembership(cid: number): Promise<void> {
    await db.transaction(async (tx) => {
        await tx.delete(usersUserRoles).where(eq(usersUserRoles.userId, cid));
        await tx.update(usersUser).set({ status: STATUS_NON_MEMBER, endorsements: null }).where(eq(usersUser.cid, cid));
    });
}

// Doesn't call the VATUSA roster API; the caller does.
export async function setVisitingMembership(cid: number): Promise<void> {
    const vcRoleId = await (async () => {
        const [role] = await db.select({ id: usersRole.id }).from(usersRole).where(eq(usersRole.short, 'VC'));
        return role?.id;
    })();
    if (vcRoleId === undefined) {
        throw new Error('VC role not found in users_role');
    }

    await db.transaction(async (tx) => {
        const [existing] = await tx
            .select({ id: usersUserRoles.id })
            .from(usersUserRoles)
            .where(and(eq(usersUserRoles.userId, cid), eq(usersUserRoles.roleId, vcRoleId)));
        if (existing) {
            return;
        }

        // Remove any existing HC/VC membership roles.
        const membershipRoleIds = (
            await tx.select({ id: usersRole.id }).from(usersRole).where(inArray(usersRole.short, ['HC', 'VC']))
        ).map((row) => row.id);
        if (membershipRoleIds.length > 0) {
            await tx
                .delete(usersUserRoles)
                .where(and(eq(usersUserRoles.userId, cid), inArray(usersUserRoles.roleId, membershipRoleIds)));
        }

        // Add the VC role.
        await tx.insert(usersUserRoles).values({ userId: cid, roleId: vcRoleId });

        const [user] = await tx.select().from(usersUser).where(eq(usersUser.cid, cid));
        if (!user) {
            throw new Error(`setVisitingMembership: no user found for cid ${cid}`);
        }

        // Only update status/endorsements/initials/joined when transitioning from NON_MEMBER.
        if (user.status === STATUS_NON_MEMBER) {
            await tx
                .update(usersUser)
                .set({
                    status: ACTIVE,
                    endorsements: defaultEndorsements(),
                    initials: await getInitials(cid, user.firstName, user.lastName, tx),
                    joined: new Date().toISOString(),
                })
                .where(eq(usersUser.cid, cid));
        }
    });

    // Best-effort; a failed roster POST doesn't undo the membership.
    try {
        await postVisitorRosterAdd(cid);
    } catch (err) {
        console.error('VATUSA visitor roster add failed for cid', cid, ':', err);
    }
}

export async function getStaff(): Promise<Staff> {
    const STAFF_ROLES = ['ATM', 'DATM', 'TA', 'ATA', 'FE', 'AFE', 'EC', 'AEC', 'WM', 'AWM', 'INS', 'MTR', 'WEB'];

    const rows = await db
        .select({
            cid: usersUser.cid,
            firstName: usersUser.firstName,
            lastName: usersUser.lastName,
            initials: usersUser.initials,
            profile: usersUser.profile,
            roleShort: usersRole.short,
        })
        .from(usersUser)
        .innerJoin(usersUserRoles, eq(usersUserRoles.userId, usersUser.cid))
        .innerJoin(usersRole, eq(usersRole.id, usersUserRoles.roleId))
        .where(inArray(usersRole.short, STAFF_ROLES))
        .orderBy(asc(usersUser.firstName));

    const byRole = new Map<string, BasicUser[]>();
    for (const row of rows) {
        const user: BasicUser = {
            cid: row.cid,
            first_name: row.firstName,
            last_name: row.lastName,
            initials: row.initials ?? '',
            profile: row.profile ?? undefined,
        };
        const list = byRole.get(row.roleShort) ?? [];
        list.push(user);
        byRole.set(row.roleShort, list);
    }

    function head(short: string): BasicUser | undefined {
        return byRole.get(short)?.[0];
    }
    function many(short: string): BasicUser[] {
        return byRole.get(short) ?? [];
    }

    return {
        atm: { user: head('ATM') },
        datm: { user: head('DATM') },
        ta: { user: head('TA'), assistants: many('ATA') },
        fe: { user: head('FE'), assistants: many('AFE') },
        ec: { user: head('EC'), assistants: many('AEC') },
        wm: { user: head('WM'), assistants: many('AWM') },
        ins: many('INS'),
        mtr: many('MTR'),
        web: many('WEB'),
    };
}

const NON_MEMBER = 2;

export async function getRoster(): Promise<Roster<User>> {
    const rows = await db
        .select({
            cid: usersUser.cid,
            firstName: usersUser.firstName,
            lastName: usersUser.lastName,
            profile: usersUser.profile,
            biography: usersUser.biography,
            rating: usersUser.rating,
            homeFacility: usersUser.homeFacility,
            status: usersUser.status,
            initials: usersUser.initials,
            joined: usersUser.joined,
            endorsements: usersUser.endorsements,
            cicEndorsed: usersUser.cicEndorsed,
            roleShort: usersRole.short,
            roleLong: usersRole.long,
        })
        .from(usersUser)
        .innerJoin(usersUserRoles, eq(usersUserRoles.userId, usersUser.cid))
        .innerJoin(usersRole, eq(usersRole.id, usersUserRoles.roleId))
        .where(eq(usersUser.status, ACTIVE))
        .orderBy(asc(usersUser.firstName));

    // Group roles per user.
    const userMap = new Map<number, User & { _membership: string }>();
    for (const row of rows) {
        if (!userMap.has(row.cid)) {
            userMap.set(row.cid, {
                cid: row.cid,
                first_name: row.firstName,
                last_name: row.lastName,
                profile: row.profile ?? undefined,
                biography: row.biography ?? undefined,
                rating: { short: row.rating, long: ratingLong(row.rating) },
                home_facility: row.homeFacility,
                status: row.status,
                initials: row.initials ?? '',
                joined: row.joined ?? '',
                endorsements: buildEndorsements(row.endorsements),
                cic_endorsed: row.cicEndorsed,
                roles: [],
                _membership: '',
            });
        }
        const user = userMap.get(row.cid)!;
        user.roles.push({ short: row.roleShort, long: row.roleLong });
        if (row.roleShort === 'HC' || row.roleShort === 'VC') {
            user._membership = row.roleShort;
        }
    }

    const home: User[] = [];
    const visiting: User[] = [];
    for (const user of userMap.values()) {
        const { _membership, ...rest } = user;
        if (_membership === 'HC') home.push(rest);
        else if (_membership === 'VC') visiting.push(rest);
    }

    return { home, visiting };
}

export async function getNewestControllers(limit: number): Promise<BasicUser[]> {
    const rows = await db
        .select({
            cid: usersUser.cid,
            firstName: usersUser.firstName,
            lastName: usersUser.lastName,
            initials: usersUser.initials,
            profile: usersUser.profile,
        })
        .from(usersUser)
        .where(ne(usersUser.status, NON_MEMBER))
        .orderBy(desc(usersUser.joined))
        .limit(limit);

    return rows.map((row) => ({
        cid: row.cid,
        first_name: row.firstName,
        last_name: row.lastName,
        initials: row.initials ?? '',
        profile: row.profile ?? undefined,
    }));
}

const RATING_LONG: Record<string, string> = {
    '': 'Unknown',
    'OBS': 'Observer',
    'S1': 'Student 1',
    'S2': 'Student 2',
    'S3': 'Student 3',
    'C1': 'Controller',
    'C3': 'Senior Controller',
    'I1': 'Instructor',
    'I3': 'Senior Instructor',
    'SUP': 'Supervisor',
    'ADM': 'Administrator',
};

function ratingLong(short: string): string {
    return RATING_LONG[short] ?? short;
}

function buildEndorsements(raw: unknown): User['endorsements'] {
    const e = (raw as Record<string, boolean | string>) ?? {};
    return {
        gnd: e.gnd ?? false,
        hou_gnd: e.hou_gnd ?? false,
        iah_gnd: e.iah_gnd ?? false,
        twr: e.twr ?? false,
        hou_twr: e.hou_twr ?? false,
        iah_twr: e.iah_twr ?? false,
        app: e.app ?? false,
        i90: e.i90 ?? false,
        zhu: e.zhu ?? false,
    };
}

export async function getAuthenticatedUserById(cid: number): Promise<AuthenticatedUser | null> {
    const rows = await db
        .select({
            cid: usersUser.cid,
            email: usersUser.email,
            firstName: usersUser.firstName,
            lastName: usersUser.lastName,
            profile: usersUser.profile,
            biography: usersUser.biography,
            rating: usersUser.rating,
            homeFacility: usersUser.homeFacility,
            status: usersUser.status,
            initials: usersUser.initials,
            joined: usersUser.joined,
            endorsements: usersUser.endorsements,
            cicEndorsed: usersUser.cicEndorsed,
            preventEventSignup: usersUser.preventEventSignup,
            lastLogin: usersUser.lastLogin,
            roleShort: usersRole.short,
            roleLong: usersRole.long,
        })
        .from(usersUser)
        .leftJoin(usersUserRoles, eq(usersUserRoles.userId, usersUser.cid))
        .leftJoin(usersRole, eq(usersRole.id, usersUserRoles.roleId))
        .where(and(eq(usersUser.cid, cid), ne(usersUser.status, STATUS_NON_MEMBER)));

    if (rows.length === 0) return null;

    const first = rows[0]!;
    const user: AuthenticatedUser = {
        cid: first.cid,
        email: first.email,
        first_name: first.firstName,
        last_name: first.lastName,
        profile: first.profile ?? undefined,
        biography: first.biography ?? undefined,
        rating: { short: first.rating, long: ratingLong(first.rating) },
        home_facility: first.homeFacility,
        status: first.status,
        initials: first.initials ?? '',
        joined: first.joined ?? '',
        endorsements: buildEndorsements(first.endorsements),
        cic_endorsed: first.cicEndorsed,
        prevent_event_signup: first.preventEventSignup,
        last_login: first.lastLogin ?? '',
        roles: [],
    };

    for (const row of rows) {
        if (row.roleShort && row.roleLong) {
            if (!user.roles.some((r) => r.short === row.roleShort)) {
                user.roles.push({ short: row.roleShort, long: row.roleLong });
            }
        }
    }

    return user;
}
