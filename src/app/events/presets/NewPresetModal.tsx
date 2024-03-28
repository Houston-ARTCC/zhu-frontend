'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { LuPlus } from 'react-icons/lu';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/Forms';
import { fetchApi } from '@/utils/fetch';
import { type NewPresetFormValues, newPresetSchema } from './newPresetSchema';

export const NewPresetModal: React.FC<ModalProps> = ({ show, close }) => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewPresetFormValues>({
        resolver: zodResolver(newPresetSchema),
    });

    const postPreset: SubmitHandler<NewPresetFormValues> = useCallback((data) => {
        toast.promise(
            fetchApi('/events/presets/', { method: 'POST', body: JSON.stringify(data) }),
            {
                pending: 'Creating preset',
                success: 'Successfully created',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.refresh();
                close?.();
            });
    }, [router, close]);

    return (
        <Modal show={show} title="New Preset" close={close}>
            <form onSubmit={handleSubmit(postPreset)}>
                <TextInput
                    {...register('name')}
                    className="mb-5"
                    autoFocus
                    label="Title"
                    error={errors.name?.message}
                />

                <div className="flex justify-end gap-3">
                    <Button color="gray-300" onClick={close}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        Submit
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export const NewPresetButton: React.FC = () => (
    <ModalButton
        className="mb-10"
        modal={<NewPresetModal />}
    >
        <LuPlus size={20} />
        New Preset
    </ModalButton>
);
