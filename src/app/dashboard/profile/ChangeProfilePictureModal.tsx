'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { FileInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { type AuthenticatedUser } from '@/types/users';
import { uploadOwnProfilePicture } from '@/lib/users/actions';

const profilePictureSchema = z.object({
    avatar: z.union([
        z.instanceof(File, { message: 'This field is required' }),
        z.string(),
    ]),
});

type ProfilePictureFormValues = z.infer<typeof profilePictureSchema>;

interface ChangeProfilePictureModalProps extends ModalProps {
    user: AuthenticatedUser;
}

export const ChangeProfilePictureModal: React.FC<ChangeProfilePictureModalProps> = ({ show, close }) => {
    const router = useRouter();

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(profilePictureSchema),
    });

    const putProfilePicture: SubmitHandler<ProfilePictureFormValues> = useCallback((values) => {
        const data = new FormData();
        data.append('avatar', values.avatar);

        toast.promise(
            uploadOwnProfilePicture(data),
            {
                pending: 'Saving changes',
                success: 'Successfully saved',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.refresh();
                close?.();
            });
    }, [router, close]);

    const resetProfilePicture = () => putProfilePicture({ avatar: '' });

    return (
        <Modal show={show} title="Change Profile Picture" close={close}>
            <form onSubmit={handleSubmit(putProfilePicture)}>
                <Controller
                    name="avatar"
                    control={control}
                    render={({
                        field: {
                            value,
                            onChange,
                        },
                    }) => (
                        <FileInput
                            className="mb-5"
                            error={errors.avatar?.message}
                            currentFile={value}
                            onUpload={(acceptedFiles) => onChange(acceptedFiles[0])}
                        />
                    )}
                />

                <div className="flex justify-end gap-3">
                    <Button color="red-400" className="mr-auto" onClick={resetProfilePicture}>
                        Reset
                    </Button>
                    <Button color="gray-300" onClick={close}>
                        Close
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        Save
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export const ChangeProfilePictureButton: React.FC<ChangeProfilePictureModalProps> = ({ ...props }) => (
    <ModalButton modal={<ChangeProfilePictureModal {...props} />}>
        Change
    </ModalButton>
);
