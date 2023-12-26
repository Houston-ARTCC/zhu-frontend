import React from 'react';
import { type NextPage } from 'next';
import { LuCheckCircle } from 'react-icons/lu';
import { fetchApi } from '@/utils/fetch';
import { type Feedback } from '@/types/feedback';
import { FeedbackCard } from './FeedbackCard';

async function getFeedback(): Promise<Feedback[]> {
    return fetchApi(
        '/feedback/',
        { cache: 'no-store' },
    );
}

const PendingFeedback: NextPage = async () => {
    const pendingFeedback = await getFeedback();

    if (pendingFeedback.length === 0) {
        return (
            <div className="rounded-md bg-emerald-500/10 py-5 pl-7 pr-10 text-emerald-500">
                <div className="flex gap-3">
                    <div className="pt-1">
                        <LuCheckCircle size={25} />
                    </div>
                    <div>
                        <h4 className="mb-0.5 text-2xl font-medium">All caught up!</h4>
                        <p>There are no pending feedback, check back later.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-5">
            {pendingFeedback.map((feedback) => (
                <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                />
            ))}
        </div>
    );
};

export default PendingFeedback;
