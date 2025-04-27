'use client';

import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LuPlusCircle, LuUserCog } from 'react-icons/lu';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
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

    const { data: session } = useSession();

    const { reset, register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserSchema),
    });

    useEffect(
        () => reset({ ...user, roles: user.roles.map(({ short }) => roles.find(({ value }) => value === short)) }),
        [user, show, reset],
    );

    const patchResource: SubmitHandler<EditUserFormValues> = useCallback((values) => {
        let body;
        if (session?.user.permissions.is_admin && values.roles) {
            body = {
                ...values,
                roles: values.roles.map(({ value, label }) => ({ short: value, long: label })),
            };
        } else {
            body = values;
            delete body.roles;
        }

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
    }, [user, router, session, close]);

    return (
        <Modal large show={show} title="Modify User" close={close}>
            <form onSubmit={handleSubmit(patchResource)}>
                <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-6">
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
                <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
                    <TextInput
                        {...register('email')}
                        className="col-span-2 md:col-span-4"
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
                    {session?.user.permissions.is_admin && (
                        <Controller
                            name="roles"
                            control={control}
                            render={({ field: { value, ...field } }) => (
                                <SelectInput
                                    {...field}
                                    label="Roles"
                                    error={errors.roles?.message}
                                    options={roles.filter((role) => !role.isFixed)}
                                    value={value?.sort((a, b) => (a.id > b.id ? 1 : -1))}
                                    closeMenuOnSelect={false}
                                    isClearable={false}
                                    isMulti
                                />
                            )}
                        />
                    )}

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
                    <small className="text-slate-400">
                        Click endorsements to toggle. Click <LuPlusCircle className="inline" /> to add solo endorsement.
                    </small>
                    <p className="text-right font-medium">Delivery + Ground</p>
                    <div className="flex flex-col gap-2 sm:flex-row">
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
                                    name="HOU GND"
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
                                    name="IAH GND"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                    </div>
                    <p className="text-right font-medium">Local</p>
                    <div className="flex flex-col gap-2 sm:flex-row">
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
                                    name="HOU TWR"
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
                                    name="IAH TWR"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                    </div>
                    <p className="text-right font-medium">Approach</p>
                    <div className="flex flex-col gap-2 sm:flex-row">
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
                            name="endorsements.i90"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <ToggleEndorsementButton
                                    tier={1}
                                    name="I90 APP"
                                    status={value}
                                    onUpdate={onChange}
                                />
                            )}
                        />
                    </div>
                    <p className="text-right font-medium">Center</p>
                    <div className="flex flex-col gap-2 sm:flex-row">
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

interface EditUserButtonProps {
    user: AuthenticatedUser;
}

export const EditUserButton: React.FC<EditUserButtonProps> = ({ user }) => (
    <ModalButton modal={<EditUserModal user={user} />}>
        <LuUserCog size={20} />
        Edit User
    </ModalButton>
);
