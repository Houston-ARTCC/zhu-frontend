import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { fetchApi } from '@/utils/fetch';
import { type BasicEvent } from '@/types/events';
import { EventCard } from './EventCard';

export const metadata = { title: 'Events' };

async function getEvents(): Promise<BasicEvent[]> {
    return fetchApi(
        '/events/',
        { cache: 'no-store' },
    );
}

const Events: NextPage = async () => {
    const events = await getEvents();

    return (
        <Page {...metadata}>
            <PageContent>
                <div className="grid grid-cols-2 gap-5">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </PageContent>
        </Page>
    );
};

export default Events;
