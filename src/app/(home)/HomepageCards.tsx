'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns-tz';
import { LuArrowRight, LuCalendar, LuClock } from 'react-icons/lu';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import { Card } from '@/components/Card';
import { ClientPortal } from '@/components/ClientPortal';
import { type Announcement } from '@/types/announcements';
import { type BasicEvent } from '@/types/events';

interface AnnouncementCardProps {
    announcement: Announcement;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <>
            <Card interactive onClick={() => setShowModal(true)}>
                <div className="flex w-full items-center">
                    <p className="inline-block w-32 whitespace-nowrap text-gray-400">
                        {format(new Date(announcement.posted), 'MMM d, y')}
                    </p>
                    <h4 className="w-full shrink truncate text-lg font-medium">
                        {announcement.title}
                    </h4>
                </div>
            </Card>
            <ClientPortal>
                <AnnouncementModal
                    show={showModal}
                    announcement={announcement}
                    close={() => setShowModal(false)}
                />
            </ClientPortal>
        </>
    );
};

interface EventCardProps {
    event: BasicEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => (
    <Link className="text-inherit" href={`/events/${event.id}`} prefetch={false}>
        <Card interactive>
            <div className="grid grid-cols-2">
                <div>
                    <h4 className="text-ellipsis whitespace-nowrap text-lg font-medium">{event.name}</h4>
                    <h5 className="mb-5 text-ellipsis whitespace-nowrap text-slate-400">
                        Presented by {event.host}
                    </h5>
                    <div className="mb-3 flex items-center gap-3">
                        <LuCalendar size={23} />
                        {format(new Date(event.start), 'MMM d, y')}
                    </div>
                    <div className="flex items-center gap-3">
                        <LuClock size={23} />
                        <span className="flex items-center gap-1.5">
                            {format(new Date(event.start), 'HH:mm zzz')}
                            <LuArrowRight />
                            {format(new Date(event.end), 'HH:mm zzz')}
                        </span>
                    </div>
                </div>
                <img className="object-contain" src={event.banner} />
            </div>
        </Card>
    </Link>
);
