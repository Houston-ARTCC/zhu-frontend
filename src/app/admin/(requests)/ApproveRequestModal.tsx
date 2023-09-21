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
                <Button className="bg-slate-300 shadow-slate-300/25" onClick={close}>
                    Cancel
                </Button>
                <Button className="!bg-emerald-400 !shadow-emerald-400/25" onClick={putRequest} disabled={isSubmitting}>
                    Approve
                </Button>
            </div>
        </Modal>
    );
};

export const ApproveRequestButton: React.FC<AcceptRequestModalProps> = (props) => (
    <ModalButton
        className="!bg-emerald-400/[.10] !text-emerald-400"
        variant="secondary"
        modal={<ApproveRequestModal {...props} />}
    >
        Approve
    </ModalButton>
);
