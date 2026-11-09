'use client';

import React, { useCallback, useRef, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogEntryTable } from '@/app/admin/audit/LogEntryTable';
import { TextInput } from '@/components/Forms';
import { type LogEntry } from '@/types/admin';

interface AuditLogViewProps {
    data: LogEntry[];
    totalEntries: number;
    page: number;
    pageSize: number;
    query: string;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ data, totalEntries, page, pageSize, query }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const navigate = useCallback((updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(updates)) {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        }
        startTransition(() => router.replace(`?${params.toString()}`));
    }, [router, searchParams]);

    const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);
    const onQueryUpdate = useCallback((value: string) => {
        clearTimeout(debounce.current);
        debounce.current = setTimeout(() => navigate({ query: value, page: '1' }), 300);
    }, [navigate]);

    return (
        <>
            <TextInput
                className="w-60"
                placeholder="Filter results..."
                defaultValue={query}
                onUpdate={onQueryUpdate}
            />
            <LogEntryTable
                data={data}
                totalEntries={totalEntries}
                page={page}
                pageSize={pageSize}
                setPage={(p) => { if (p !== page) navigate({ page: String(p) }); }}
                setPageSize={(ps) => { if (ps !== pageSize) navigate({ page_size: String(ps), page: '1' }); }}
                loading={isPending}
            />
        </>
    );
};
