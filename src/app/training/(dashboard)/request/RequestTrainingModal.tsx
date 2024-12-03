'use client';

import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { Modal, type ModalProps } from '@/components/Modal';
import { SelectInput, TextAreaInput, TextInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { sessionLevels, sessionTypes } from '../../selectOptions';
import { type RequestTrainingFormValues, requestTrainingSchema } from './requestTrainingSchema';

interface RequestTrainingModalProps extends ModalProps {
    start?: Date;
    end?: Date;
}

export const RequestTrainingModal: React.FC<RequestTrainingModalProps> = ({ start, end, show, close }) => {
    const router = useRouter();

    const { register, control, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm<RequestTrainingFormValues>({
        resolver: zodResolver(requestTrainingSchema),
        defaultValues: { start, end },
    });

    useEffect(() => reset({ start, end }), [start, end, show, reset]);

    const putRequest: SubmitHandler<RequestTrainingFormValues> = useCallback((values) => {
        const data = {
            ...values,
            type: values.type.value,
            level: values.level.value,
        };
        toast.promise(
            fetchApi('/training/request/', { method: 'POST', body: JSON.stringify(data) }),
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
        <Modal show={show} title="Request Training" close={close}>
            <form onSubmit={handleSubmit(putRequest)}>
                <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Controller
                        name="start"
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <div className="flex flex-col">
                                <ReactDatePicker
                                    {...field}
                                    showTimeSelect
                                    portalId="modal-container"
                                    dateFormat="MMM d, yyyy HH:mm"
                                    selected={value}
                                    customInput={<TextInput label="Start (Zulu)" error={errors.start?.message} />}
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
                                    showTimeSelect
                                    portalId="modal-container"
                                    dateFormat="MMM d, yyyy HH:mm"
                                    selected={value}
                                    customInput={<TextInput label="End (Zulu)" error={errors.end?.message} />}
                                />
                            </div>
                        )}
                    />
                </div>
                <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <SelectInput
                                {...field}
                                label="Type"
                                openInModal
                                error={errors.type?.message}
                                options={sessionTypes}
                            />
                        )}
                    />
                    <Controller
                        name="level"
                        control={control}
                        render={({ field }) => (
                            <SelectInput
                                {...field}
                                label="Level"
                                openInModal
                                error={errors.level?.message}
                                options={sessionLevels}
                                formatOptionLabel={(option) => (
                                    <>
                                        <span className="mr-2 inline-block w-3 text-right opacity-50">
                                            {option.value + 1}.
                                        </span>
                                        {option.label}
                                    </>
                                )}
                            />
                        )}
                    />
                </div>

                <TextAreaInput
                    {...register('remarks')}
                    className="mb-5"
                    label="Remarks (Optional)"
                    error={errors.remarks?.message}
                />

                <div className="flex justify-end gap-3">
                    <Button color="gray-300" onClick={close}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        Request
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
