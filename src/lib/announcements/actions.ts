'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { requireStaff } from '@/lib/auth/guards';
import { db } from '@/lib/db';
import { announcementsAnnouncement } from '@/lib/db/schema';
import { logCreate, logDelete } from '@/lib/auditlog/log';
import { announcementSchema } from './schema';
import { sanitizeAnnouncementBody } from './sanitize';

const ANNOUNCEMENT_MODEL = { appLabel: 'announcements', modelName: 'announcement' };

export async function createAnnouncement(input: { title: string; body: string }): Promise<void> {
    const session = await requireStaff();
    const { title, body } = announcementSchema.parse(input);

    const [row] = await db
        .insert(announcementsAnnouncement)
        .values({
            title,
            body: sanitizeAnnouncementBody(body),
            authorId: session.user.cid,
            posted: new Date().toISOString(),
        })
        .returning();

    await logCreate(ANNOUNCEMENT_MODEL, row as Record<string, unknown>, session.user.cid);

    revalidatePath('/admin/announcements');
    revalidatePath('/');
}

export async function deleteAnnouncement(id: number): Promise<void> {
    const session = await requireStaff();

    const [row] = await db
        .select()
        .from(announcementsAnnouncement)
        .where(eq(announcementsAnnouncement.id, id));

    await db.delete(announcementsAnnouncement).where(eq(announcementsAnnouncement.id, id));

    if (row) {
        await logDelete(ANNOUNCEMENT_MODEL, row as Record<string, unknown>, session.user.cid);
    }

    revalidatePath('/admin/announcements');
    revalidatePath('/');
}
