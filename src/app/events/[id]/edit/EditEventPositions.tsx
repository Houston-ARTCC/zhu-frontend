'use client';

import React, { useCallback, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import { LuPlus, LuUserPlus, LuUserX, LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ClientPortal } from '@/components/ClientPortal';
import { Dropdown, DropdownButton, DropdownSeparator } from '@/components/Dropdown';
import { type EventPosition, type EventShift } from '@/types/events';
import { addPositions, appendShift, assignShift, deletePosition, deleteShift } from '@/lib/events/actions';
import { type AddPositionsFormValues } from '@/lib/events/schema';
import { AddPositionsButton } from '../../AddPositionsModal';
import { formatScore, overlaps, useAssignments } from './AssignmentsContext';
import { ManualAssignModal } from './ManualAssignModal';

interface EventShiftInfoProps {
    shift: EventShift;
    index: number;
    count: number;
    onMutate: () => void;
}

const EventShiftInfo: React.FC<EventShiftInfoProps> = ({ shift, index, count, onMutate }) => {
    const [isPending, startTransition] = useTransition();
    const { signups, slots } = useAssignments();
    // Lives outside the menu, which remounts its items when it closes.
    const [manualAssign, setManualAssign] = useState<boolean>(false);

    const assignedDuring = (cid: number) => [...slots]
        .filter(([id, slot]) => id !== shift.id && slot.cid === cid && overlaps(slot, { index, count }))
        .map(([, slot]) => slot.callsign);

    const assignController = useCallback(
        (cid: number | null) => {
            startTransition(() => {
                toast.promise(
                    assignShift(shift.id, cid).then(onMutate),
                    { error: 'Something went wrong, check console for more info' },
                );
            });
        },
        [shift, onMutate],
    );

    const handleDeleteShift = useCallback(() => {
        startTransition(() => {
            toast.promise(
                deleteShift(shift.id).then(onMutate),
                { error: 'Something went wrong, check console for more info' },
            );
        });
    }, [shift, onMutate]);

    const { user } = shift;

    return (
        <div
            className={classNames(
                'grow basis-0 min-w-0 px-1.5 border-r-2 border-neutral-100 ',
                'first:rounded-l-md last:rounded-r-md last:border-r-0 dark:border-zinc-850',
                {
                    'bg-green-500 text-green-50': user,
                    'bg-gray-200 dark:bg-zinc-700': !user,
                },
            )}
        >
            <Dropdown
                title={
                    user ? (
                        <span className="min-w-0 max-w-fit grow basis-0 truncate">
                            {user.first_name} {user.last_name}
                        </span>
                    ) : (
                        'Unassigned'
                    )
                }
                className="flex h-6 w-full justify-center gap-1! p-0! text-sm font-medium hover:bg-transparent!"
                menuClassName="w-96"
                anchored
            >
                <div className="flex">
                    {user && (
                        <DropdownButton className="grow basis-0" onClick={() => assignController(null)} disabled={isPending}>
                            <LuUserX />
                            Unassign
                        </DropdownButton>
                    )}
                    <DropdownButton className="grow basis-0" onClick={handleDeleteShift} disabled={isPending}>
                        <LuX />
                        Delete
                    </DropdownButton>
                </div>
                {shift.requests.length > 0 && <DropdownSeparator />}
                {shift.requests.map((request) => {
                    const signup = signups.get(request.user.cid);
                    const elsewhere = assignedDuring(request.user.cid);
                    return (
                        <DropdownButton key={request.id} onClick={() => assignController(request.user.cid)} disabled={isPending}>
                            <span className="truncate">{request.user.first_name} {request.user.last_name}</span>
                            {elsewhere.length > 0 && <Badge small color="amber-400">on {elsewhere.join(', ')}</Badge>}
                            {signup && <span className="ml-auto">{signup.rating} &middot; {formatScore(signup.score)}</span>}
                        </DropdownButton>
                    );
                })}
                <DropdownSeparator />
                <DropdownButton onClick={() => setManualAssign(true)}>
                    <LuUserPlus />
                    Manually Assign
                </DropdownButton>
            </Dropdown>
            <ClientPortal>
                <ManualAssignModal
                    assignController={assignController}
                    show={manualAssign}
                    close={() => setManualAssign(false)}
                />
            </ClientPortal>
        </div>
    );
};

interface EventPositionInfoProps {
    position: EventPosition;
    onMutate: () => void;
}

const EventPositionInfo: React.FC<EventPositionInfoProps> = ({ position, onMutate }) => {
    const [isPending, startTransition] = useTransition();

    const handleAddShift = useCallback(() => {
        startTransition(() => {
            toast.promise(
                appendShift(position.id).then(onMutate),
                { error: 'Something went wrong, check console for more info' },
            );
        });
    }, [position, onMutate]);

    const handleDeletePosition = useCallback(() => {
        startTransition(() => {
            toast.promise(
                deletePosition(position.id).then(onMutate),
                { error: 'Something went wrong, check console for more info' },
            );
        });
    }, [position, onMutate]);

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <p>{position.callsign}</p>
                <Button
                    color="red-400"
                    className="text-sm"
                    variant="tertiary"
                    onClick={handleDeletePosition}
                    disabled={isPending}
                >
                    <LuX />
                    Delete Position
                </Button>
            </div>
            <div className="flex">
                {position.shifts.map((shift, index) => (
                    <EventShiftInfo
                        key={shift.id}
                        shift={shift}
                        index={index}
                        count={position.shifts.length}
                        onMutate={onMutate}
                    />
                ))}
                <button
                    type="button"
                    className="rounded-r-md bg-gray-200 px-1 dark:bg-zinc-700"
                    onClick={handleAddShift}
                    disabled={isPending}
                    aria-label="Add Shift"
                >
                    <LuPlus />
                </button>
            </div>
        </div>
    );
};

interface EditEventPositionsProps {
    eventId: number;
    label: string;
    positions: EventPosition[];
}

export const EditEventPositions: React.FC<EditEventPositionsProps> = ({ eventId, label, positions }) => {
    const router = useRouter();

    const refresh = useCallback(() => router.refresh(), [router]);

    const handleAddPositions = useCallback(
        async (values: AddPositionsFormValues) => {
            await addPositions(eventId, values.positions);
            router.refresh();
            return undefined;
        },
        [eventId, router],
    );

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-2xl font-bold">{label}</h3>
                <AddPositionsButton addPositions={handleAddPositions} />
            </div>
            <div className="flex flex-col gap-4">
                {positions.map((position) => (
                    <EventPositionInfo key={position.id} position={position} onMutate={refresh} />
                ))}
            </div>
        </div>
    );
};
