import React from 'react';
import { notFound } from 'next/navigation';
import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { fetchApi } from '@/utils/fetch';
import { type Event } from '@/types/events';
import { EditEventForm } from './EditEventForm';
import { EditEventPositions } from './EditEventPositions';

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

const EditEvent: NextPage<EventParams> = async ({ params }) => {
    const event = await getEvent(params.id).catch(notFound);

    return (
        <Page title={event.name}>
            <PageContent>
                <EditEventForm event={event} />
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                    <EditEventPositions eventId={event.id} label="Enroute" positions={event.positions.enroute} />
                    <EditEventPositions eventId={event.id} label="TRACON" positions={event.positions.tracon} />
                    <EditEventPositions eventId={event.id} label="Local" positions={event.positions.local} />
                </div>
            </PageContent>
        </Page>
    );
};

export default EditEvent;
