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
import { type RejectRequestFormValues, rejectRequestSchema } from './rejectRequestSchema';

interface RejectRequestModalProps extends ModalProps {
    title: string;
    confirmation: string;
    needsReason?: boolean;
    endpoint: string;
    toastConfig: {
        pending: string;
        success: string;
    };
}

export const RejectRequestModal: React.FC<RejectRequestModalProps> = ({
    title,
    needsReason = false,
    confirmation,
    endpoint,
    toastConfig,
    show,
    close,
}) => {
    const router = useRouter();

    const { reset, register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: needsReason ? zodResolver(rejectRequestSchema) : undefined,
    });

    const deleteRequest: SubmitHandler<RejectRequestFormValues> = useCallback((data) => {
        toast.promise(
            fetchApi(
                endpoint,
                { method: 'DELETE', body: JSON.stringify(data) },
            ),
            {
                ...toastConfig,
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.refresh();
                close?.();
            });
    }, [endpoint, toastConfig, router, close]);

    useEffect(() => {
        if (!show) {
            reset();
        }
    }, [show, reset]);

    return (
        <Modal show={show} title={title} close={close}>
            <form onSubmit={handleSubmit(deleteRequest)}>
                <p className="mb-5">{confirmation}</p>

                {needsReason && (
                    <TextAreaInput
                        {...register('reason')}
                        className="mb-5"
                        label="Reason"
                        error={errors.reason?.message}
                    />
                )}

                <div className="flex justify-end gap-3">
                    <Button color="gray-300" onClick={close}>
                        Cancel
                    </Button>
                    <Button color="red-400" type="submit" disabled={isSubmitting}>
                        Reject
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export const RejectRequestButton: React.FC<RejectRequestModalProps> = (props) => (
    <ModalButton
        className="bg-red-400/[.10]! text-red-400!"
        variant="secondary"
        modal={<RejectRequestModal {...props} />}
    >
        Reject
    </ModalButton>
);
