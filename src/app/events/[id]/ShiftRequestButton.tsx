'use client';

import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchApi } from '@/utils/fetch';
import { type EventShift } from '@/types/events';

interface ShiftRequestButtonProps {
    shift: EventShift;
    requestedInit: boolean;
}

export const ShiftRequestButton: React.FC<ShiftRequestButtonProps> = ({ shift, requestedInit }) => {
    const [requested, setRequested] = useState<boolean>(requestedInit);

    const toggleRequest = useCallback(() => {
        toast.promise(
            fetchApi(
                `/events/request/${shift.id}/`,
                { method: requested ? 'DELETE' : 'POST' },
            ),
            { error: 'Something went wrong, check console for more info' },
        )
            .then(() => setRequested(!requested));
    }, [shift, requested]);

    return (
        <button className="h-full w-full text-center" onClick={toggleRequest} type="button">
            {requested ? 'Unrequest' : 'Request'}
        </button>
    );
};
