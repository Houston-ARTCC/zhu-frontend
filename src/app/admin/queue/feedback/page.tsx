import React from 'react';
import { type NextPage } from 'next';
import { LuCircleCheckBig } from 'react-icons/lu';
import { Alert, AlertTitle } from '@/components/Alert';
import { requireAdmin } from '@/lib/auth/guards';
import { getPendingFeedback } from '@/lib/feedback/repository';
import { FeedbackCard } from './FeedbackCard';

const PendingFeedback: NextPage = async () => {
    await requireAdmin();
    const pendingFeedback = await getPendingFeedback();

    if (pendingFeedback.length === 0) {
        return (
            <Alert color="green-500" icon={LuCircleCheckBig}>
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
