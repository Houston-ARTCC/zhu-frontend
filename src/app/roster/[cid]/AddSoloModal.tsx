import React, { useCallback, useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type AddSoloFormValues, addSoloSchema } from '@/app/roster/[cid]/addSoloSchema';
import { Modal, type ModalProps } from '@/components/Modal';
import { TextInput } from '@/components/Forms';
import { Button } from '@/components/Button';

interface AddSoloModalProps extends ModalProps {
    update: (position: string) => void;
}

export const AddSoloModal: React.FC<AddSoloModalProps> = ({ update, show, close }) => {
    const { register, reset, handleSubmit, formState: { errors } } = useForm<AddSoloFormValues>({
        resolver: zodResolver(addSoloSchema),
    });

    useEffect(() => reset(), [show, reset]);

    const returnPosition: SubmitHandler<AddSoloFormValues> = useCallback((values) => {
        update(values.position);
        close?.();
    }, [update, close]);

    return (
        <Modal show={show} title="Add Solo Endorsement" close={close}>
            <form>
                <p className="mb-5">
                    <b>Note:</b> This will not add the solo endorsement to the VATUSA website. This must still be done manually.
                </p>
                <div className="mb-5">
                    <TextInput
                        {...register('position')}
                        className="col-span-2"
                        label="Position"
                        placeholder="eg. AUS_TWR"
                        error={errors.position?.message}
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Button className="bg-slate-300 shadow-slate-300/25" onClick={close}>
                        Cancel
                    </Button>
                    {/* For some inexplicable reason, this also submits the edit user form, so we'll submit programmatically instead. */}
                    <Button type="button" onClick={handleSubmit(returnPosition)}>
                        Submit
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
