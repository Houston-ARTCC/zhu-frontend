import React from 'react';
import { type NextPage } from 'next';
import { LuCircleCheckBig } from 'react-icons/lu';
import { Alert, AlertTitle } from '@/components/Alert';
import { getPendingSupportRequests } from '@/lib/events/repository';
import { SupportRequestCard } from './SupportRequestCard';

const EventSupportRequests: NextPage = async () => {
    const requests = await getPendingSupportRequests();

    if (requests.length === 0) {
        return (
            <Alert color="green-500" icon={LuCircleCheckBig}>
                <AlertTitle>All caught up!</AlertTitle>
                <p>There are no pending event support requests, check back later.</p>
            </Alert>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {requests.map((request) => (
                <SupportRequestCard
                    key={request.id}
                    request={request}
                />
            ))}
        </div>
    );
};

export default EventSupportRequests;
