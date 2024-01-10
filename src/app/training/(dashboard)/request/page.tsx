import React from 'react';
import type { NextPage } from 'next';
import { LuHelpCircle } from 'react-icons/lu';
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
            <div className="rounded-md bg-indigo-500/10 py-5 pl-7 pr-10 text-indigo-500">
                <div className="flex gap-3">
                    <div className="pt-1">
                        <LuHelpCircle size={25} />
                    </div>
                    <div>
                        <h4 className="mb-0.5 text-2xl font-medium">How do I use this?</h4>
                        <p>
                            To request training, indicate the range of time for which you are <b>100% available</b>.
                            When your request is submitted, a mentor or instructor will be able to
                            accept the request and set any time within that range that works for them.
                            To select a time, drag your mouse across multiple boxes on the calendar below.
                        </p>
                    </div>
                </div>
            </div>
            <Scheduler />
        </div>
    );
};

export default RequestTraining;
