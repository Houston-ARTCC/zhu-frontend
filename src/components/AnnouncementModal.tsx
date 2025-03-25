'use client';

import React from 'react';
import { format } from 'date-fns-tz';
import { Modal, type ModalProps } from '@/components/Modal';
import { ProfilePicture } from '@/components/ProfilePicture';
import { parseHtml } from '@/utils/parseHtml';
import { type Announcement } from '@/types/announcements';

interface AnnouncementModalProps extends ModalProps {
    announcement?: Announcement;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ announcement, show, close }) => (
    <Modal
        large
        show={show}
        close={close}
        title={announcement?.title}
        footer={(
            <div className="flex items-center gap-2">
                <ProfilePicture user={announcement?.author} size={30} />
                <p>
                    <span className="font-medium">
                        {announcement?.author.first_name} {announcement?.author.last_name}
                    </span>
                    {' '}
                    on
                    {' '}
                    {announcement && format(new Date(announcement.posted), 'MMM d, y \'at\' HH:mm zzz')}
                </p>
            </div>
        )}
    >
        <div className="prose max-w-none dark:prose-invert">
            {announcement && parseHtml(announcement?.body)}
        </div>
    </Modal>
);
