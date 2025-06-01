import React from 'react';
import type { NextPage } from 'next';
import { LuCircleCheckBig } from 'react-icons/lu';
import { Alert, AlertTitle } from '@/components/Alert';
import { fetchApi } from '@/utils/fetch';
import type { LeaveOfAbsence } from '@/types/loa';
import { LoaRequestCard } from './LoaRequestCard';

async function getLoas(): Promise<LeaveOfAbsence[]> {
    return fetchApi(
        '/loa/admin/',
        { cache: 'no-store' },
    );
}

const LoaRequests: NextPage = async () => {
    const loas = await getLoas();

    const loaRequests = loas.filter((loa) => !loa.approved);

    if (loaRequests.length === 0) {
        return (
            <Alert color="green-500" icon={LuCircleCheckBig}>
                <AlertTitle>All caught up!</AlertTitle>
                <p>There are no pending LOA requests, check back later.</p>
            </Alert>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {loaRequests.map((request) => (
                <LoaRequestCard
                    key={request.id}
                    request={request}
                />
            ))}
        </div>
    );
};

export default LoaRequests;
