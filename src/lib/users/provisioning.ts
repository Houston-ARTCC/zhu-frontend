import 'server-only';

import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { usersRole, usersUser, usersUserRoles } from '@/lib/db/schema';
import { getInitials } from '@/lib/users/initials';
import { getHomeFacility } from './homeFacility';

const STATUS_ACTIVE = 0;
const STATUS_NON_MEMBER = 2;

// Shape of the VATSIM /api/user/ `data` object (only fields we consume).
export interface VatsimUserData {
    cid: number | string;
    personal: {
        email: string;
        name_first: string;
        name_last: string;
    };
    vatsim: {
        rating: { short: string };
        division: { id: string };
    };
}

export function capitalize(value: string): string {
    if (!value) {
        return value;
    }
    return value[0].toUpperCase() + value.slice(1).toLowerCase();
}

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

async function getRoleId(short: string): Promise<number | undefined> {
    const [role] = await db.select({ id: usersRole.id }).from(usersRole).where(eq(usersRole.short, short));
    return role?.id;
}

export async function setMembershipHC(cid: number): Promise<void> {
    const hcRoleId = await getRoleId('HC');
    if (hcRoleId === undefined) {
        throw new Error('HC role not found in users_role');
    }

    // If the user already has the HC role, there is nothing to do.
    const [existing] = await db
        .select({ id: usersUserRoles.id })
        .from(usersUserRoles)
        .where(and(eq(usersUserRoles.userId, cid), eq(usersUserRoles.roleId, hcRoleId)));
    if (existing) {
        return;
    }

    // Remove any existing HC/VC membership roles.
    const membershipRoleIds = (
        await db.select({ id: usersRole.id }).from(usersRole).where(inArray(usersRole.short, ['HC', 'VC']))
    ).map((row) => row.id);
    if (membershipRoleIds.length > 0) {
        await db
            .delete(usersUserRoles)
            .where(and(eq(usersUserRoles.userId, cid), inArray(usersUserRoles.roleId, membershipRoleIds)));
    }

    // Add the HC role.
    await db.insert(usersUserRoles).values({ userId: cid, roleId: hcRoleId });

    const [user] = await db.select().from(usersUser).where(eq(usersUser.cid, cid));
    if (!user) {
        throw new Error(`setMembershipHC: no user found for cid ${cid}`);
    }

    if (user.status === STATUS_NON_MEMBER) {
        await db
            .update(usersUser)
            .set({
                status: STATUS_ACTIVE,
                endorsements: defaultEndorsements(),
                initials: await getInitials(cid, user.firstName, user.lastName),
                joined: new Date().toISOString(),
                homeFacility: 'ZHU',
            })
            .where(eq(usersUser.cid, cid));
    } else {
        await db.update(usersUser).set({ homeFacility: 'ZHU' }).where(eq(usersUser.cid, cid));
    }
}

export async function upsertUserFromVatsim(data: VatsimUserData): Promise<number> {
    // VATSIM Connect returns cid as a string
    const cid = Number(data.cid);
    const [existing] = await db.select().from(usersUser).where(eq(usersUser.cid, cid));

    const homeFacility = await getHomeFacility(cid, data.vatsim.division.id, existing?.homeFacility);

    if (!existing) {
        await db.insert(usersUser).values({
            cid,
            email: data.personal.email,
            firstName: capitalize(data.personal.name_first),
            lastName: capitalize(data.personal.name_last),
            rating: data.vatsim.rating.short,
            homeFacility,
            password: '!',
            isSuperuser: false,
            status: STATUS_NON_MEMBER,
            preventEventSignup: false,
            cicEndorsed: false,
            endorsements: null,
            lastLogin: new Date().toISOString(),
        });
    } else {
        await db
            .update(usersUser)
            .set({
                email: data.personal.email,
                homeFacility,
                rating: data.vatsim.rating.short,
                lastLogin: new Date().toISOString(),
            })
            .where(eq(usersUser.cid, cid));
    }

    if (homeFacility === 'ZHU') {
        await setMembershipHC(cid);
    }

    return cid;
}
