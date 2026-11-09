import React from 'react';
import { type NextPage } from 'next';
import { LuCircleCheckBig } from 'react-icons/lu';
import { Alert, AlertTitle } from '@/components/Alert';
import { requireAdmin } from '@/lib/auth/guards';
import { getPendingVisitApplications } from '@/lib/visit/repository';
import { VisitRequestCard } from './VisitRequestCard';

const VisitRequests: NextPage = async () => {
    await requireAdmin();
    const requests = await getPendingVisitApplications();

    if (requests.length === 0) {
        return (
            <Alert color="green-500" icon={LuCircleCheckBig}>
                <AlertTitle>All caught up!</AlertTitle>
                <p>There are no pending visiting requests, check back later.</p>
            </Alert>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
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
