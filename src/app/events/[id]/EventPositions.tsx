import React from 'react';
import classNames from 'classnames';
import { format } from 'date-fns-tz';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Popover } from '@/components/Popover';
import { type EventPosition, type EventShift } from '@/types/events';
import { ShiftRequestButton } from './ShiftRequestButton';

interface EventShiftInfoProps {
    index: number;
    position: EventPosition;
    shift: EventShift;
}

const EventShiftInfo: React.FC<EventShiftInfoProps> = async ({ index, position, shift }) => {
    const session = await getServerSession(authOptions);

    return (
        <Popover
            className={classNames(
                'grow basis-0 border-r-2 border-neutral-100 first:rounded-l-md last:rounded-r-md last:border-r-0',
                { 'bg-green-400': shift.user, 'bg-gray-200': !shift.user },
            )}
            title={(
                <span className="whitespace-nowrap">
                    {position.callsign} (Shift {index})
                </span>
            )}
            contents={(
                <span>
                    {format(new Date(shift.start), 'HH:mm')}
                    &ndash;
                    {format(new Date(shift.end), 'HH:mm zzz')}
                </span>
            )}
        >
            <div className="flex h-6 items-center justify-center text-sm">
                {shift.user
                    ? `${shift.user.first_name} ${shift.user.last_name}`
                    : (session && session.user.is_member)
                        ? (
                            <ShiftRequestButton
                                shift={shift}
                                requestedInit={shift.requests.some((request) => request.user.cid === session.user.cid)}
                            />
                        )
                        : 'Unassigned'}
            </div>
        </Popover>
    );
};

interface EventPositionsProps {
    label: string;
    positions: EventPosition[];
}

export const EventPositions: React.FC<EventPositionsProps> = ({ label, positions }) => (
    <div>
        <h3 className="mb-3 text-2xl font-bold">{label}</h3>
        <div className="flex flex-col gap-4">
            {positions.map((position) => (
                <div key={position.id}>
                    <p className="mb-2">{position.callsign}</p>
                    <div className="flex">
                        {position.shifts.map((shift, i) => (
                            <EventShiftInfo
                                key={shift.id}
                                index={i + 1}
                                position={position}
                                shift={shift}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
