'use client';

import React from 'react';
import { format } from 'date-fns-tz';
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi2';
import { LuArrowRight } from 'react-icons/lu';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { ProfilePicture } from '@/components/ProfilePicture';
import { type Announcement } from '@/types/announcements';
import { type Event } from '@/types/events';

interface AnnouncementCardProps {
    announcement: Announcement;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => (
    <Card interactive onClick={() => console.log(announcement.body)}>
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
);

interface EventCardProps {
    event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => (
    <Card interactive>
        <div className="mb-3 flex w-full gap-5">
            <div className="w-full shrink overflow-hidden">
                <h4 className="text-ellipsis whitespace-nowrap text-xl font-bold">{event.name}</h4>
                <h5 className="mb-5 text-ellipsis whitespace-nowrap text-lg font-medium text-slate-400">
                    Presented by {event.host}
                </h5>
                <div className="mb-3 flex items-center gap-3">
                    <HiOutlineCalendar size={25} />
                    <span className="font-medium">{format(new Date(event.start), 'MMM d, y')}</span>
                </div>
                <div className="flex items-center gap-3">
                    <HiOutlineClock size={25} />
                    <span className="flex items-center gap-1.5 font-medium">
                        {format(new Date(event.start), 'HH:mm zzz')}
                        <LuArrowRight />
                        {format(new Date(event.end), 'HH:mm zzz')}
                    </span>
                </div>
            </div>
            <img className="w-1/2" src={event.banner} />
        </div>
    </Card>
);
