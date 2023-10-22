'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, type ModalProps } from '@/components/Modal';
import { Button } from '@/components/Button';
import { TextInput, ToggleInput } from '@/components/Forms';
import { fetchApi } from '@/utils/fetch';
import { type UserStatistic } from '@/types/connections';
import { type PurgeFormValues, purgeSchema } from './purgeSchema';

interface PurgeModalProps extends ModalProps{
    users: UserStatistic[];
}

export const PurgeModal: React.FC<PurgeModalProps> = ({ users, show, close }) => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PurgeFormValues>({
        resolver: zodResolver(purgeSchema),
    });

    const deleteUsers: SubmitHandler<PurgeFormValues> = useCallback((values) => {
        const data = { reason: values.reason };
        const deleteRequests = users.map((user) => (
            fetchApi(`/users/${user.cid}/`, { method: 'DELETE', body: JSON.stringify(data) })
        ));
        toast.promise(
            Promise.all(deleteRequests),
            {
                pending: 'Purging users',
                success: 'Successfully purged',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                router.refresh();
                close?.();
            });
    }, [users, router, close]);

    return (
        <Modal show={show} title="Roster Purge" close={close}>
            <form onSubmit={handleSubmit(deleteUsers)}>
                <p className="mb-3">
                    Confirming this action will automatically remove the following users from both the
                    Houston ARTCC and VATUSA rosters. <b>This action cannot be undone!</b>
                </p>
                <ul className="mb-3">
                    {users.map((user) => (
                        <li key={user.cid}>
                            {user.first_name} {user.last_name} ({user.cid})
                        </li>
                    ))}
                </ul>

                <TextInput
                    {...register('reason')}
                    className="mb-5"
                    label="Reason for removal"
                    error={errors.reason?.message}
                />

                <ToggleInput
                    {...register('agree')}
                    label="I understand that this action cannot be undone."
                    className="mb-5"
                    error={errors.agree?.message}
                />

                <div className="flex justify-end gap-3">
                    <Button className="bg-slate-300 shadow-slate-300/25" onClick={close}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        Confirm
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
