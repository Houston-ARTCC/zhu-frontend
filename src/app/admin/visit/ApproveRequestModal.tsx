'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type VisitRequest } from '@/types/visit';

interface AcceptRequestModalProps extends ModalProps {
    request: VisitRequest;
}

export const ApproveRequestModal: React.FC<AcceptRequestModalProps> = ({ request, show, close }) => {
    const router = useRouter();

    const putRequest = useCallback(() => {
        toast.promise(
            fetchApi(
                `/visit/${request.id}/`,
                { method: 'PUT' },
            ),
            {
                pending: 'Approving visiting request',
                success: 'Successfully approved',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.refresh();
                close?.();
            });
    }, [request, router, close]);

    return (
        <Modal show={show} title="Approve Visiting Request" close={close}>
            <p className="mb-5">
                Are you sure you would like to approve {request.user.first_name} {request.user.last_name}'s visiting request?
            </p>

            <div className="flex justify-end gap-3">
                <Button className="bg-slate-300 shadow-slate-300/25" onClick={close}>
                    Cancel
                </Button>
                <Button className="bg-emerald-400 shadow-emerald-400/25" onClick={putRequest}>
                    Approve
                </Button>
            </div>
        </Modal>
    );
};

interface ApproveRequestButtonProps {
    request: VisitRequest;
}

export const ApproveRequestButton: React.FC<ApproveRequestButtonProps> = ({ request }) => (
    <ModalButton
        className="!bg-emerald-400/[.10] !text-emerald-400"
        variant="secondary"
        modal={<ApproveRequestModal request={request} />}
    >
        Approve
    </ModalButton>
);
