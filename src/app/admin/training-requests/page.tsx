import React from 'react';
import { type NextPage } from 'next';
import { type TrainingRequestHistoryEntry } from '@/types/training';
import { getTrainingRequestHistory } from '@/lib/training/repository';
import { TrainingRequestHistoryTable } from './TrainingRequestHistoryTable';

export const metadata = { title: 'Training Request History' };

const TrainingRequestHistory: NextPage = async () => {
    const history: TrainingRequestHistoryEntry[] = await getTrainingRequestHistory();

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
