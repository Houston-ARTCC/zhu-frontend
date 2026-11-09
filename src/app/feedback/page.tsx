import React from 'react';
import { type NextPage } from 'next';
import { type SelectOption } from '@/components/Forms';
import { PageContent } from '@/components/PageContent';
import { Page } from '@/components/Page';
import { requireMember } from '@/lib/auth/guards';
import { getArchivedEvents } from '@/lib/events/repository';
import { getSimplifiedUsers } from '@/lib/users/repository';
import { FeedbackForm } from './FeedbackForm';

export const metadata = { title: 'Leave Feedback' };

const Feedback: NextPage = async () => {
    await requireMember();

    const [roster, events] = await Promise.all([
        getSimplifiedUsers(),
        getArchivedEvents(),
    ]);

    const controllers = roster.home.concat(roster.visiting);

    const controllerOptions: SelectOption<number | null>[] = controllers.map(
        (controller) => ({
            label: `${controller.first_name} ${controller.last_name} — ${controller.cid}`,
            value: controller.cid,
        }),
    );

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
