import React from 'react';
import { LuStar } from 'react-icons/lu';
import classNames from 'classnames';
import { Card } from '@/components/Card';
import { type Feedback } from '@/types/feedback';
import { RejectRequestButton } from '../RejectRequestModal';
import { ApproveRequestButton } from '../ApproveRequestModal';

interface FeedbackCardProps {
    feedback: Feedback;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => (
    <Card className="flex flex-col">
        <h4 className="text-xl font-bold">
            {feedback.controller
                ? `${feedback.controller.first_name} ${feedback.controller.last_name}`
                : 'General ARTCC Feedback'}
        </h4>
        {feedback.controller_callsign && (
            <h5>on <b>{feedback.controller_callsign}</b></h5>
        )}
        {feedback.event && (
            <h5>during <b>{feedback.event.name}</b></h5>
        )}

        <div className="mb-3 mt-1 flex gap-2">
            {Array(5).fill(undefined)
                .map((_, i) => (
                    <LuStar
                        key={i}
                        className={
                            classNames(
                                'stroke-0',
                                {
                                    'fill-neutral-300': i >= feedback.rating,
                                    'fill-amber-400': i < feedback.rating,
                                },
                            )
                        }
                        size={30}
                    />
                ))}
        </div>

        <blockquote className="mb-5 border-l-4 border-l-slate-200 pl-4">
            {feedback.comments}
        </blockquote>

        <div className="mt-auto flex gap-3">
            <RejectRequestButton
                title="Reject Feedback"
                confirmation={`Are you sure you would like to reject ${feedback.pilot.first_name} ${feedback.pilot.last_name}'s feedback?`}
                endpoint={`/feedback/${feedback.id}/`}
                toastConfig={{
                    pending: 'Rejecting feedback',
                    success: 'Successfully rejected',
                }}
            />
            <ApproveRequestButton
                title="Approve Feedback"
                confirmation={`Are you sure you would like to reject ${feedback.pilot.first_name} ${feedback.pilot.last_name}'s feedback?`}
                endpoint={`/feedback/${feedback.id}/`}
                toastConfig={{
                    pending: 'Approving feedback',
                    success: 'Successfully approved',
                }}
            />
        </div>
    </Card>
);
