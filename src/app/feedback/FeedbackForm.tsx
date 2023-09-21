'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { RatingInput } from '@/app/feedback/RatingInput';
import { SelectInput, TextAreaInput, TextInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type FeedbackFormValues, feedbackSchema } from './feedbackSchema';

interface VisitFormProps {
    controllerOptions: { value: number | undefined, label: string }[];
    eventOptions: { value: number, label: string }[];
}

export const FeedbackForm: React.FC<VisitFormProps> = ({ controllerOptions, eventOptions }) => {
    const router = useRouter();
    const { data: session } = useSession();

    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: { rating: 3 },
    });

    const postRequest: SubmitHandler<FeedbackFormValues> = useCallback((data) => {
        toast.promise(
            fetchApi(
                '/feedback/',
                { method: 'POST', body: JSON.stringify(data) },
            ),
            {
                pending: 'Submitting feedback',
                success: 'Successfully submitted',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => router.push('/'));
    }, [router]);

    if (!session) { return null; }

    return (
        <form onSubmit={handleSubmit(postRequest)}>
            <div className="mb-5 grid grid-cols-2 items-start gap-5">
                <div className="grid grid-cols-6 gap-3">
                    <TextInput
                        className="col-span-2"
                        readOnly
                        label="First Name"
                        value={session.user.first_name}
                    />
                    <TextInput
                        className="col-span-2"
                        readOnly
                        label="Last Name"
                        value={session.user.last_name}
                    />
                    <TextInput
                        className="col-span-2"
                        readOnly
                        label="Email"
                        value={session.user.email}
                    />

                    <Controller
                        name="controller"
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <SelectInput
                                {...field}
                                className="col-span-3"
                                label="Controller's Name"
                                options={controllerOptions}
                                value={controllerOptions.find((option) => option.value === value)}
                            />
                        )}
                    />
                    <Controller
                        name="event"
                        control={control}
                        render={({ field: { value, ...field } }) => (
                            <SelectInput
                                {...field}
                                className="col-span-3"
                                isClearable
                                label="Event"
                                options={eventOptions}
                                value={eventOptions.find((option) => option.value === value)}
                            />
                        )}
                    />
                    <TextInput
                        {...register('controller_callsign')}
                        className="col-span-3"
                        label="Controller's Callsign"
                    />
                    <TextInput
                        {...register('pilot_callsign')}
                        className="col-span-3"
                        label="Your Callsign"
                    />
                </div>

                <div className="flex h-full flex-col gap-3">
                    <Controller
                        name="rating"
                        control={control}
                        render={({ field }) => (
                            <RatingInput {...field} />
                        )}
                    />
                    <TextAreaInput
                        {...register('comments')}
                        className="h-full"
                        inputClassName="h-full resize-none"
                        label="Comments"
                        error={errors.comments?.message}
                    />
                </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
                Submit
            </Button>
        </form>
    );
};
