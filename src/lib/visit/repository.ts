import 'server-only';
import { asc, eq, inArray } from 'drizzle-orm';
import type { Endorsements } from '@/types/users';
import type { VisitRequest } from '@/types/visit';
import { db } from '@/lib/db';
import { usersRole, usersUser, usersUserRoles, visitVisitingapplication } from '@/lib/db/schema';

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

export async function getPendingVisitApplications(): Promise<VisitRequest[]> {
    const rows = await db
        .select({
            id: visitVisitingapplication.id,
            reason: visitVisitingapplication.reason,
            userCid: usersUser.cid,
            userFirstName: usersUser.firstName,
            userLastName: usersUser.lastName,
            userEmail: usersUser.email,
            userRating: usersUser.rating,
            userHomeFacility: usersUser.homeFacility,
            userStatus: usersUser.status,
            userInitials: usersUser.initials,
            userProfile: usersUser.profile,
            userBiography: usersUser.biography,
            userJoined: usersUser.joined,
            userLastLogin: usersUser.lastLogin,
            userEndorsements: usersUser.endorsements,
            userPreventEventSignup: usersUser.preventEventSignup,
            userCicEndorsed: usersUser.cicEndorsed,
        })
        .from(visitVisitingapplication)
        .innerJoin(usersUser, eq(usersUser.cid, visitVisitingapplication.userId))
        .orderBy(asc(visitVisitingapplication.submitted));

    if (rows.length === 0) {
        return [];
    }

    const cids = rows.map((r) => r.userCid);
    const roleRows = await db
        .select({
            userId: usersUserRoles.userId,
            short: usersRole.short,
            long: usersRole.long,
        })
        .from(usersUserRoles)
        .innerJoin(usersRole, eq(usersRole.id, usersUserRoles.roleId))
        .where(inArray(usersUserRoles.userId, cids));

    const rolesByUser = new Map<number, { short: string; long: string }[]>();
    for (const r of roleRows) {
        const existing = rolesByUser.get(r.userId) ?? [];
        existing.push({ short: r.short, long: r.long });
        rolesByUser.set(r.userId, existing);
    }

    return rows.map((row) => ({
        id: row.id,
        reason: row.reason,
        user: {
            cid: row.userCid,
            first_name: row.userFirstName,
            last_name: row.userLastName,
            email: row.userEmail,
            rating: {
                short: row.userRating,
                long: RATING_LONG[row.userRating] ?? row.userRating,
            },
            roles: rolesByUser.get(row.userCid) ?? [],
            home_facility: row.userHomeFacility,
            status: row.userStatus,
            initials: row.userInitials ?? '',
            profile: row.userProfile ?? undefined,
            biography: row.userBiography ?? undefined,
            joined: row.userJoined ?? '',
            endorsements: (row.userEndorsements as Endorsements | null) ?? {
                gnd: false,
                hou_gnd: false,
                iah_gnd: false,
                twr: false,
                hou_twr: false,
                iah_twr: false,
                app: false,
                i90: false,
                zhu: false,
            },
            cic_endorsed: row.userCicEndorsed,
            last_login: row.userLastLogin ?? '',
            prevent_event_signup: row.userPreventEventSignup,
        },
    } satisfies VisitRequest));
}
