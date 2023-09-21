import React from 'react';
import { type NextPage } from 'next';
import { PageContent } from '@/components/PageContent';
import { Page } from '@/components/Page';
import { fetchApi } from '@/utils/fetch';
import { type BasicUser, type Roster } from '@/types/users';
import { type Event } from '@/types/events';
import { FeedbackForm } from './FeedbackForm';

export const metadata = { title: 'Leave Feedback' };

async function getControllers(): Promise<BasicUser[]> {
    const roster = await fetchApi<Roster<BasicUser>>(
        '/users/simplified/',
        { cache: 'no-store' },
    );

    return roster.home.concat(roster.visiting).concat(roster.mavp);
}

async function getEvents(): Promise<Event[]> {
    return fetchApi(
        '/events/archived/',
        { cache: 'no-store' },
    );
}

const Feedback: NextPage = async () => {
    const controllers = await getControllers();
    const events = await getEvents();

    const controllerOptions: { label: string, value: number | undefined }[] = controllers.map(
        (controller) => ({
            label: `${controller.first_name} ${controller.last_name} — ${controller.cid}`,
            value: controller.cid,
        }),
    );
    controllerOptions.unshift({ label: 'General ARTCC Feedback', value: undefined });

    const eventOptions = events
        .slice(0, 5)
        .map((event) => ({ label: event.name, value: event.id }));

    return (
        <Page {...metadata}>
            <PageContent>
                <FeedbackForm
                    controllerOptions={controllerOptions}
                    eventOptions={eventOptions}
                />
            </PageContent>
        </Page>
    );
};

export default Feedback;
