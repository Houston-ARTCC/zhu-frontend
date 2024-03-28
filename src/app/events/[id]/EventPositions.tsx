import React from 'react';
import classNames from 'classnames';
import { format } from 'date-fns-tz';
import { getServerSession } from 'next-auth';
import { Popover } from '@/components/Popover';
import { authOptions } from '@/utils/auth';
import { type EventPosition, type EventShift } from '@/types/events';
import { ShiftRequestButton } from './ShiftRequestButton';

interface EventShiftInfoProps {
    index: number;
    preventSignup: boolean;
    position: EventPosition;
    shift: EventShift;
}

const EventShiftInfo: React.FC<EventShiftInfoProps> = async ({ index, preventSignup, position, shift }) => {
    const session = await getServerSession(authOptions);

    return (
        <Popover
            className={classNames(
                'grow basis-0 min-w-0 px-1.5',
                'border-r-2 border-neutral-100 first:rounded-l-md last:rounded-r-md last:border-r-0 dark:border-zinc-850',
                { 'bg-green-500': shift.user, 'bg-gray-200 dark:bg-zinc-700': !shift.user },
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
            <div
                className={classNames(
                    'flex h-6 items-center justify-center text-sm font-medium',
                    { 'text-green-50': shift.user },
                )}
            >
                {shift.user
                    ? `${shift.user.first_name} ${shift.user.last_name}`
                    : (session && session.user.permissions.is_member && !preventSignup)
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
    preventSignup: boolean;
}

export const EventPositions: React.FC<EventPositionsProps> = ({ label, positions, preventSignup }) => (
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
                                preventSignup={preventSignup}
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
