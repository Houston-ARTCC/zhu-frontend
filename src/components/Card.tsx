'use client';

import React, { MouseEventHandler, PropsWithChildren } from 'react';
import classNames from 'classnames';
import { format } from 'date-fns-tz';
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi2';
import Image from 'next/image';
import { LuArrowRight } from 'react-icons/lu';
import { Badge } from '@/components/Badge';
import { type Event } from '@/types/events';
import { type Announcement } from '@/types/announcements';

interface CardProps extends PropsWithChildren {
    className?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export const Card: React.FC<CardProps> = ({ className, onClick, children }) => (
    <div
        onClick={onClick}
        className={classNames(
            'rounded-md bg-white px-5 py-4 shadow transition-all duration-500 ease-out',
            {
                'cursor-pointer hover:-translate-y-2 hover:opacity-75 hover:shadow-lg': onClick,
            },
            className,
        )}
    >
        {children}
    </div>
);

interface AnnouncementCardProps {
    announcement: Announcement;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => (
    <Card onClick={() => console.log(announcement.body)}>
        <div className="mb-3 flex w-full gap-5">
            <h4 className="w-full shrink overflow-hidden text-ellipsis whitespace-nowrap text-xl font-bold">
                {announcement.title}
            </h4>
            <Badge className="ml-auto">{format(new Date(announcement.posted), 'MMM d, y')}</Badge>
        </div>
        <div className="flex items-center gap-2">
            <Image
                className="rounded-full bg-slate-300"
                src={`https://api.zhuartcc.org${announcement.author.profile}`}
                alt={`${announcement.author.first_name} ${announcement.author.last_name}`}
                height={32}
                width={32}
            />
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
    <Card>
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
