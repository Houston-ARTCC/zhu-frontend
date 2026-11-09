'use client';

import React, { useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { LuCircleMinus, LuPlus } from 'react-icons/lu';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/Forms';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { type AddPositionsFormValues, addPositionsSchema } from '@/lib/events/schema';

interface AddPositionsModalProps extends ModalProps {
    addPositions: (values: AddPositionsFormValues) => Promise<void>;
}

export const AddPositionsModal: React.FC<AddPositionsModalProps> = ({ addPositions, show, close }) => {
    const {
        reset,
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(addPositionsSchema),
        defaultValues: {
            positions: [{ callsign: '', shifts: 1 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'positions',
    });

    const postResource: SubmitHandler<AddPositionsFormValues> = useCallback(
        async (data) => {
            await addPositions(data);
            close?.();
        },
        [addPositions, close],
    );

    useEffect(() => {
        if (!show) return;

        reset(undefined);
    }, [show, reset]);

    return (
        <Modal show={show} title="Add Positions" close={close}>
            <form onSubmit={handleSubmit(postResource)}>
                <div className="mb-3 flex flex-col gap-3">
                    <div className="grid grid-cols-11 gap-3">
                        <span />
                        <span className="col-span-5 font-medium">Callsign</span>
                        <span className="col-span-5 font-medium">Shifts</span>
                    </div>
                    {fields.map((item, i) => (
                        <div key={item.id} className="grid grid-cols-11 items-start gap-3">
                            <Button
                                color={fields.length < 2 ? 'gray-300' : 'red-400'}
                                className="mt-2.5"
                                variant="tertiary"
                                onClick={() => remove(i)}
                                disabled={fields.length < 2}
                            >
                                <LuCircleMinus size={20} />
                            </Button>
                            <TextInput
                                {...register(`positions.${i}.callsign`)}
                                className="col-span-5"
                                error={errors.positions?.[i]?.callsign?.message}
                            />
                            <TextInput
                                {...register(`positions.${i}.shifts`, { valueAsNumber: true })}
                                className="col-span-5"
                                type="number"
                                error={errors.positions?.[i]?.shifts?.message}
                            />
                            {errors.positions?.[i]?.message && (
                                <span className="col-span-10 col-start-2 text-sm font-medium text-red-400">
                                    {errors.positions?.[i]?.message}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                <Button className="mb-5 text-sm" variant="tertiary" onClick={() => append({ callsign: '', shifts: 1 })}>
                    <LuPlus />
                    Add Another Position
                </Button>
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

export const AddPositionsButton: React.FC<AddPositionsModalProps> = ({ addPositions }) => (
    <ModalButton
        className="text-sm"
        variant="tertiary"
        modal={<AddPositionsModal addPositions={addPositions} />}
    >
        <LuPlus />
        Add Position
    </ModalButton>
);
