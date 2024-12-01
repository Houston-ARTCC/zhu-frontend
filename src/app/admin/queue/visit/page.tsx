import React from 'react';
import { type NextPage } from 'next';
import { LuCheckCircle } from 'react-icons/lu';
import { Alert, AlertTitle } from '@/components/Alert';
import { fetchApi } from '@/utils/fetch';
import { type VisitRequest } from '@/types/visit';
import { VisitRequestCard } from './VisitRequestCard';

async function getVisitRequests(): Promise<VisitRequest[]> {
    return fetchApi(
        '/visit/',
        { cache: 'no-store' },
    );
}

const VisitRequests: NextPage = async () => {
    const requests = await getVisitRequests();

    if (requests.length === 0) {
        return (
            <Alert color="green-500" icon={LuCheckCircle}>
                <AlertTitle>All caught up!</AlertTitle>
                <p>There are no pending visiting requests, check back later.</p>
            </Alert>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-5">
            {requests.map((request) => (
                <VisitRequestCard
                    key={request.id}
                    request={request}
                />
            ))}
        </div>
    );
};

export default VisitRequests;
