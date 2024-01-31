'use client';

import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { Modal, type ModalProps } from '@/components/Modal';
import { TextAreaInput, TextInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type RequestLOAFormValues, requestLoaSchema } from './requestLoaSchema';

interface RequestLOAModalProps extends ModalProps {
    start?: Date;
    end?: Date;
}

export const RequestLoaModal: React.FC<RequestLOAModalProps> = ({ start, end, show, close }) => {
    const router = useRouter();

    const { register, control, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm<RequestLOAFormValues>({
        resolver: zodResolver(requestLoaSchema),
        defaultValues: { start, end },
    });

    useEffect(() => reset({ start, end }), [start, end, show, reset]);

    const putRequest: SubmitHandler<RequestLOAFormValues> = useCallback((data) => {
        toast.promise(
            fetchApi('/loa/', { method: 'POST', body: JSON.stringify(data) }),
            {
                pending: 'Submitting request',
                success: 'Successfully submitted',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.refresh();
                close?.();
            });
    }, [router, close]);

    return (
        <Modal show={show} title="Request LOA" close={close}>
            <form onSubmit={handleSubmit(putRequest)}>
                <div className="mb-3 grid grid-cols-2 gap-3">
                    <Controller
                        name="start"
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <div className="flex flex-col">
                                <ReactDatePicker
                                    {...field}
                                    dateFormat="MMM d, yyyy"
                                    selected={value}
                                    customInput={<TextInput label="Start" error={errors.start?.message} />}
                                />
                            </div>
                        )}
                    />
                    <Controller
                        name="end"
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <div className="flex flex-col">
                                <ReactDatePicker
                                    {...field}
                                    dateFormat="MMM d, yyyy"
                                    selected={value}
                                    customInput={<TextInput label="End" error={errors.end?.message} />}
                                />
                            </div>
                        )}
                    />
                </div>

                <TextAreaInput
                    {...register('remarks')}
                    className="mb-5"
                    label="Remarks"
                    error={errors.remarks?.message}
                />

                <div className="flex justify-end gap-3">
                    <Button className="bg-slate-300 shadow-slate-300/25" onClick={close}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        Submit
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
