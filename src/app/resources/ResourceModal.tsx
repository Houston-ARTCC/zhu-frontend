'use client';

import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LuPlus } from 'react-icons/lu';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { FileInput, SelectInput, TextInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { CATEGORY_STRING, type Resource } from '@/types/resources';
import { createResource, updateResource, deleteResource } from '@/lib/resources/actions';
import { type ResourceFormValues, resourceSchema } from './resourceSchema';

interface ResourceModalProps extends ModalProps {
    resource?: Resource;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ resource, show, close }) => {
    const router = useRouter();

    const { reset, register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(resourceSchema),
    });

    useEffect(() => {
        if (resource === undefined) {
            reset(undefined);
        } else {
            reset({
                name: resource.name,
                category: {
                    value: resource.category,
                    label: CATEGORY_STRING[resource.category],
                },
                path: resource.path,
            });
        }
    }, [reset, resource]);

    const postResource: SubmitHandler<ResourceFormValues> = useCallback((values) => {
        const data = new FormData();
        data.append('name', values.name);
        data.append('category', values.category.value);
        data.append('path', values.path);

        toast.promise(
            createResource(data),
            {
                pending: `Uploading "${values.name}"`,
                success: 'Successfully uploaded',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.refresh();
                close?.();
            });
    }, [router, close]);

    const patchResource: SubmitHandler<ResourceFormValues> = useCallback((values) => {
        if (!resource) return;

        const data = new FormData();
        data.append('name', values.name);
        data.append('category', values.category.value);

        // File is optional on update; only append if a new one was selected.
        if (values.path instanceof File) {
            data.append('path', values.path);
        }

        toast.promise(
            updateResource(resource.id, data),
            {
                pending: `Updating "${values.name}"`,
                success: 'Successfully updated',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.refresh();
                close?.();
            });
    }, [resource, router, close]);

    const handleDelete = useCallback(() => {
        if (!resource) return;

        toast.promise(
            deleteResource(resource.id),
            {
                pending: `Deleting "${resource.name}"`,
                success: 'Successfully deleted',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.refresh();
                close?.();
            });
    }, [resource, router, close]);

    return (
        <Modal show={show} title={resource ? 'Modifying Resource' : 'New Resource'} close={close}>
            <form onSubmit={handleSubmit(resource ? patchResource : postResource)}>
                <TextInput
                    {...register('name')}
                    className="mb-5"
                    label="Name"
                    error={errors.name?.message}
                />

                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <SelectInput
                            {...field}
                            className="mb-5"
                            label="Category"
                            error={errors.category?.message || errors.category?.value?.message}
                            options={Object.entries(CATEGORY_STRING).map(([category, title]) => ({
                                value: category,
                                label: title,
                            }))}
                        />
                    )}
                />

                <Controller
                    name="path"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <FileInput
                            className="mb-5"
                            error={errors.path?.message}
                            currentFile={value}
                            onUpload={(acceptedFiles) => onChange(acceptedFiles[0])}
                        />
                    )}
                />

                <div className="flex justify-end gap-3">
                    {resource && (
                        <Button color="red-400" className="mr-auto" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
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

export const NewResourceButton: React.FC = () => (
    <ModalButton
        className="mb-10"
        modal={<ResourceModal />}
    >
        <LuPlus size={20} />
        New Resource
    </ModalButton>
);
