'use client';

import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { LuPlus, LuUserX, LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { Button } from '@/components/Button';
import { Dropdown, DropdownButton, DropdownSeparator } from '@/components/Dropdown';
import { fetchApi } from '@/utils/fetch';
import { type EventPosition, type EventShift } from '@/types/events';
import { type BasicUser } from '@/types/users';
import { type SchemaError } from '@/types';
import { AddPositionsButton } from '../../AddPositionsModal';
import { type AddPositionsFormValues } from '../../addPositionsSchema';
import { ManualAssignButton } from './ManualAssignModal';

interface EventShiftInfoProps {
    shift: EventShift;
    deleteShift: (shiftId: number) => void;
}

const EventShiftInfo: React.FC<EventShiftInfoProps> = ({ shift, deleteShift }) => {
    const [controller, setController] = useState<BasicUser | null>(shift.user);

    const assignController = useCallback(
        async (cid: number | null) => {
            await toast
                .promise(
                    fetchApi<EventShift>(`/events/shift/${shift.id}/`, {
                        method: 'PATCH',
                        body: JSON.stringify({ user: cid }),
                    }),
                    {
                        error: 'Something went wrong, check console for more info',
                    },
                )
                .then((data) => setController(data.user));
        },
        [shift],
    );

    return (
        <div
            className={classNames(
                'grow basis-0 min-w-0 px-1.5',
                'border-r-2 border-neutral-100 first:rounded-l-md last:rounded-r-md last:border-r-0',
                {
                    'bg-green-400 text-green-50': controller,
                    'bg-gray-200': !controller,
                },
            )}
        >
            <Dropdown
                title={
                    controller ? (
                        <span className="min-w-0 max-w-fit grow basis-0 overflow-hidden text-ellipsis whitespace-nowrap">
                            {controller.first_name} {controller.last_name}
                        </span>
                    ) : (
                        'Unassigned'
                    )
                }
                className="flex h-6 w-full justify-center !gap-1 !p-0 text-sm font-medium"
                menuClassName="w-64"
            >
                <div className="flex">
                    <DropdownButton className="grow basis-0" onClick={() => assignController(null)}>
                        <LuUserX />
                        Unassign
                    </DropdownButton>
                    <DropdownButton className="grow basis-0" onClick={() => deleteShift(shift.id)}>
                        <LuX />
                        Delete
                    </DropdownButton>
                </div>
                {shift.requests.length > 0 && <DropdownSeparator />}
                {shift.requests.map((request) => (
                    <DropdownButton key={request.id} onClick={() => assignController(request.user.cid)}>
                        {request.user.first_name} {request.user.last_name}
                    </DropdownButton>
                ))}
                <DropdownSeparator />
                <ManualAssignButton assignController={assignController} />
            </Dropdown>
        </div>
    );
};

interface EventPositionInfoProps {
    position: EventPosition;
    deletePosition: (positionId: number) => void;
}

const EventPositionInfo: React.FC<EventPositionInfoProps> = ({ position, deletePosition }) => {
    const [shifts, setShifts] = useState<EventShift[]>(position.shifts);

    const addShift = useCallback(() => {
        toast
            .promise(
                fetchApi<EventPosition>(`/events/position/${position.id}/`, {
                    method: 'PUT',
                }),
                { error: 'Something went wrong, check console for more info' },
            )
            .then((data) => setShifts(data.shifts));
    }, [position]);

    const deleteShift = useCallback(
        (shiftId: number) => {
            toast
                .promise(fetchApi(`/events/shift/${shiftId}/`, { method: 'DELETE' }), {
                    error: 'Something went wrong, check console for more info',
                })
                .then(() => setShifts(shifts.filter((shift) => shift.id !== shiftId)));
        },
        [shifts],
    );

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <p>{position.callsign}</p>
                <Button
                    className="text-sm !text-red-400"
                    variant="tertiary"
                    onClick={() => deletePosition(position.id)}
                >
                    <LuX />
                    Delete Position
                </Button>
            </div>
            <div className="flex">
                {shifts.map((shift) => (
                    <EventShiftInfo key={shift.id} shift={shift} deleteShift={deleteShift} />
                ))}
                <button className="rounded-r-md bg-gray-200 px-1" onClick={addShift} type="button">
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
    const [currPositions, setCurrPositions] = useState<EventPosition[]>(positions);

    const addPositions = useCallback(
        async (values: AddPositionsFormValues) => toast.promise(
            fetchApi<SchemaError[]>(`/events/${eventId}/`, {
                method: 'POST',
                body: JSON.stringify(values.positions),
            })
                .then(() => undefined)
                .catch(async (resp) => {
                    if (resp.headers.get('Content-Type') === 'application/json') {
                        const data = await resp.json();
                        return Promise.resolve(data);
                    }
                    return Promise.reject(resp);
                }),
            { error: 'Something went wrong, check console for more info' },
        ),
        [eventId],
    );

    const deletePosition = useCallback(
        (positionId: number) => {
            toast
                .promise(
                    fetchApi(`/events/position/${positionId}/`, {
                        method: 'DELETE',
                    }),
                    {
                        error: 'Something went wrong, check console for more info',
                    },
                )
                .then(() => setCurrPositions(positions.filter((position) => position.id !== positionId)));
        },
        [positions],
    );

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-2xl font-bold">{label}</h3>
                <AddPositionsButton addPositions={addPositions} />
            </div>
            <div className="flex flex-col gap-4">
                {currPositions.map((position) => (
                    <EventPositionInfo key={position.id} position={position} deletePosition={deletePosition} />
                ))}
            </div>
        </div>
    );
};
