import { afterAll, expect, test } from 'vitest';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { auditlogLogentry } from '@/lib/db/schema';
import { type AuditModel, logCreate, logDelete, logUpdate } from './log';

// Uses the dev DB. Content type ID 9 = (announcements, announcement).
// Writes synthetic rows and cleans up after.

const ANNOUNCEMENTS: AuditModel = { appLabel: 'announcements', modelName: 'announcement' };

const insertedIds: number[] = [];

afterAll(async () => {
    if (insertedIds.length > 0) {
        for (const id of insertedIds) {
            await db.delete(auditlogLogentry).where(eq(auditlogLogentry.id, id));
        }
    }
});

async function findLatestEntry(objectPk: string) {
    const [row] = await db
        .select()
        .from(auditlogLogentry)
        .where(eq(auditlogLogentry.objectPk, objectPk))
        .orderBy(auditlogLogentry.id)
        .limit(1);
    return row;
}

test('logCreate writes a CREATE entry', async () => {
    const instance = { id: 99999, title: 'Test announcement', body: 'body', authorId: null, posted: new Date().toISOString() };
    await logCreate(ANNOUNCEMENTS, instance, null);

    const row = await findLatestEntry('99999');
    expect(row).toBeDefined();
    expect(row!.action).toBe(0);
    expect(row!.contentTypeId).toBe(9);

    const changes = JSON.parse(row!.changes);
    expect(changes.title[0]).toBe('None');
    expect(changes.title[1]).toBe('Test announcement');
    expect(changes.id).toBeUndefined();

    insertedIds.push(row!.id);
});

test('logUpdate writes an UPDATE entry with only changed fields', async () => {
    const before = { id: 99998, title: 'Old title', body: 'body' };
    const after = { id: 99998, title: 'New title', body: 'body' };
    await logUpdate(ANNOUNCEMENTS, before, after, null);

    const row = await findLatestEntry('99998');
    expect(row).toBeDefined();
    expect(row!.action).toBe(1);

    const changes = JSON.parse(row!.changes);
    expect(changes.title).toEqual(['Old title', 'New title']);
    expect(changes.body).toBeUndefined();

    insertedIds.push(row!.id);
});

test('logDelete writes a DELETE entry', async () => {
    const instance = { id: 99997, title: 'Gone', body: 'body' };
    await logDelete(ANNOUNCEMENTS, instance, null);

    const row = await findLatestEntry('99997');
    expect(row).toBeDefined();
    expect(row!.action).toBe(2);

    const changes = JSON.parse(row!.changes);
    expect(changes.title).toEqual(['Gone', 'None']);

    insertedIds.push(row!.id);
});
