import React from 'react';
import { format } from 'date-fns-tz';
import { LuStar } from 'react-icons/lu';
import classNames from 'classnames';
import { Card } from '@/components/Card';
import { type Feedback } from '@/types/feedback';

interface ApprovedFeedbackCardProps {
    feedback: Feedback;
}

export const ApprovedFeedbackCard: React.FC<ApprovedFeedbackCardProps> = ({ feedback }) => (
    <Card className="flex flex-col">
        <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-1">
                {Array(5).fill(undefined)
                    .map((_, i) => (
                        <LuStar
                            key={i}
                            className={classNames(
                                'stroke-0',
                                i < feedback.rating ? 'fill-amber-400' : 'fill-neutral-300',
                            )}
                            size={22}
                        />
                    ))}
            </div>
            <p className="text-sm text-slate-400">
                {format(new Date(feedback.created), 'MMM d, y')}
            </p>
        </div>

        <h4 className="text-lg font-bold">
            {feedback.controller
                ? `${feedback.controller.first_name} ${feedback.controller.last_name}`
                : 'General ARTCC Feedback'}
        </h4>
        <h5 className="text-sm text-slate-400">
            {feedback.controller_callsign && <span>on <b>{feedback.controller_callsign}</b></span>}
            {feedback.event && <span> during <b>{feedback.event.name}</b></span>}
        </h5>

        <blockquote className="my-4 border-l-4 border-l-slate-200 pl-4">
            <p>{feedback.comments}</p>
            <p className="mt-2 text-sm">
                &mdash; <b className="font-medium">{feedback.pilot.first_name} {feedback.pilot.last_name}</b>
                {feedback.pilot_callsign && <> as <b className="font-medium">{feedback.pilot_callsign}</b></>}
            </p>
        </blockquote>
    </Card>
);
