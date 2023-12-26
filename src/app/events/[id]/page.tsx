import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { type NextPage } from 'next';
import { LuEdit2, LuEyeOff, LuFolderClosed } from 'react-icons/lu';
import { format } from 'date-fns-tz';
import { formatDistance } from 'date-fns';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { type Event } from '@/types/events';
import { EventPositions } from './EventPositions';

function formatTimeUntilEvent(start: Date, end: Date): string {
    const currentDate = new Date();

    if (currentDate > end) return 'Event has ended';
    if (currentDate > start) return 'Event has begun!';
    return formatDistance(currentDate, start);
}

async function getEvent(id: string): Promise<Event> {
    return fetchApi(
        `/events/${id}/`,
        { cache: 'no-store' },
    );
}

interface EventParams {
    params: {
        id: string;
    };
}

const ViewEvent: NextPage<EventParams> = async ({ params }) => {
    const session = await getServerSession(authOptions);

    const event = await getEvent(params.id).catch(notFound);

    return (
        <Page title={event.name}>
            <PageContent>
                {event.hidden && (
                    <div className="mb-5 rounded-md bg-red-500/10 py-5 pl-7 pr-10 text-red-500">
                        <div className="flex gap-3">
                            <div className="pt-1">
                                <LuEyeOff size={25} />
                            </div>
                            <div>
                                <h4 className="mb-0.5 text-2xl font-medium">Event Hidden</h4>
                                <p>This event is currently hidden from controllers. Edit the event to make it visible.</p>
                            </div>
                        </div>
                    </div>
                )}
                {event.archived && (
                    <div className="mb-5 rounded-md bg-indigo-500/10 py-5 pl-7 pr-10 text-indigo-500">
                        <div className="flex gap-3">
                            <div className="pt-1">
                                <LuFolderClosed size={25} />
                            </div>
                            <div>
                                <h4 className="mb-0.5 text-2xl font-medium">Event Archived</h4>
                                <p>This event has passed and is now archived.</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mb-10 grid grid-cols-2 items-center gap-5">
                    <div className="text-center">
                        <div className="mb-5 flex items-center justify-around">
                            <div>
                                <h4 className="text-xl font-bold">Start</h4>
                                <h5 className="text-lg">{format(new Date(event.start), 'MMM dd, yyyy, HH:mm zzz')}</h5>
                                <h4 className="text-xl font-bold">End</h4>
                                <h5 className="text-lg">{format(new Date(event.end), 'MMM dd, yyyy, HH:mm zzz')}</h5>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold">Time Until Event</h4>
                                <h5 className="text-lg">{formatTimeUntilEvent(new Date(event.start), new Date(event.end))}</h5>
                            </div>
                        </div>
                        <p>{event.description}</p>
                        {session?.user.is_staff && (
                            <div className="mt-5 flex justify-center">
                                <Link href={`/events/${event.id}/edit`}>
                                    <Button>
                                        <LuEdit2 />
                                        Edit Event
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    <img src={event.banner} alt={event.name} />
                </div>
                <div className="grid grid-cols-3 gap-5">
                    <EventPositions label="Enroute" positions={event.positions.enroute} />
                    <EventPositions label="TRACON" positions={event.positions.tracon} />
                    <EventPositions label="Local" positions={event.positions.local} />
                </div>
            </PageContent>
        </Page>
    );
};

export default ViewEvent;