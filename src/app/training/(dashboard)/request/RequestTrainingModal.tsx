'use client';

import React, { useCallback, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { Modal, type ModalProps } from '@/components/Modal';
import { SelectInput, TextAreaInput, TextInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { submitTrainingRequest } from '@/lib/training/actions';
import { type RequestTrainingFormValues, requestTrainingSchema } from '@/lib/training/schema';
import { sessionLevels, sessionTypes } from '../../selectOptions';

interface RequestTrainingModalProps extends ModalProps {
    start?: Date;
    end?: Date;
}

export const RequestTrainingModal: React.FC<RequestTrainingModalProps> = ({ start, end, show, close }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const { register, control, reset, handleSubmit, formState: { errors } } = useForm({
        // ReactDatePicker's ref has no focus(), which would crash handleSubmit on a date error.
        shouldFocusError: false,
        resolver: zodResolver(requestTrainingSchema),
        defaultValues: { start, end },
    });

    useEffect(() => reset({ start, end }), [start, end, show, reset]);

    const putRequest: SubmitHandler<RequestTrainingFormValues> = useCallback((values) => {
        startTransition(() => {
            toast.promise(
                submitTrainingRequest(values),
                {
                    pending: 'Submitting request',
                    success: 'Successfully submitted',
                    error: {
                        render: ({ data: error }) => (
                            error instanceof Error ? error.message : 'Something went wrong, check console for more info'
                        ),
                    },
                },
            )
                .then(() => {
                    router.refresh();
                    close?.();
                })
                .catch(() => {
                    // Failure is already surfaced by the error toast.
                });
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
                                    customInput={<TextInput label="Start (Local)" error={errors.start?.message} />}
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
                                    customInput={<TextInput label="End (Local)" error={errors.end?.message} />}
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
                    <Button type="submit" disabled={isPending}>
                        Request
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
