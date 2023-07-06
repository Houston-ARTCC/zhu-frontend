'use client';

import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LuUserCog } from 'react-icons/lu';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { SelectInput, TextInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { CertBadge, CertDropdown } from '@/components/ProfileBadges';
import { Dropdown } from '@/components/Dropdown';
import { fetchApi } from '@/utils/fetch';
import { type User } from '@/types/users';
import { type EditUserFormValues, editUserSchema, roles } from './editUserSchema';

interface EditUserModalProps extends ModalProps {
    user: User;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, show, close }) => {
    const router = useRouter();

    const { reset, register, control, handleSubmit, formState: { errors } } = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserSchema),
    });

    useEffect(() => reset({ ...user, roles: user.roles.map(({ short }) => roles.find(({ value }) => value === short)) }), [user, show, reset]);

    const patchResource: SubmitHandler<EditUserFormValues> = useCallback((values) => {
        const body = {
            ...values,
            roles: values.roles.map(({ value, label }) => ({ short: value, long: label })),
        };
        toast.promise(
            fetchApi(`/users/${user.cid}/`, { method: 'PATCH', body: JSON.stringify(body) }),
            {
                pending: `Updating "${values.first_name} ${values.last_name}"`,
                success: 'Successfully updated',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.refresh();
                close?.();
            });
    }, [user, router, close]);

    return (
        <Modal large show={show} title="Modify User" close={close}>
            <form onSubmit={handleSubmit(patchResource)}>
                <div className="mb-3 grid grid-cols-6 gap-3">
                    <TextInput
                        {...register('first_name')}
                        className="col-span-2"
                        label="First Name"
                        error={errors.first_name?.message}
                    />
                    <TextInput
                        {...register('last_name')}
                        className="col-span-2"
                        label="Last Name"
                        error={errors.last_name?.message}
                    />
                    <TextInput readOnly label="CID" value={user.cid} />
                    <TextInput readOnly label="Rating" value={user.rating.long} />
                </div>
                <div className="grid grid-cols-6 gap-3">
                    <TextInput
                        {...register('email')}
                        className="col-span-4"
                        label="Email"
                        error={errors.email?.message}
                    />
                    <TextInput
                        {...register('home_facility')}
                        label="Facility"
                        error={errors.home_facility?.message}
                    />
                    <TextInput
                        {...register('initials')}
                        label="Initials"
                        error={errors.initials?.message}
                    />
                </div>

                <hr className="my-5" />

                <Controller
                    name="roles"
                    control={control}
                    render={({ field: { value, ...field } }) => (
                        <SelectInput
                            {...field}
                            label="Roles"
                            error={errors.roles?.message}
                            options={roles}
                            value={value.sort((a, b) => (a.id > b.id ? 1 : -1))}
                            closeMenuOnSelect={false}
                            isClearable={false}
                            isMulti
                        />
                    )}
                />

                <hr className="my-5" />

                <div className="mb-12 grid grid-cols-6">
                    <div className="flex flex-col items-center gap-2">
                        <p className="font-medium">Delivery</p>
                        <Controller
                            name="del_cert"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <CertDropdown cert={value} onUpdate={onChange} />
                            )}
                        />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="font-medium">Ground</p>
                        <Controller
                            name="gnd_cert"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <CertDropdown cert={value} onUpdate={onChange} />
                            )}
                        />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="font-medium">Tower</p>
                        <Controller
                            name="twr_cert"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <CertDropdown cert={value} onUpdate={onChange} />
                            )}
                        />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="font-medium">Approach</p>
                        <Controller
                            name="app_cert"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <CertDropdown cert={value} onUpdate={onChange} />
                            )}
                        />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="font-medium">Center</p>
                        <Controller
                            name="ctr_cert"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <CertDropdown cert={value} onUpdate={onChange} />
                            )}
                        />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="font-medium">Oceanic</p>
                        <Controller
                            name="ocn_cert"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <CertDropdown cert={value} onUpdate={onChange} />
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button className="bg-slate-300 shadow-slate-300/25" onClick={close}>
                        Close
                    </Button>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Modal>
    );
};

interface EditUserButtonProps {
    user: User;
}

export const EditUserButton: React.FC<EditUserButtonProps> = ({ user }) => (
    <ModalButton modal={<EditUserModal user={user} />}>
        <LuUserCog size={20} />
        Edit User
    </ModalButton>
);
