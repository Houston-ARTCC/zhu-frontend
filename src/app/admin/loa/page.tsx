import { type NextPage } from 'next';
import { LogEntryTable } from '@/app/admin/audit/LogEntryTable';
import { fetchApi } from '@/utils/fetch';
import { type LeaveOfAbsence } from '@/types/admin';

async function getActiveLoa(): Promise<LeaveOfAbsence> {
    return fetchApi(
        '/loa/',
        { next: { revalidate: 3600 } },
    );
}

const AuditLog: NextPage = async () => {
    const loas = await getActiveLoa();

    return (
        <LogEntryTable
            data={logEntries}
            totalEntries={totalEntries}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
        />
    );
};

export default AuditLog;
