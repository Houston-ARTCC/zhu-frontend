import React from 'react';
import { notFound } from 'next/navigation';
import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { requireStaff } from '@/lib/auth/guards';
import { getEventById, getEventSignups } from '@/lib/events/repository';
import { AssignmentsProvider } from './AssignmentsContext';
import { EditEventForm } from './EditEventForm';
import { EditEventPositions } from './EditEventPositions';
import { EventSignups } from './EventSignups';

interface EventParams {
    params: Promise<{
        id: string;
    }>;
}

const EditEvent: NextPage<EventParams> = async (props) => {
    await requireStaff();

    const params = await props.params;
    const event = await getEventById(Number(params.id));
    if (!event) notFound();
    const signups = await getEventSignups(event.id);
    const { enroute, tracon, local } = event.positions;

    return (
        <Page title={event.name}>
            <PageContent>
                <EditEventForm event={event} />
                <AssignmentsProvider signups={signups} positions={[...enroute, ...tracon, ...local]}>
                    <EventSignups signups={signups} />
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                        <EditEventPositions eventId={event.id} label="Enroute" positions={enroute} />
                        <EditEventPositions eventId={event.id} label="TRACON" positions={tracon} />
                        <EditEventPositions eventId={event.id} label="Local" positions={local} />
                    </div>
                </AssignmentsProvider>
            </PageContent>
        </Page>
    );
};

export default EditEvent;
