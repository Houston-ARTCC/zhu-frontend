import React from 'react';
import { type NextPage } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getApprovedFeedback } from '@/lib/feedback/repository';
import { ApprovedFeedbackCard } from './ApprovedFeedbackCard';

export const metadata = { title: 'Feedback History' };

const FeedbackHistory: NextPage = async () => {
    await requireAdmin();
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
