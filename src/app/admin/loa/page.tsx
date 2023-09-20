import React from 'react';
import { type NextPage } from 'next';
import { LuCheckCircle } from 'react-icons/lu';
import { fetchApi } from '@/utils/fetch';
import { type LoaRequest } from '@/types/admin';
import { LoaRequestCard } from './LoaRequestCard';

async function getLoaRequests(): Promise<LoaRequest[]> {
    return fetchApi(
        '/loa/',
        { cache: 'no-store' },
    );
}

const LoaRequests: NextPage = async () => {
    const requests = await getLoaRequests();

    if (requests.length === 0) {
        return (
            <div className="rounded-md bg-emerald-500/10 py-5 pl-7 pr-10 text-emerald-500">
                <div className="flex gap-3">
                    <div className="pt-1">
                        <LuCheckCircle size={25} />
                    </div>
                    <div>
                        <h4 className="mb-0.5 text-2xl font-medium">All caught up!</h4>
                        <p>There are no pending LOA requests, check back later.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-5">
            {requests.map((request) => (
                <LoaRequestCard
                    key={request.id}
                    request={request}
                />
            ))}
        </div>
    );
};

export default LoaRequests;
