import 'server-only';
import { and, count, eq, gte, or, sql } from 'drizzle-orm';
import type { AdminNotifications, LogEntry, LogEntryAction } from '@/types/admin';
import type { Paginated } from '@/types/api';
import { db } from '@/lib/db';
import {
    auditlogLogentry,
    djangoContentType,
    eventsSupportrequest,
    feedbackFeedback,
    loaLoa,
    usersUser,
    visitVisitingapplication,
} from '@/lib/db/schema';

export async function getAdminNotifications(): Promise<AdminNotifications> {
    const today = new Date().toISOString().slice(0, 10);

    const [visiting, pendingFeedback, support, loaRequests] = await Promise.all([
        db.select({ value: count() }).from(visitVisitingapplication),
        db.select({ value: count() }).from(feedbackFeedback).where(eq(feedbackFeedback.approved, false)),
        db.select({ value: count() }).from(eventsSupportrequest),
        db
            .select({ value: count() })
            .from(loaLoa)
            .where(and(eq(loaLoa.approved, false), gte(loaLoa.end, today))),
    ]);

    return {
        visiting_applications: visiting[0].value,
        pending_feedback: pendingFeedback[0].value,
        support_requests: support[0].value,
        loa_requests: loaRequests[0].value,
    };
}

export async function getAuditLog(
    page: number,
    pageSize: number,
    query?: string,
): Promise<Paginated<LogEntry>> {
    const offset = (page - 1) * pageSize;

    const baseCondition = query
        ? or(
            sql`${auditlogLogentry.objectRepr} ILIKE ${'%' + query + '%'}`,
            sql`${auditlogLogentry.changes} ILIKE ${'%' + query + '%'}`,
            sql`EXISTS (
                SELECT 1 FROM users_user u
                WHERE u.cid = ${auditlogLogentry.actorId}
                  AND (
                      u.first_name || u.last_name || u.cid::text ILIKE ${'%' + query + '%'}
                  )
            )`,
        )
        : undefined;

    const [totalRow, rows] = await Promise.all([
        db
            .select({ value: count() })
            .from(auditlogLogentry)
            .where(baseCondition),
        db
            .select({
                id: auditlogLogentry.id,
                action: auditlogLogentry.action,
                changes: auditlogLogentry.changes,
                objectId: auditlogLogentry.objectId,
                objectRepr: auditlogLogentry.objectRepr,
                timestamp: auditlogLogentry.timestamp,
                actorCid: usersUser.cid,
                actorFirstName: usersUser.firstName,
                actorLastName: usersUser.lastName,
                actorInitials: usersUser.initials,
                actorProfile: usersUser.profile,
                contentTypeModel: djangoContentType.model,
            })
            .from(auditlogLogentry)
            .leftJoin(usersUser, eq(usersUser.cid, auditlogLogentry.actorId))
            .leftJoin(djangoContentType, eq(djangoContentType.id, auditlogLogentry.contentTypeId))
            .where(baseCondition)
            .orderBy(sql`${auditlogLogentry.id} DESC`)
            .limit(pageSize)
            .offset(offset),
    ]);

    const total = totalRow[0]?.value ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    const results: LogEntry[] = rows.map((row) => ({
        id: row.id,
        action: row.action as LogEntryAction,
        actor: row.actorCid != null
            ? {
                cid: row.actorCid,
                first_name: row.actorFirstName ?? '',
                last_name: row.actorLastName ?? '',
                initials: row.actorInitials ?? '',
                profile: row.actorProfile ?? undefined,
            }
            : null,
        changes: parseChanges(row.changes),
        content_type: row.contentTypeModel
            ? row.contentTypeModel.charAt(0).toUpperCase() + row.contentTypeModel.slice(1)
            : '',
        object_id: row.objectId ?? 0,
        object_repr: row.objectRepr,
        timestamp: row.timestamp,
    }));

    return {
        count: total,
        next: page < totalPages ? String(page + 1) : null,
        previous: page > 1 ? String(page - 1) : null,
        results,
    };
}

function parseChanges(raw: string): Record<string, [string, string]> {
    try {
        return JSON.parse(raw) as Record<string, [string, string]>;
    } catch {
        return {};
    }
}
