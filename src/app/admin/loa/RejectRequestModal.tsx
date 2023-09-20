'use client';

import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { TextAreaInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type LoaRequest } from '@/types/admin';
import { type RejectRequestFormValues, rejectRequestSchema } from './rejectRequestSchema';

interface RejectRequestModalProps extends ModalProps {
    request: LoaRequest;
}

export const RejectRequestModal: React.FC<RejectRequestModalProps> = ({ request, show, close }) => {
    const router = useRouter();

    const { reset, register, handleSubmit, formState: { errors } } = useForm<RejectRequestFormValues>({
        resolver: zodResolver(rejectRequestSchema),
    });

    const deleteRequest: SubmitHandler<RejectRequestFormValues> = useCallback((data) => {
        toast.promise(
            fetchApi(
                `/loa/${request.id}/`,
                { method: 'DELETE', body: JSON.stringify(data) },
            ),
            {
                pending: 'Rejecting LOA request',
                success: 'Successfully rejected',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.refresh();
                close?.();
            });
    }, [request, router, close]);

    useEffect(() => {
        if (!show) {
            reset();
        }
    }, [show, reset]);

    return (
        <Modal show={show} title="Reject LOA Request" close={close}>
            <form onSubmit={handleSubmit(deleteRequest)}>
                <p className="mb-5">
                    Are you sure you would like to reject {request.user.first_name} {request.user.last_name}'s LOA request?
                </p>

                <TextAreaInput
                    {...register('reason')}
                    className="mb-5"
                    label="Reason"
                    error={errors.reason?.message}
                />

                <div className="flex justify-end gap-3">
                    <Button className="bg-slate-300 shadow-slate-300/25" onClick={close}>
                        Cancel
                    </Button>
                    <Button className="!bg-red-400 !shadow-red-400/25" type="submit">
                        Reject
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

interface RejectRequestButtonProps {
    request: LoaRequest;
}

export const RejectRequestButton: React.FC<RejectRequestButtonProps> = ({ request }) => (
    <ModalButton
        className="!bg-red-400/[.10] !text-red-400"
        variant="secondary"
        modal={<RejectRequestModal request={request} />}
    >
        Reject
    </ModalButton>
);
