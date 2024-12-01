import React from 'react';
import { type NextPage } from 'next';
import { LuCheckCircle } from 'react-icons/lu';
import { Alert, AlertTitle } from '@/components/Alert';
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
            <Alert color="green-500" icon={LuCheckCircle}>
                <AlertTitle>All caught up!</AlertTitle>
                <p>There are no pending feedback, check back later.</p>
            </Alert>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
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
