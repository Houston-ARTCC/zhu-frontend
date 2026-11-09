'use client';

import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { Modal, type ModalProps } from '@/components/Modal';
import { SelectInput, type SelectOption, TextAreaInput, TextInput, ToggleInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { createEvent } from '@/lib/events/actions';
import { type NewEventFormValues, newEventSchema } from '@/lib/events/schema';

interface RequestTrainingModalProps extends ModalProps {
    presets: SelectOption[];
    start?: Date;
    end?: Date;
}

export const NewEventModal: React.FC<RequestTrainingModalProps> = ({ presets, start, end, show, close }) => {
    const router = useRouter();

    const { register, control, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        // ReactDatePicker's ref has no focus(), which would crash handleSubmit on a date error.
        shouldFocusError: false,
        resolver: zodResolver(newEventSchema),
        defaultValues: { start, end },
    });

    useEffect(() => reset({ start, end }), [start, end, show, reset]);

    const putRequest: SubmitHandler<NewEventFormValues> = useCallback((values) => {
        const data = {
            ...values,
            start: values.start.toISOString(),
            end: values.end.toISOString(),
            preset: values.preset?.value,
        };
        toast.promise(
            createEvent(data),
            {
                pending: 'Creating event',
                success: 'Successfully created',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then((id) => {
                router.push(`/events/${id}`);
                close?.();
            });
    }, [router, close]);

    return (
        <Modal show={show} title="New Event" close={close}>
            <form onSubmit={handleSubmit(putRequest)}>
                <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <TextInput
                        {...register('name')}
                        className="sm:col-span-2"
                        label="Event Name"
                        error={errors.name?.message}
                    />
                    <TextInput {...register('host')} label="Event Host" error={errors.host?.message} />
                    <TextInput
                        {...register('banner')}
                        id="banner_url"
                        label="Banner URL"
                        type="url"
                        error={errors.banner?.message}
                    />
                    <Controller
                        name="start"
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <div className="flex flex-col">
                                <ReactDatePicker
                                    {...field}
                                    showTimeSelect
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
                                    dateFormat="MMM d, yyyy HH:mm"
                                    selected={value}
                                    customInput={<TextInput label="End (Local)" error={errors.end?.message} />}
                                />
                            </div>
                        )}
                    />
                    <Controller
                        name="preset"
                        control={control}
                        render={({ field }) => (
                            <SelectInput
                                {...field}
                                label="Position Preset"
                                className="sm:col-span-2"
                                error={errors.preset?.message}
                                options={presets}
                                isClearable
                            />
                        )}
                    />
                </div>

                <TextAreaInput
                    {...register('description')}
                    className="mb-3"
                    label="Description"
                    error={errors.description?.message}
                />

                <ToggleInput
                    {...register('hidden')}
                    className="mb-5"
                    label="Event hidden from controllers."
                />

                <div className="flex justify-end gap-3">
                    <Button color="gray-300" onClick={close}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        Save
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
