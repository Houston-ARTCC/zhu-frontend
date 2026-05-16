import React from 'react';
import { type NextPage } from 'next';
import { fetchApi } from '@/utils/fetch';
import { type Feedback } from '@/types/feedback';
import { ApprovedFeedbackCard } from './ApprovedFeedbackCard';

export const metadata = { title: 'Feedback History' };

async function getApprovedFeedback(): Promise<Feedback[]> {
    return fetchApi(
        '/feedback/history/',
        { cache: 'no-store' },
    );
}

const FeedbackHistory: NextPage = async () => {
    const feedback = await getApprovedFeedback();

    if (feedback.length === 0) {
        return <p className="text-slate-400">No approved feedback yet.</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {feedback.map((entry) => <ApprovedFeedbackCard key={entry.id} feedback={entry} />)}
        </div>
    );
};

export default FeedbackHistory;
