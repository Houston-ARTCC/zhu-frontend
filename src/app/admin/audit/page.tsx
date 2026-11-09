import React from 'react';
import { type NextPage } from 'next';
import { requireAuditLogViewer } from '@/lib/auth/guards';
import { getAuditLog } from '@/lib/administration/repository';
import { AuditLogView } from './AuditLogView';

interface AuditLogProps {
    searchParams: Promise<{ page?: string; page_size?: string; query?: string }>;
}

const AuditLog: NextPage<AuditLogProps> = async ({ searchParams }) => {
    await requireAuditLogViewer();

    const sp = await searchParams;
    const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);
    const pageSize = Math.min(200, Math.max(1, parseInt(sp.page_size ?? '20', 10) || 20));
    const query = sp.query ?? '';

    const { count, results } = await getAuditLog(page, pageSize, query || undefined);

    return (
        <AuditLogView
            data={results}
            totalEntries={count}
            page={page}
            pageSize={pageSize}
            query={query}
        />
    );
};

export default AuditLog;
