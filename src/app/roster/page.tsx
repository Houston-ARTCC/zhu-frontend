import React from 'react';
import type { NextPage } from 'next';
import { RosterTable } from '@/app/roster/RosterTable';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { getRoster } from '@/lib/users/repository';

export const metadata = { title: 'Controller Roster' };

const RosterPage: NextPage = async () => {
    const roster = await getRoster();

    return (
        <Page {...metadata}>
            <PageContent>
                <RosterTable data={roster} />
            </PageContent>
        </Page>
    );
};

export default RosterPage;
