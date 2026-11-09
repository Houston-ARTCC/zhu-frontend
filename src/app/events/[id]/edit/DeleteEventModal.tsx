'use client';

import React, { useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { LuTrash2 } from 'react-icons/lu';
import { Modal, ModalButton, type ModalProps } from '@/components/Modal';
import { Button } from '@/components/Button';
import type { Event } from '@/types/events';
import { deleteEvent } from '@/lib/events/actions';

interface DeleteEventModalProps extends ModalProps {
    event: Event;
}

export const DeleteEventModal: React.FC<DeleteEventModalProps> = ({ event, show, close }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDelete = useCallback(() => {
        startTransition(() => {
            toast.promise(
                deleteEvent(event.id).then(() => {
                    router.push('/events');
                    close?.();
                }),
                {
                    pending: 'Deleting event',
                    success: 'Successfully deleted',
                    error: 'Something went wrong, check console for more info',
                },
            );
        });
    }, [event, router, close]);

    return (
        <Modal show={show} title="Delete Event" close={close}>
            <p className="mb-3">Are you sure you would like to delete <b>{event.name}</b>?</p>

            <div className="flex justify-end gap-3">
                <Button color="gray-300" onClick={close}>
                    Cancel
                </Button>
                <Button color="red-400" type="submit" onClick={handleDelete} disabled={isPending}>
                    Delete
                </Button>
            </div>
        </Modal>
    );
};

export const DeleteEventButton: React.FC<DeleteEventModalProps> = ({ event }) => (
    <ModalButton
        modal={<DeleteEventModal event={event} />}
        className="bg-red-400! shadow-red-400/25!"
    >
        <LuTrash2 />
        Delete Event
    </ModalButton>
);
