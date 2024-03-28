'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Modal, type ModalProps } from '@/components/Modal';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type Announcement } from '@/types/announcements';

interface DeleteAnnouncementModalProps extends ModalProps {
    announcement?: Announcement;
}

export const DeleteAnnouncementModal: React.FC<DeleteAnnouncementModalProps> = ({ announcement, show, close }) => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const cancelSession = useCallback(() => {
        if (!announcement) return;

        setIsSubmitting(true);

        toast.promise(
            fetchApi(`/announcements/${announcement.id}/`, { method: 'DELETE' }),
            {
                pending: 'Deleting announcement',
                success: 'Successfully deleted',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => {
                setIsSubmitting(false);
                router.refresh();
                close?.();
            });
    }, [announcement, router, close]);

    return (
        <Modal show={show} title="Delete Announcement" close={close}>
            <p className="mb-5">
                Are you sure you would like to delete the announcement <b>{announcement?.title}</b>?
            </p>

            <div className="flex justify-end gap-3">
                <Button color="gray-300" onClick={close}>
                    Cancel
                </Button>
                <Button type="submit" onClick={cancelSession} disabled={isSubmitting}>
                    Confirm
                </Button>
            </div>
        </Modal>
    );
};
