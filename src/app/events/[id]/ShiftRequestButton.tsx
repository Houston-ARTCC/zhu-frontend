'use client';

import React, { useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { type EventShift } from '@/types/events';
import { requestShift, unrequestShift } from '@/lib/events/actions';

interface ShiftRequestButtonProps {
    shift: EventShift;
    requestedInit: boolean;
}

export const ShiftRequestButton: React.FC<ShiftRequestButtonProps> = ({ shift, requestedInit }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const toggleRequest = useCallback(() => {
        startTransition(() => {
            const action = requestedInit ? unrequestShift(shift.id) : requestShift(shift.id);
            toast.promise(
                action.then(() => router.refresh()),
                {
                    error: {
                        render: ({ data: error }) => (
                            error instanceof Error ? error.message : 'Something went wrong, check console for more info'
                        ),
                    },
                },
            );
        });
    }, [shift, requestedInit, router]);

    return (
        <button className="size-full text-center" onClick={toggleRequest} type="button" disabled={isPending}>
            {requestedInit ? 'Unrequest' : 'Request'}
        </button>
    );
};
