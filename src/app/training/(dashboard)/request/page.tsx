import React from 'react';
import type { NextPage } from 'next';
import { LuHelpCircle } from 'react-icons/lu';
import { PendingRequestsTable } from '@/app/training/(dashboard)/request/PendingRequestsTable';
import { Card } from '@/components/Card';
import { fetchApi } from '@/utils/fetch';
import type { TrainingRequest } from '@/types/training';
import { Scheduler } from './Scheduler';

async function getTrainingRequests(): Promise<TrainingRequest[]> {
    return fetchApi(
        '/training/request/',
        { cache: 'no-store' },
    );
}

const RequestTraining: NextPage = async () => {
    const trainingRequests = await getTrainingRequests();

    return (
        <div className="flex flex-col gap-10">
            <Card>
                <h3 className="mb-5 text-2xl font-medium">Pending Requests</h3>
                <PendingRequestsTable data={trainingRequests} />
            </Card>
            <div className="rounded-md bg-indigo-500/10 p-5 text-indigo-500 md:pl-7 md:pr-10">
                <div className="flex gap-3">
                    <div className="pt-1">
                        <LuHelpCircle size={25} />
                    </div>
                    <div>
                        <h3 className="mb-0.5 text-2xl font-medium">How do I use this?</h3>
                        <p className="mb-3">
                            To request training, indicate the range of time for which you are <b>100% available</b>.
                            When your request is submitted, a mentor or instructor will be able to
                            accept the request and set any time within that range that works for them.
                        </p>
                        <p>
                            To select a time, drag your mouse across multiple boxes on the calendar below.
                            Alternatively, you may click anywhere on the calendar and use the date pickers in the pop-up.
                        </p>
                    </div>
                </div>
            </div>
            <Scheduler requests={trainingRequests} />
        </div>
    );
};

export default RequestTraining;
