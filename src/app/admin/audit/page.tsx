'use client';

import { useEffect, useState } from 'react';
import { type NextPage } from 'next';
import { LogEntryTable } from '@/app/admin/audit/LogEntryTable';
import { TextInput } from '@/components/Forms';
import { fetchApi } from '@/utils/fetch';
import { type LogEntry } from '@/types/admin';
import { type Paginated } from '@/types/api';

const AuditLog: NextPage = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);
    const [query, setQuery] = useState<string>('');

    const [totalEntries, setTotalEntries] = useState<number>(0);
    const [logEntries, setLogEntries] = useState<LogEntry[]>([]);

    useEffect(() => {
        setLoading(true);

        fetchApi<Paginated<LogEntry>>(
            `/administration/audit/?page=${page}&page_size=${pageSize}&query=${query}`,
            { cache: 'no-store' },
        )
            .then((data) => {
                setTotalEntries(data.count);
                setLogEntries(data.results);
                setLoading(false);
            });
    }, [page, pageSize, query]);

    return (
        <>
            <TextInput
                className="w-60"
                placeholder="Filter results..."
                onUpdate={setQuery}
            />
            <LogEntryTable
                data={logEntries}
                totalEntries={totalEntries}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                loading={loading}
            />
        </>
    );
};

export default AuditLog;
