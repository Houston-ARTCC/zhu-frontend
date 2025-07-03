'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Modal, type ModalProps } from '@/components/Modal';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type LeaveOfAbsence } from '@/types/loa';

interface CancelLoaModalProps extends ModalProps {
    loa?: LeaveOfAbsence;
}

export const CancelLoaModal: React.FC<CancelLoaModalProps> = ({ loa, show, close }) => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const cancelSession = useCallback(() => {
        if (!loa) return;

        setIsSubmitting(true);

        toast.promise(
            fetchApi(`/loa/admin/${loa.id}/`, { method: 'DELETE' }),
            {
                pending: 'Cancelling leave of absence',
                success: 'Successfully canceled',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                setIsSubmitting(false);
                router.refresh();
                close?.();
            });
    }, [loa, router, close]);

    return (
        <Modal show={show} title="Cancel Leave of Absence" close={close}>
            <p className="mb-5">
                Are you sure you would like to cancel {loa?.user.first_name} {loa?.user.last_name}'s leave of absence {!loa?.approved && 'request'}
                {' from '}
                <b>{loa && format(new Date(loa.start), 'MMMM d, y')}</b>
                {' until '}
                <b>{loa && format(new Date(loa.end), 'MMMM d, y')}</b>?
            </p>

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
