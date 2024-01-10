'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { FaDiscord } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Button } from '@/components/Button';
import { TextAreaInput, TextInput, ToggleInput } from '@/components/Forms';
import { fetchApi } from '@/utils/fetch';
import { type Event } from '@/types/events';
import { type EditEventFormValues, editEventSchema } from './editEventSchema';

interface EditEventFormProps {
    event: Event;
}

export const EditEventForm: React.FC<EditEventFormProps> = ({ event }) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EditEventFormValues>({
        resolver: zodResolver(editEventSchema),
        defaultValues: {
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
        },
    });

    const patchRequest: SubmitHandler<EditEventFormValues> = useCallback(
        (data) => {
            toast.promise(
                fetchApi(`/events/${event.id}/`, {
                    method: 'PATCH',
                    body: JSON.stringify(data),
                }),
                {
                    pending: 'Saving changes',
                    success: 'Successfully saved',
                    error: 'Something went wrong, check console for more info',
                },
            );
        },
        [event],
    );

    const putRequest = useCallback(() => {
        toast.promise(fetchApi(`/events/${event.id}/`, { method: 'PUT' }), {
            pending: 'Posting events to Discord',
            success: 'Successfully posted',
            error: 'Something went wrong, check console for more info',
        });
    }, [event]);

    return (
        <form className="mb-10" onSubmit={handleSubmit(patchRequest)}>
            <div className="mb-5 grid grid-cols-2 items-start gap-5">
                <div className="grid grid-cols-2 gap-3">
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
                </div>
                <TextAreaInput
                    {...register('description')}
                    className="h-full"
                    inputClassName="h-full resize-none"
                    label="Description"
                    error={errors.description?.message}
                />
            </div>

            <ToggleInput {...register('hidden')} className="mb-5" label="Event hidden from controllers." />

            <div className="flex gap-3">
                <Link href={`/events/${event.id}`}>
                    <Button className="bg-slate-300 shadow-slate-300/25">Return to Event</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                    Save
                </Button>
                <Button className="!bg-red-400 !shadow-red-400/25">Delete Event</Button>
                <Button className="ml-auto !bg-indigo-400 !shadow-indigo-400/25" onClick={putRequest}>
                    <FaDiscord />
                    Post Event Positions
                </Button>
            </div>
        </form>
    );
};
