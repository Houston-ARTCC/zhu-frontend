'use client';

import React, { useMemo, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import classNames from 'classnames';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { type EventSignup } from '@/types/events';
import { ratingToInt } from '@/utils';
import { formatScore, useAssignments } from './AssignmentsContext';

interface EventSignupsProps {
    signups: EventSignup[];
}

export const EventSignups: React.FC<EventSignupsProps> = ({ signups }) => {
    const { slots } = useAssignments();
    const [open, setOpen] = useState<boolean>(false);

    const sorted = useMemo(() => [...signups].sort((a, b) => (
        ratingToInt(b.rating) - ratingToInt(a.rating)
        || (b.score ?? -1) - (a.score ?? -1)
        || a.last_name.localeCompare(b.last_name)
    )), [signups]);

    const assigned = (cid: number) => [...slots.values()]
        .filter((slot) => slot.cid === cid)
        .map((slot) => `${slot.callsign} ${slot.index + 1}`);

    return (
        <Card className="mb-5">
            <button
                type="button"
                className="flex w-full items-center justify-between font-medium"
                onClick={() => setOpen(!open)}
            >
                Signups ({signups.length})
                <LuChevronDown className={classNames('transition-transform', { 'rotate-180': open })} />
            </button>
            {open && (
                <table className="mt-3 w-full text-left">
                    <thead className="text-sm text-gray-500 dark:text-zinc-400">
                        <tr>
                            <th className="py-1 font-medium">Name</th>
                            <th className="py-1 font-medium">Rating</th>
                            <th className="py-1 font-medium">Score</th>
                            <th className="py-1 font-medium">Requested</th>
                            <th className="py-1 font-medium">Assigned</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((signup) => (
                            <tr key={signup.cid} className="border-t border-gray-200 dark:border-zinc-700">
                                <td className="py-1.5">{signup.first_name} {signup.last_name}</td>
                                <td className="py-1.5">{signup.rating}</td>
                                <td className="py-1.5">{formatScore(signup.score)}</td>
                                <td className="py-1.5">{signup.requests} {signup.requests === 1 ? 'shift' : 'shifts'}</td>
                                <td className="py-1.5">
                                    <div className="flex flex-wrap gap-1">
                                        {assigned(signup.cid).map((label) => (
                                            <Badge key={label} small color="green-500">{label}</Badge>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Card>
    );
};
