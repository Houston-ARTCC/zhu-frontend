'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatInTimeZone } from 'date-fns-tz';
import { LuArrowRight, LuCalendar, LuClock } from 'react-icons/lu';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import { Card } from '@/components/Card';
import { LocalTimeRange } from '@/components/LocalTimeRange';
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
                        {formatInTimeZone(announcement.posted, 'Etc/UTC', 'MMM d, y')}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="order-last sm:order-first">
                    <h4 className="text-ellipsis text-lg font-medium">{event.name}</h4>
                    <h5 className="mb-5 text-ellipsis text-slate-400">
                        Presented by {event.host}
                    </h5>
                    <div className="mb-3 flex items-center gap-3">
                        <LuCalendar size={23} />
                        {formatInTimeZone(event.start, 'Etc/UTC', 'MMM d, y')}
                    </div>
                    <div className="flex items-center gap-3">
                        <LuClock size={23} />
                        <span className="flex items-center gap-1.5">
                            {formatInTimeZone(event.start, 'Etc/UTC', 'HH:mm zzz')}
                            <LuArrowRight />
                            {formatInTimeZone(event.end, 'Etc/UTC', 'HH:mm zzz')}
                        </span>
                    </div>
                    <LocalTimeRange className="mt-1 block pl-[35px]" start={event.start} end={event.end} />
                </div>
                <img className="object-contain" src={event.banner} />
            </div>
        </Card>
    </Link>
);
