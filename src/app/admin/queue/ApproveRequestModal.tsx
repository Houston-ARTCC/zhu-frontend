'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';

interface AcceptRequestModalProps extends ModalProps {
    title: string;
    confirmation: string;
    endpoint: string;
    toastConfig: {
        pending: string;
        success: string;
    };
}

export const ApproveRequestModal: React.FC<AcceptRequestModalProps> = ({ title, confirmation, endpoint, toastConfig, show, close }) => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const putRequest = useCallback(() => {
        setIsSubmitting(true);

        toast.promise(
            fetchApi(endpoint, { method: 'PUT' }),
            {
                ...toastConfig,
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                setIsSubmitting(false);
                router.refresh();
                close?.();
            });
    }, [endpoint, toastConfig, router, close]);

    return (
        <Modal show={show} title={title} close={close}>
            <p className="mb-5">{confirmation}</p>

            <div className="flex justify-end gap-3">
                <Button color="gray-300" onClick={close}>
                    Cancel
                </Button>
                <Button color="green-500" onClick={putRequest} disabled={isSubmitting}>
                    Approve
                </Button>
            </div>
        </Modal>
    );
};

export const ApproveRequestButton: React.FC<AcceptRequestModalProps> = (props) => (
    <ModalButton
        className="bg-green-500/[.10]! text-green-500!"
        variant="secondary"
        modal={<ApproveRequestModal {...props} />}
    >
        Approve
    </ModalButton>
);
