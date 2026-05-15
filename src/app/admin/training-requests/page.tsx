import React from 'react';
import { type NextPage } from 'next';
import { fetchApi } from '@/utils/fetch';
import { type TrainingRequestHistoryEntry } from '@/types/training';
import { TrainingRequestHistoryTable } from './TrainingRequestHistoryTable';

export const metadata = { title: 'Training Request History' };

async function getHistory(): Promise<TrainingRequestHistoryEntry[]> {
    return fetchApi(
        '/training/request/history/',
        { cache: 'no-store' },
    );
}

const TrainingRequestHistory: NextPage = async () => {
    const history = await getHistory();

    return (
        <>
            <p className="mb-5 text-slate-400">
                Per-student totals are sourced from the audit log and only include requests
                created since auditing was enabled.
            </p>
            <TrainingRequestHistoryTable data={history} />
        </>
    );
};

export default TrainingRequestHistory;
