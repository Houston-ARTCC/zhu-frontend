import React from 'react';
import { type NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { PageContent } from '@/components/PageContent';
import { Page } from '@/components/Page';
import { Card } from '@/components/Card';
import { authOptions } from '@/utils/auth';
import { fetchApi } from '@/utils/fetch';
import { Category, CATEGORY_STRING, type ResourceData } from '@/types/resources';
import { ResourceTable } from './ResourceTable';
import { NewResourceButton } from './ResourceModal';

const metadata = { title: 'Resources' };

async function getResources(): Promise<ResourceData> {
    return fetchApi(
        '/resources/',
        { cache: 'no-store' },
    );
}

const Resources: NextPage = async () => {
    const resources = await getResources();

    const session = await getServerSession(authOptions);

    return (
        <Page {...metadata}>
            <PageContent>
                {session?.user.permissions.is_staff && (
                    <NewResourceButton />
                )}
                {Object.values(Category).map((category) => (
                    <div key={category} className="mb-10">
                        <h2 className="text-4xl font-medium">{CATEGORY_STRING[category]}</h2>
                        <h3 className="mb-5 font-medium text-slate-400">
                            {resources[category]?.length}
                            {resources[category]?.length === 1 ? ' resource' : ' resources'}
                        </h3>
                        <Card>
                            <ResourceTable data={resources[category]} />
                        </Card>
                    </div>
                ))}
            </PageContent>
        </Page>
    );
};

export default Resources;
