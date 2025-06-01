'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LuPlus } from 'react-icons/lu';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactQuill from 'react-quill-new';
import classNames from 'classnames';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { TextInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type AnnouncementFormValues, announcementSchema } from './announcementSchema';

export const NewAnnouncementModal: React.FC<ModalProps> = ({ show, close }) => {
    const router = useRouter();

    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(announcementSchema),
    });

    const postResource: SubmitHandler<AnnouncementFormValues> = useCallback((data) => {
        toast.promise(
            fetchApi('/announcements/', { method: 'POST', body: JSON.stringify(data) }),
            {
                pending: 'Creating announcement',
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
        <Modal large show={show} title="New Announcement" close={close}>
            <form onSubmit={handleSubmit(postResource)}>
                <TextInput
                    {...register('title')}
                    className="mb-5"
                    label="Title"
                    error={errors.title?.message}
                />

                <div className="mb-5">
                    <Controller
                        name="body"
                        control={control}
                        render={({ field }) => (
                            <>
                                <ReactQuill
                                    {...field}
                                    className={classNames({ error: errors.body })}
                                    modules={{
                                        toolbar: [
                                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                                            ['link', 'image', 'code-block'],
                                            ['clean'],
                                        ],
                                    }}
                                />
                                {errors.body && <span className="mt-1 text-sm text-red-400">{errors.body.message}</span>}
                            </>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button color="gray-300" onClick={close}>
                        Close
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        Submit
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export const NewAnnouncementButton: React.FC = () => (
    <ModalButton
        className="mb-5"
        modal={<NewAnnouncementModal />}
    >
        <LuPlus size={20} />
        New Announcement
    </ModalButton>
);
