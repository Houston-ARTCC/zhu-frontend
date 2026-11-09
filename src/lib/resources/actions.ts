'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { requireStaff } from '@/lib/auth/guards';
import { db } from '@/lib/db';
import { resourcesResource } from '@/lib/db/schema';
import { logCreate, logDelete, logUpdate } from '@/lib/auditlog/log';
import { deleteMedia, saveMedia } from '@/lib/media';
import { resourceSchema } from './schema';

const RESOURCE_MODEL = { appLabel: 'resources', modelName: 'resource' };

function safeFilename(original: string): string {
    return original.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function createResource(formData: FormData): Promise<void> {
    const session = await requireStaff();

    const raw = {
        name: formData.get('name') as string,
        category: formData.get('category') as string,
    };
    const { name, category } = resourceSchema.parse(raw);

    const file = formData.get('path') as File | null;
    if (!file || file.size === 0) throw new Error('File is required');

    const filename = safeFilename(file.name);
    const relPath = `resources/${filename}`;
    await saveMedia(relPath, Buffer.from(await file.arrayBuffer()));

    const [row] = await db
        .insert(resourcesResource)
        .values({
            name,
            category,
            path: relPath,
            updated: new Date().toISOString(),
        })
        .returning();

    await logCreate(RESOURCE_MODEL, row as Record<string, unknown>, session.user.cid, ['updated']);

    revalidatePath('/resources');
}

export async function updateResource(id: number, formData: FormData): Promise<void> {
    const session = await requireStaff();

    const raw = {
        name: formData.get('name') as string,
        category: formData.get('category') as string,
    };
    const { name, category } = resourceSchema.parse(raw);

    const [before] = await db.select().from(resourcesResource).where(eq(resourcesResource.id, id));
    if (!before) throw new Error(`Resource ${id} not found`);

    let relPath = before.path;

    const file = formData.get('path') as File | null;
    if (file && file.size > 0) {
        const filename = safeFilename(file.name);
        const newRelPath = `resources/${filename}`;
        await saveMedia(newRelPath, Buffer.from(await file.arrayBuffer()));

        if (newRelPath !== before.path) {
            await deleteMedia(before.path);
            relPath = newRelPath;
        }
    }

    const [after] = await db
        .update(resourcesResource)
        .set({ name, category, path: relPath, updated: new Date().toISOString() })
        .where(eq(resourcesResource.id, id))
        .returning();

    if (after) {
        await logUpdate(
            RESOURCE_MODEL,
            before as Record<string, unknown>,
            after as Record<string, unknown>,
            session.user.cid,
            ['updated'],
        );
    }

    revalidatePath('/resources');
}

export async function deleteResource(id: number): Promise<void> {
    const session = await requireStaff();

    const [row] = await db.select().from(resourcesResource).where(eq(resourcesResource.id, id));
    if (!row) throw new Error(`Resource ${id} not found`);

    await db.delete(resourcesResource).where(eq(resourcesResource.id, id));

    await logDelete(RESOURCE_MODEL, row as Record<string, unknown>, session.user.cid, ['updated']);

    await deleteMedia(row.path);

    revalidatePath('/resources');
}
