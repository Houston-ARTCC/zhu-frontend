import React from 'react';
import classNames from 'classnames';
import { Badge } from '@/components/Badge';
import { EventScoreTable } from '@/components/EventScoreTable';
import { type EventScore } from '@/types/events';
import { scoreToBadgeColor } from '@/utils';

interface EventScoreInfoProps {
    scores: EventScore[];
}

export const EventScoreInfo: React.FC<EventScoreInfoProps> = ({ scores }) => {
    const overallScore = Math.round(scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length);

    return (
        <div>
            {scores.length > 0 && (
                <h3 className="mb-3 mt-5 flex items-center gap-3 text-2xl font-medium">
                    Overall Score:
                    <Badge small className={classNames('!text-base', scoreToBadgeColor(overallScore))}>
                        {overallScore}%
                    </Badge>
                </h3>
            )}
            <EventScoreTable data={scores} />
        </div>
    );
};
