'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns-tz';
import { toast } from 'react-toastify';
import { Modal, type ModalProps } from '@/components/Modal';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type TrainingSession } from '@/types/training';

interface NoShowSessionModalProps extends ModalProps {
    session?: TrainingSession;
}

export const NoShowSessionModal: React.FC<NoShowSessionModalProps> = ({ session, show, close }) => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const cancelSession = useCallback(() => {
        if (!session) return;

        setIsSubmitting(true);

        toast.promise(
            fetchApi(`/training/session/${session.id}/`, { method: 'PUT', body: JSON.stringify({ status: 3 }) }),
            {
                pending: 'No-showing session',
                success: 'Successfully no-showed',
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
        <Modal show={show} title="No-Show Session" close={close}>
            {session && (
                <>
                    <p className="mb-3">
                        Are you sure you would like to mark <b>{session.student.first_name} {session.student.last_name}'s </b>
                        training session on <b>{format(new Date(session.start), 'MMM d, Y')}</b> as a no-show?
                    </p>
                    <p className="mb-3">
                        By proceeding, you are confirming that the student did not show up at the session for
                        15 minutes after the scheduled starting time.
                    </p>
                </>
            )}

            <div className="flex justify-end gap-3">
                <Button className="bg-slate-300 shadow-slate-300/25" onClick={close}>
                    Cancel
                </Button>
                <Button type="submit" onClick={cancelSession} disabled={isSubmitting}>
                    Confirm
                </Button>
            </div>
        </Modal>
    );
};
