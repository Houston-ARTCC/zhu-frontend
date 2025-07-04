'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import ReactDatePicker from 'react-datepicker';
import { SelectInput, TextAreaInput, TextInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { airports, type SupportFormValues, supportSchema } from './supportSchema';

export const SupportForm: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(supportSchema),
    });

    const postRequest: SubmitHandler<SupportFormValues> = useCallback((values) => {
        const data = {
            ...values,
            banner: values.banner_url,
            requested_fields: values.requested_fields.map(({ value }) => value),
        };
        toast.promise(
            fetchApi(
                '/events/support/',
                { method: 'POST', body: JSON.stringify(data) },
            ),
            {
                pending: 'Submitting request',
                success: 'Successfully submitted',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => router.push('/'));
    }, [router]);

    if (!session) { return null; }

    return (
        <form onSubmit={handleSubmit(postRequest)}>
            <div className="mb-5 grid grid-cols-1 items-start gap-5 md:grid-cols-2">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-6">
                    <TextInput
                        className="2xl:col-span-2"
                        readOnly
                        label="First Name"
                        value={session.user.first_name}
                    />
                    <TextInput
                        className="2xl:col-span-2"
                        readOnly
                        label="Last Name"
                        value={session.user.last_name}
                    />
                    <TextInput
                        className="sm:col-span-2"
                        readOnly
                        label="Email"
                        value={session.user.email}
                    />

                    <TextInput
                        {...register('name')}
                        className="sm:col-span-2"
                        label="Event Name"
                        error={errors.name?.message}
                    />
                    <TextInput
                        {...register('host')}
                        className="md:col-span-2 lg:col-span-1 2xl:col-span-2"
                        label="Event Host"
                        error={errors.host?.message}
                    />
                    <TextInput
                        {...register('banner_url')}
                        className="md:col-span-2 lg:col-span-1 2xl:col-span-2"
                        label="Banner URL"
                        type="url"
                        error={errors.banner_url?.message}
                    />

                    <Controller
                        name="start"
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <div className="flex flex-col 2xl:col-span-3">
                                <ReactDatePicker
                                    {...field}
                                    showTimeSelect
                                    dateFormat="MMM d, yyyy HH:mm"
                                    selected={value}
                                    customInput={(
                                        <TextInput
                                            label="Start (Local)"
                                            error={errors.start?.message}
                                        />
                                    )}
                                />
                            </div>
                        )}
                    />

                    <Controller
                        name="end"
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <div className="flex flex-col 2xl:col-span-3">
                                <ReactDatePicker
                                    {...field}
                                    showTimeSelect
                                    dateFormat="MMM d, yyyy HH:mm"
                                    selected={value}
                                    customInput={(
                                        <TextInput
                                            label="End (Local)"
                                            error={errors.end?.message}
                                        />
                                    )}
                                />
                            </div>
                        )}
                    />
                </div>

                <div className="flex h-full flex-col gap-3">
                    <Controller
                        name="requested_fields"
                        control={control}
                        render={({ field }) => (
                            <SelectInput
                                {...field}
                                label="Requested Fields"
                                error={errors.requested_fields?.message}
                                formatOptionLabel={({ value, label }) => (
                                    <span>
                                        <b>{value}</b> {label}
                                    </span>
                                )}
                                options={airports}
                                closeMenuOnSelect={false}
                                isClearable={false}
                                isMulti
                            />
                        )}
                    />
                    <TextAreaInput
                        {...register('description')}
                        className="h-full"
                        inputClassName="h-full resize-none"
                        label="Event Description"
                        error={errors.description?.message}
                    />
                </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
                Submit
            </Button>
        </form>
    );
};
