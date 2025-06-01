import React, { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { LuUserPlus } from 'react-icons/lu';
import { type GroupBase } from 'react-select';
import { Button } from '@/components/Button';
import { DropdownButton } from '@/components/Dropdown';
import { SelectInput, type SelectOption } from '@/components/Forms';
import { Modal, type ModalProps } from '@/components/Modal';
import { ClientPortal } from '@/components/ClientPortal';
import { fetchApi } from '@/utils/fetch';
import { type BasicUser, type Roster } from '@/types/users';
import { userToOption } from '@/utils';
import { type ManualAssignFormValues, manualAssignSchema } from './manualAssignSchema';

interface ManualAssignModalProps extends ModalProps {
    assignController: (cid: number) => Promise<void>;
}

export const ManualAssignModal: React.FC<ManualAssignModalProps> = ({ assignController, show, close }) => {
    const [controllers, setControllers] = useState<GroupBase<SelectOption>[]>();

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(manualAssignSchema),
    });

    const postResource: SubmitHandler<ManualAssignFormValues> = useCallback(
        (data) => {
            assignController(data.controller.value).then(close);
        },
        [assignController, close],
    );

    useEffect(() => {
        if (!show) return;

        reset(undefined);

        fetchApi<Roster<BasicUser>>('/users/simplified/').then((data) => {
            setControllers([
                {
                    label: 'Home Controllers',
                    options: data.home.map(userToOption),
                },
                {
                    label: 'Visiting Controllers',
                    options: data.visiting.map(userToOption),
                },
            ]);
        });
    }, [show, reset]);

    return (
        <Modal show={show} title="Manually Assign" close={close}>
            <form onSubmit={handleSubmit(postResource)}>
                <Controller
                    name="controller"
                    control={control}
                    render={({ field }) => (
                        <SelectInput
                            {...field}
                            openInModal
                            isLoading={controllers === undefined}
                            className="mb-5"
                            label="Category"
                            error={errors.controller?.message || errors.controller?.value?.message}
                            options={controllers}
                        />
                    )}
                />

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

export const ManualAssignButton: React.FC<ManualAssignModalProps> = ({ assignController }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <DropdownButton onClick={() => setOpen(true)}>
                <LuUserPlus />
                Manually Assign
            </DropdownButton>
            <ClientPortal>
                <ManualAssignModal
                    assignController={assignController}
                    show={open}
                    close={() => setOpen(false)}
                />
            </ClientPortal>
        </>
    );
};
