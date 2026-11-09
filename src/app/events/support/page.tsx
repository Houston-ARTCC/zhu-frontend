import { type NextPage } from 'next';
import { SupportForm } from '@/app/events/support/SupportForm';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { requireMember } from '@/lib/auth/guards';

export const metadata = { title: 'Request Support' };

const RequestSupport: NextPage = async () => {
    await requireMember();

    return (
        <Page {...metadata}>
            <PageContent>
                <SupportForm />
            </PageContent>
        </Page>
    );
};

export default RequestSupport;
