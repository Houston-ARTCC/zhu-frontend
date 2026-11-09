import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { auth } from '@/auth';
import { getEvents } from '@/lib/events/repository';
import { EventCard } from './EventCard';

export const metadata = { title: 'Events' };

const Events: NextPage = async () => {
    const session = await auth();
    const events = await getEvents({ includeHidden: session?.user.permissions.is_staff ?? false });

    return (
        <Page {...metadata}>
            <PageContent>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </PageContent>
        </Page>
    );
};

export default Events;
