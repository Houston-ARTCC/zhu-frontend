import { type NextPage } from 'next';
import { SupportForm } from '@/app/events/support/SupportForm';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';

export const metadata = { title: 'Request Support' };

const RequestSupport: NextPage = async () => (
    <Page {...metadata}>
        <PageContent>
            <SupportForm />
        </PageContent>
    </Page>
);

export default RequestSupport;
