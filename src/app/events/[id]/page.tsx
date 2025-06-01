import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDistance } from 'date-fns';
import { format, formatInTimeZone } from 'date-fns-tz';
import { type Metadata, type NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { LuEyeOff, LuFolderClosed, LuPencil } from 'react-icons/lu';
import { Button } from '@/components/Button';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { Alert, AlertTitle } from '@/components/Alert';
import { authOptions } from '@/utils/auth';
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
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata(props: EventParams): Promise<Metadata> {
    const params = await props.params;
    const event = await getEvent(params.id).catch(notFound);

    const start = formatInTimeZone(new Date(event.start), 'Etc/UTC', 'MMM dd, yyyy, HH:mm zzz');
    const end = formatInTimeZone(new Date(event.end), 'Etc/UTC', 'MMM dd, yyyy, HH:mm zzz');
    const description = `
        Lasts from ${start} to ${end}.
        ${event.description}
    `;

    return {
        title: event.name,
        description,
        openGraph: {
            title: event.name,
            description,
            images: [event.banner],
        },
    };
}

const ViewEvent: NextPage<EventParams> = async (props) => {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    const event = await getEvent(params.id).catch(notFound);

    return (
        <Page title={event.name}>
            <PageContent>
                {event.hidden && (
                    <Alert color="red-500" icon={LuEyeOff} className="mb-5">
                        <AlertTitle>Event Hidden</AlertTitle>
                        <p>This event is currently hidden from controllers. Edit the event to make it visible.</p>
                    </Alert>
                )}
                {event.archived && (
                    <Alert color="indigo-500" icon={LuFolderClosed} className="mb-5">
                        <AlertTitle>Event Archived</AlertTitle>
                        <p>This event has passed and is now archived.</p>
                    </Alert>
                )}
                <div className="mb-10 grid grid-cols-1 items-center gap-5 md:grid-cols-2">
                    <div className="order-last text-center md:order-first">
                        <div className="mb-5 flex flex-col items-center justify-around lg:flex-row">
                            <div>
                                <h4 className="text-xl font-bold">Start</h4>
                                <h5 className="text-lg">{format(new Date(event.start), 'MMM dd, yyyy, HH:mm zzz')}</h5>
                                <h4 className="text-xl font-bold">End</h4>
                                <h5 className="text-lg">{format(new Date(event.end), 'MMM dd, yyyy, HH:mm zzz')}</h5>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold">Time Until Event</h4>
                                <h5 className="text-lg">
                                    {formatTimeUntilEvent(new Date(event.start), new Date(event.end))}
                                </h5>
                            </div>
                        </div>
                        <p className="whitespace-pre-line">
                            {event.description}
                        </p>
                        {session?.user.permissions.is_staff && (
                            <div className="mt-5 flex justify-center">
                                <Link href={`/events/${event.id}/edit`}>
                                    <Button>
                                        <LuPencil />
                                        Edit Event
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    {event.banner && (
                        <img src={event.banner} alt={event.name} />
                    )}
                </div>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <EventPositions
                        label="Enroute"
                        positions={event.positions.enroute}
                        preventSignup={event.archived}
                    />
                    <EventPositions
                        label="TRACON"
                        positions={event.positions.tracon}
                        preventSignup={event.archived}
                    />
                    <EventPositions
                        label="Local"
                        positions={event.positions.local}
                        preventSignup={event.archived}
                    />
                </div>
            </PageContent>
        </Page>
    );
};

export default ViewEvent;
