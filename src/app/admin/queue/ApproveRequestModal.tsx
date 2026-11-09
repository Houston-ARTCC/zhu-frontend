'use client';

import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { Button } from '@/components/Button';

interface ApproveRequestModalProps extends ModalProps {
    title: string;
    confirmation: string;
    onApprove: () => Promise<void>;
    toastConfig: {
        pending: string;
        success: string;
    };
}

export const ApproveRequestModal: React.FC<ApproveRequestModalProps> = ({ title, confirmation, onApprove, toastConfig, show, close }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const approve = useCallback(() => {
        setIsSubmitting(true);

        toast.promise(
            onApprove(),
            {
                ...toastConfig,
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                close?.();
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }, [onApprove, toastConfig, close]);

    return (
        <Modal show={show} title={title} close={close}>
            <p className="mb-5">{confirmation}</p>

            <div className="flex justify-end gap-3">
                <Button color="gray-300" onClick={close}>
                    Cancel
                </Button>
                <Button color="green-500" onClick={approve} disabled={isSubmitting}>
                    Approve
                </Button>
            </div>
        </Modal>
    );
};

export const ApproveRequestButton: React.FC<ApproveRequestModalProps> = (props) => (
    <ModalButton
        className="bg-green-500/[.10]! text-green-500!"
        variant="secondary"
        modal={<ApproveRequestModal {...props} />}
    >
        Approve
    </ModalButton>
);
