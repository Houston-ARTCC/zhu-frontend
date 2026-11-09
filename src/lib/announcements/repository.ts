import 'server-only';
import { desc, eq } from 'drizzle-orm';
import type { Announcement } from '@/types/announcements';
import { db } from '@/lib/db';
import { announcementsAnnouncement, usersUser } from '@/lib/db/schema';

async function queryAnnouncements(limit?: number): Promise<Announcement[]> {
    const query = db
        .select({
            id: announcementsAnnouncement.id,
            title: announcementsAnnouncement.title,
            body: announcementsAnnouncement.body,
            posted: announcementsAnnouncement.posted,
            authorCid: usersUser.cid,
            authorFirstName: usersUser.firstName,
            authorLastName: usersUser.lastName,
            authorInitials: usersUser.initials,
            authorProfile: usersUser.profile,
        })
        .from(announcementsAnnouncement)
        .leftJoin(usersUser, eq(announcementsAnnouncement.authorId, usersUser.cid))
        .orderBy(desc(announcementsAnnouncement.posted));

    const rows = limit === undefined ? await query : await query.limit(limit);

    return rows.map((row) => ({
        id: row.id,
        title: row.title,
        body: row.body,
        posted: row.posted,
        author: row.authorCid === null ? null : {
            cid: row.authorCid,
            first_name: row.authorFirstName ?? '',
            last_name: row.authorLastName ?? '',
            initials: row.authorInitials ?? '',
            profile: row.authorProfile ?? undefined,
        },
    }));
}

export function getAnnouncements(): Promise<Announcement[]> {
    return queryAnnouncements();
}

export function getRecentAnnouncements(limit: number): Promise<Announcement[]> {
    return queryAnnouncements(limit);
}
