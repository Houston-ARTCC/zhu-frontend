'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { LuX } from 'react-icons/lu';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type PositionPreset } from '@/types/events';

interface DeletePresetModalProps extends ModalProps {
    preset: PositionPreset;
}

export const DeletePresetModal: React.FC<DeletePresetModalProps> = ({ preset, show, close }) => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const deletePreset = useCallback(() => {
        setIsSubmitting(true);

        toast.promise(
            fetchApi(`/events/presets/${preset.id}/`, { method: 'DELETE' }),
            {
                pending: 'Cancelling session',
                success: 'Successfully cancelled',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                setIsSubmitting(false);
                router.refresh();
                close?.();
            });
    }, [preset, router, close]);

    return (
        <Modal show={show} title="Delete Preset" close={close}>
            <p className="mb-3">Are you sure you would like to delete the <b>{preset.name}</b> position preset?</p>

            <div className="flex justify-end gap-3">
                <Button className="bg-slate-300 shadow-slate-300/25" onClick={close}>
                    Cancel
                </Button>
                <Button className="!bg-red-400 !shadow-red-400/25" type="submit" onClick={deletePreset} disabled={isSubmitting}>
                    Delete
                </Button>
            </div>
        </Modal>
    );
};

export const DeletePresetButton: React.FC<DeletePresetModalProps> = ({ preset }) => (
    <ModalButton
        modal={<DeletePresetModal preset={preset} />}
        variant="tertiary"
        className="text-sm !text-red-400"
    >
        <LuX />
        Delete Preset
    </ModalButton>
);