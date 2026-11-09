import 'dotenv/config';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { usersRole, usersUser, usersUserRoles } from '@/lib/db/schema';
import { capitalize, setMembershipHC } from '@/lib/users/provisioning';
import { clearMembership, setVisitingMembership } from '@/lib/users/repository';
import { getFacilityRoster, postVisitorRosterAdd, type VatusaRosterMember } from '@/lib/vatusa/client';

const STATUS_NON_MEMBER = 2;

async function upsertRosterMember(member: VatusaRosterMember): Promise<void> {
    const [existing] = await db.select({ cid: usersUser.cid }).from(usersUser).where(eq(usersUser.cid, member.cid));

    if (existing) {
        await db
            .update(usersUser)
            .set({ email: member.email, rating: member.rating_short })
            .where(eq(usersUser.cid, member.cid));
        return;
    }

    await db.insert(usersUser).values({
        cid: member.cid,
        email: member.email,
        firstName: capitalize(member.fname),
        lastName: capitalize(member.lname),
        rating: member.rating_short,
        homeFacility: '',
        password: '!',
        isSuperuser: false,
        status: STATUS_NON_MEMBER,
        preventEventSignup: false,
        cicEndorsed: false,
        endorsements: null,
    });
}

async function cidsWithRole(short: string): Promise<number[]> {
    const rows = await db
        .select({ cid: usersUserRoles.userId })
        .from(usersUserRoles)
        .innerJoin(usersRole, eq(usersRole.id, usersUserRoles.roleId))
        .where(eq(usersRole.short, short));
    return rows.map((row) => row.cid);
}

async function syncHomeRoster(): Promise<void> {
    const roster = await getFacilityRoster('home');

    // An empty list would otherwise remove every home controller below.
    if (roster.length === 0) {
        throw new Error('VATUSA returned an empty home roster.');
    }

    for (const member of roster) {
        await upsertRosterMember(member);
        await setMembershipHC(member.cid);
    }

    const remote = new Set(roster.map((member) => member.cid));
    for (const cid of await cidsWithRole('HC')) {
        if (!remote.has(cid)) await clearMembership(cid);
    }
}

async function syncVisitRoster(): Promise<void> {
    const roster = await getFacilityRoster('visit');

    // Pulls in visitors added directly on VATUSA, who never went through the site's application.
    for (const member of roster) {
        await upsertRosterMember(member);
        await setVisitingMembership(member.cid);
    }

    // Pushes site-approved visitors up in case the POST at approval time didn't land.
    const remote = new Set(roster.map((member) => member.cid));
    for (const cid of await cidsWithRole('VC')) {
        if (!remote.has(cid)) await postVisitorRosterAdd(cid);
    }
}

async function main(): Promise<void> {
    await syncHomeRoster();
    await syncVisitRoster();

    console.log(`${new Date().toISOString()} :: sync-vatusa-roster :: SUCCESS`);
    process.exit(0);
}

main().catch((err) => {
    console.error('fatal:', err);
    process.exit(1);
});
