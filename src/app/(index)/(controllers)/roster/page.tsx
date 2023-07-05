import React from 'react';
import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { fetchApi } from '@/utils/fetch';
import { type Roster } from '@/types/users';
import { RosterOptions } from './RosterOptions';

export const metadata = { title: 'Controller Roster' };

async function getRoster(): Promise<Roster> {
    return fetchApi(
        '/users/',
        { next: { revalidate: 3600 } },
    );
}

const RosterPage: NextPage = async () => {
    const roster = await getRoster();

    return (
        <Page {...metadata}>
            <PageContent>
                <RosterOptions data={roster} />
            </PageContent>
        </Page>
    );
};

export default RosterPage;
