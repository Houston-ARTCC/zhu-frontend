import 'server-only';

import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { auditlogLogentry, djangoContentType } from '@/lib/db/schema';

export interface AuditModel {
    appLabel: string;
    modelName: string;
}

// Action codes as stored in auditlog_logentry.
const ACTION_CREATE = 0;
const ACTION_UPDATE = 1;
const ACTION_DELETE = 2;

const contentTypeCache = new Map<string, number>();

async function resolveContentTypeId(model: AuditModel): Promise<number> {
    const key = `${model.appLabel}.${model.modelName}`;
    const cached = contentTypeCache.get(key);
    if (cached !== undefined) return cached;

    const [row] = await db
        .select({ id: djangoContentType.id })
        .from(djangoContentType)
        .where(
            and(
                eq(djangoContentType.appLabel, model.appLabel),
                eq(djangoContentType.model, model.modelName),
            ),
        );

    if (!row) {
        throw new Error(`No content type found for ${key}`);
    }

    contentTypeCache.set(key, row.id);
    return row.id;
}

function buildCreateChanges(
    instance: Record<string, unknown>,
    excludeFields: readonly string[],
): string {
    const changes: Record<string, [string, string]> = {};
    for (const [k, v] of Object.entries(instance)) {
        if (k === 'id' || excludeFields.includes(k)) continue;
        changes[k] = ['None', String(v ?? 'None')];
    }
    return JSON.stringify(changes);
}

function buildUpdateChanges(
    before: Record<string, unknown>,
    after: Record<string, unknown>,
    excludeFields: readonly string[],
): string {
    const changes: Record<string, [string, string]> = {};
    for (const k of Object.keys(after)) {
        if (excludeFields.includes(k)) continue;
        const bv = before[k];
        const av = after[k];
        if (String(bv ?? 'None') !== String(av ?? 'None')) {
            changes[k] = [String(bv ?? 'None'), String(av ?? 'None')];
        }
    }
    return JSON.stringify(changes);
}

function buildDeleteChanges(
    instance: Record<string, unknown>,
    excludeFields: readonly string[],
): string {
    const changes: Record<string, [string, string]> = {};
    for (const [k, v] of Object.entries(instance)) {
        if (k === 'id' || excludeFields.includes(k)) continue;
        changes[k] = [String(v ?? 'None'), 'None'];
    }
    return JSON.stringify(changes);
}

function objectRepr(model: AuditModel, instance: Record<string, unknown>): string {
    const firstName = instance.firstName ?? instance.first_name;
    const lastName = instance.lastName ?? instance.last_name;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    const name = instance.name ?? instance.title;
    if (name) return String(name);
    return `${model.modelName}#${String(instance.id ?? '')}`;
}

async function writeEntry(
    model: AuditModel,
    instance: Record<string, unknown>,
    action: number,
    changes: string,
    actorCid: number | null,
): Promise<void> {
    const contentTypeId = await resolveContentTypeId(model);
    const pk = String(instance.id ?? '');

    await db.insert(auditlogLogentry).values({
        objectPk: pk,
        objectId: typeof instance.id === 'number' ? instance.id : null,
        objectRepr: objectRepr(model, instance),
        action,
        changes,
        timestamp: new Date().toISOString(),
        actorId: actorCid,
        contentTypeId,
        remoteAddr: null,
        additionalData: null,
        serializedData: null,
    });
}

export async function logCreate(
    model: AuditModel,
    instance: Record<string, unknown>,
    actorCid: number | null,
    excludeFields: readonly string[] = [],
): Promise<void> {
    try {
        const changes = buildCreateChanges(instance, excludeFields);
        await writeEntry(model, instance, ACTION_CREATE, changes, actorCid);
    } catch (err) {
        console.error(`audit log write failed for ${model.appLabel}.${model.modelName} CREATE`, err);
    }
}

export async function logUpdate(
    model: AuditModel,
    before: Record<string, unknown>,
    after: Record<string, unknown>,
    actorCid: number | null,
    excludeFields: readonly string[] = [],
): Promise<void> {
    try {
        const changes = buildUpdateChanges(before, after, excludeFields);
        await writeEntry(model, after, ACTION_UPDATE, changes, actorCid);
    } catch (err) {
        console.error(`audit log write failed for ${model.appLabel}.${model.modelName} UPDATE`, err);
    }
}

export async function logDelete(
    model: AuditModel,
    instance: Record<string, unknown>,
    actorCid: number | null,
    excludeFields: readonly string[] = [],
): Promise<void> {
    try {
        const changes = buildDeleteChanges(instance, excludeFields);
        await writeEntry(model, instance, ACTION_DELETE, changes, actorCid);
    } catch (err) {
        console.error(`audit log write failed for ${model.appLabel}.${model.modelName} DELETE`, err);
    }
}
