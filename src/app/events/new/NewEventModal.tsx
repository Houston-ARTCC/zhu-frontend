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
import { fetchApi } from '@/utils/fetch';
import type { Event } from '@/types/events';
import { type NewEventFormValues, newEventSchema } from './newEventSchema';

interface RequestTrainingModalProps extends ModalProps {
    presets: SelectOption[];
    start?: Date;
    end?: Date;
}

export const NewEventModal: React.FC<RequestTrainingModalProps> = ({ presets, start, end, show, close }) => {
    const router = useRouter();

    const { register, control, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewEventFormValues>({
        resolver: zodResolver(newEventSchema),
        defaultValues: { start, end },
    });

    useEffect(() => reset({ start, end }), [start, end, show, reset]);

    const putRequest: SubmitHandler<NewEventFormValues> = useCallback((values) => {
        const data = {
            ...values,
            preset: values.preset?.value,
        };
        toast.promise(
            fetchApi('/events/', { method: 'POST', body: JSON.stringify(data) }),
            {
                pending: 'Creating event',
                success: 'Successfully created',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then((resp) => {
                const { id } = resp as Event;
                router.push(`events/${id}/`);
                router.refresh();
                close?.();
            });
    }, [router, close]);

    return (
        <Modal show={show} title="New Event" close={close}>
            <form onSubmit={handleSubmit(putRequest)}>
                <div className="mb-3 grid grid-cols-2 gap-3">
                    <TextInput
                        {...register('name')}
                        className="col-span-2"
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
                                    dateFormat="MMM d, yyyy HH:mm"
                                    selected={value}
                                    customInput={<TextInput label="End (Zulu)" error={errors.end?.message} />}
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
                                className="col-span-2"
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
                    <Button className="bg-slate-300 shadow-slate-300/25" onClick={close}>
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
