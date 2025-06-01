import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns-tz';
import { LuArrowRight, LuCalendar, LuClock, LuEyeOff, LuTowerControl } from 'react-icons/lu';
import { Card } from '@/components/Card';
import { type BasicEvent } from '@/types/events';

interface EventCardProps {
    event: BasicEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => (
    <Link className="text-inherit" href={`/events/${event.id}`} prefetch={false}>
        <Card className="p-0!" interactive>
            <div className="w-full shrink overflow-hidden p-5">
                <h4 className="flex items-center gap-3 text-ellipsis text-2xl font-bold">
                    {event.name}
                    {event.hidden && (
                        <LuEyeOff size={25} className="text-red-500" />
                    )}
                </h4>
                <h5 className="mb-5 text-ellipsis text-lg font-medium text-slate-400">
                    Presented by {event.host}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="mb-3 flex items-center gap-3">
                        <LuCalendar size={25} />
                        <span className="font-medium">
                            {format(new Date(event.start), 'MMM d, y')}
                        </span>
                    </div>
                    <div className="mb-3 flex items-center gap-3">
                        <LuTowerControl size={25} />
                        <span className="font-medium">
                            {event.available_shifts} Shift{event.available_shifts === 1 ? '' : 's'} Available
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <LuClock size={25} />
                        <span className="flex items-center gap-1.5 font-medium">
                            {format(new Date(event.start), 'HH:mm zzz')}
                            <LuArrowRight />
                            {format(new Date(event.end), 'HH:mm zzz')}
                        </span>
                    </div>
                </div>
            </div>
            <img className="rounded-b-md" src={event.banner} />
        </Card>
    </Link>
);
