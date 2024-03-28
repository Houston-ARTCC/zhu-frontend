'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns-tz';
import { toast } from 'react-toastify';
import { Modal, type ModalProps } from '@/components/Modal';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type TrainingSession } from '@/types/training';

interface CancelSessionModalProps extends ModalProps {
    session?: TrainingSession;
}

export const CancelSessionModal: React.FC<CancelSessionModalProps> = ({ session, show, close }) => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const cancelSession = useCallback(() => {
        if (!session) return;

        setIsSubmitting(true);

        toast.promise(
            fetchApi(`/training/session/${session.id}/`, { method: 'DELETE' }),
            {
                pending: 'Cancelling session',
                success: 'Successfully cancelled',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                setIsSubmitting(false);
                router.refresh();
                close?.();
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
                <Button type="submit" onClick={cancelSession} disabled={isSubmitting}>
                    Confirm
                </Button>
            </div>
        </Modal>
    );
};
