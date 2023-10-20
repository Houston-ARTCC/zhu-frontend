'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns-tz';
import { LuArrowRight, LuCalendar, LuClock } from 'react-icons/lu';
import ReactDOM from 'react-dom';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { ProfilePicture } from '@/components/ProfilePicture';
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
                <div className="mb-3 flex w-full gap-5">
                    <h4 className="w-full shrink overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold">
                        {announcement.title}
                    </h4>
                    <Badge className="ml-auto">{format(new Date(announcement.posted), 'MMM d, y')}</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <ProfilePicture user={announcement.author} size={40} />
                    <span className="font-medium">
                        {announcement.author.first_name} {announcement.author.last_name}
                    </span>
                </div>
            </Card>
            {ReactDOM.createPortal(
                <AnnouncementModal
                    show={showModal}
                    announcement={announcement}
                    close={() => setShowModal(false)}
                />,
                document.body,
            )}
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
                    <h4 className="text-ellipsis whitespace-nowrap text-xl font-bold">{event.name}</h4>
                    <h5 className="mb-5 text-ellipsis whitespace-nowrap text-lg font-medium text-slate-400">
                        Presented by {event.host}
                    </h5>
                    <div className="mb-3 flex items-center gap-3">
                        <LuCalendar size={23} />
                        <span className="font-medium">{format(new Date(event.start), 'MMM d, y')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <LuClock size={23} />
                        <span className="flex items-center gap-1.5 font-medium">
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
