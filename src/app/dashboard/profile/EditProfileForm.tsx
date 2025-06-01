'use client';

import React, { useCallback } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Button } from '@/components/Button';
import { TextAreaInput } from '@/components/Forms';
import { ProfilePicture } from '@/components/ProfilePicture';
import { fetchApi } from '@/utils/fetch';
import { type User } from '@/types/users';
import { ChangeProfilePictureButton } from './ChangeProfilePictureModal';
import { type EditProfileFormValues, editProfileSchema } from './editProfileSchema';

interface EditProfileFormProps {
    user: User;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ user }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            biography: user.biography || '',
        },
    });

    const putRequest: SubmitHandler<EditProfileFormValues> = useCallback((data) => {
        toast.promise(
            fetchApi(
                `/users/${user.cid}/`,
                { method: 'PUT', body: JSON.stringify(data) },
            ),
            {
                pending: 'Saving changes',
                success: 'Successfully saved',
                error: 'Something went wrong, check console for more info',
            },
        );
    }, [user]);

    return (
        <>
            <div className="mb-5">
                <p className="mb-2 font-medium">Profile Picture</p>
                <div className="flex items-center gap-5">
                    <ProfilePicture user={user} size={64} />
                    <ChangeProfilePictureButton user={user} />
                </div>
            </div>

            <form onSubmit={handleSubmit(putRequest)}>
                <TextAreaInput
                    {...register('biography')}
                    className="mb-5"
                    label="Biography"
                    error={errors.biography?.message}
                />

                <Button type="submit" disabled={isSubmitting}>
                    Save
                </Button>
            </form>
        </>
    );
};
