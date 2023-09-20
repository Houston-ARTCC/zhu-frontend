'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { type Profile } from 'next-auth';
import { TextAreaInput, TextInput, ToggleInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type VisitFormValues, visitSchema } from './visitSchema';

interface VisitFormProps {
    user: Profile;
}

export const VisitForm: React.FC<VisitFormProps> = ({ user }) => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<VisitFormValues>({
        resolver: zodResolver(visitSchema),
    });

    const postRequest: SubmitHandler<VisitFormValues> = useCallback((values) => {
        const data = { reason: values.reason };
        toast.promise(
            fetchApi(
                '/visit/',
                { method: 'POST', body: JSON.stringify(data) },
            ),
            {
                pending: 'Submitting application',
                success: 'Successfully submitted',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.back();
                router.refresh();
            });
    }, [router]);

    return (
        <form onSubmit={handleSubmit(postRequest)}>
            <div className="mb-5 grid grid-cols-2 items-start gap-5">
                <div className="grid grid-cols-12 gap-3">
                    <TextInput
                        className="col-span-4"
                        disabled
                        label="CID"
                        value={user.cid}
                    />
                    <TextInput
                        className="col-span-4"
                        disabled
                        label="First Name"
                        value={user.first_name}
                    />
                    <TextInput
                        className="col-span-4"
                        disabled
                        label="Last Name"
                        value={user.last_name}
                    />

                    <TextInput
                        className="col-span-6"
                        disabled
                        label="Email"
                        value={user.email}
                    />
                    <TextInput
                        className="col-span-3"
                        disabled
                        label="Home Facility"
                        value={user.facility}
                    />
                    <TextInput
                        className="col-span-3"
                        disabled
                        label="Rating"
                        value={user.rating}
                    />
                </div>

                <div className="flex h-full flex-col">
                    <TextAreaInput
                        {...register('reason')}
                        className="h-full"
                        inputClassName="h-full resize-none"
                        label="Why do you want to visit Houston?"
                        error={errors.reason?.message}
                    />
                </div>
            </div>

            <div className="mb-5 flex flex-col gap-3">
                <ToggleInput
                    {...register('agreeEmail')}
                    label="I agree to receive notification emails from Houston ARTCC"
                    error={errors.agreeEmail?.message}
                />
                <ToggleInput
                    {...register('agreePrivacy')}
                    label="I have read and agree to the Privacy Policy"
                    error={errors.agreePrivacy?.message}
                />
            </div>

            <Button type="submit">
                Submit
            </Button>
        </form>
    );
};
