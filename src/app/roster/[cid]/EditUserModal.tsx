'use client';

import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LuPlusCircle, LuUserCog } from 'react-icons/lu';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { SelectInput, TextInput, ToggleInput } from '@/components/Forms';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type AuthenticatedUser } from '@/types/users';
import { ToggleEndorsementButton } from './ToggleEndorsementButton';
import { type EditUserFormValues, editUserSchema, roles } from './editUserSchema';

interface EditUserModalProps extends ModalProps {
    user: AuthenticatedUser;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, show, close }) => {
    const router = useRouter();

    const { reset, register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<EditUserFormValues>({
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
                    <TextInput readOnly label="Rating" value={user.rating.short} />
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

                <div className="flex flex-col gap-3">
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

                    <ToggleInput
                        {...register('prevent_event_signup')}
                        label="Prevent Event Sign Up"
                    />

                    <ToggleInput
                        {...register('cic_endorsed')}
                        label="CIC Endorsed"
                    />
                </div>

                <hr className="my-5" />

                <div className="mb-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-3">
                    <div />
                    <small className="flex items-center gap-1 text-slate-400">
                        Click endorsements to toggle. Click <LuPlusCircle className="inline" /> to add solo endorsement.
                    </small>
                    <p className="text-right font-medium">Delivery + Ground</p>
                    <div className="flex gap-2">
                        <Controller
                            name="endorsements.del"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <ToggleEndorsementButton
                                    tier={0}
                                    name="DEL"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                        <Controller
                            name="endorsements.gnd"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <ToggleEndorsementButton
                                    tier={0}
                                    name="GND"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                        <Controller
                            name="endorsements.hou_gnd"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <ToggleEndorsementButton
                                    tier={1}
                                    name="HOU GND T1"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                        <Controller
                            name="endorsements.iah_gnd"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <ToggleEndorsementButton
                                    tier={1}
                                    name="IAH GND T1"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                    </div>
                    <p className="text-right font-medium">Local</p>
                    <div className="flex gap-2">
                        <Controller
                            name="endorsements.twr"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <ToggleEndorsementButton
                                    tier={0}
                                    name="TWR"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                        <Controller
                            name="endorsements.hou_twr"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <ToggleEndorsementButton
                                    tier={1}
                                    name="HOU TWR T1"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                        <Controller
                            name="endorsements.iah_twr"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <ToggleEndorsementButton
                                    tier={1}
                                    name="IAH TWR T1"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                    </div>
                    <p className="text-right font-medium">Approach</p>
                    <div className="flex gap-2">
                        <Controller
                            name="endorsements.app"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <ToggleEndorsementButton
                                    tier={0}
                                    name="APP"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                        <Controller
                            name="endorsements.i90_app"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <ToggleEndorsementButton
                                    tier={1}
                                    name="I90 APP T1"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                    </div>
                    <p className="text-right font-medium">Center</p>
                    <div className="flex gap-2">
                        <Controller
                            name="endorsements.zhu"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <ToggleEndorsementButton
                                    tier={2}
                                    name="ZHU"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button className="bg-slate-300 shadow-slate-300/25" onClick={close}>
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

interface EditUserButtonProps {
    user: AuthenticatedUser;
}

export const EditUserButton: React.FC<EditUserButtonProps> = ({ user }) => (
    <ModalButton modal={<EditUserModal user={user} />}>
        <LuUserCog size={20} />
        Edit User
    </ModalButton>
);
