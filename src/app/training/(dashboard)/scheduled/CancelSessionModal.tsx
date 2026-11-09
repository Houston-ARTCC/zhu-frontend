'use client';

import React, { useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns-tz';
import { toast } from 'react-toastify';
import { Modal, type ModalProps } from '@/components/Modal';
import { Button } from '@/components/Button';
import { type TrainingSession } from '@/types/training';
import { cancelSession } from '@/lib/training/actions';

interface CancelSessionModalProps extends ModalProps {
    session?: TrainingSession;
}

export const CancelSessionModal: React.FC<CancelSessionModalProps> = ({ session, show, close }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleCancel = useCallback(() => {
        if (!session) return;

        startTransition(() => {
            toast.promise(
                cancelSession(session.id),
                {
                    pending: 'Cancelling session',
                    success: 'Successfully cancelled',
                    error: 'Something went wrong, check console for more info',
                },
            )
                .then(() => {
                    router.refresh();
                    close?.();
                });
        });
    }, [session, router, close]);

    return (
        <Modal show={show} title="Cancel Session" close={close}>
            {session && (
                <>
                    <p className="mb-3">
                        Are you sure you would like to cancel <b>{session.student.first_name} {session.student.last_name}'s </b>
                        training session on <b>{format(new Date(session.start), 'MMM d, Y')}</b>?
                    </p>
                    <p className="mb-3">
                        The student will be sent an email notifying them of this cancellation.
                        It is still recommended that you notify the student directly to ensure that they are aware of this change.
                    </p>
                </>
            )}

            <div className="flex justify-end gap-3">
                <Button color="gray-300" onClick={close}>
                    Cancel
                </Button>
                <Button type="submit" onClick={handleCancel} disabled={isPending}>
                    Confirm
                </Button>
            </div>
        </Modal>
    );
};
