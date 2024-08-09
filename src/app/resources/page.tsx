import React from 'react';
import { type NextPage } from 'next';
import { getServerSession } from 'next-auth';
import slugify from 'slugify';
import classNames from 'classnames';
import { PageContent } from '@/components/PageContent';
import { Page } from '@/components/Page';
import { Card } from '@/components/Card';
import { authOptions } from '@/utils/auth';
import { fetchApi } from '@/utils/fetch';
import { CATEGORY_STRING, type ResourceData } from '@/types/resources';
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
                {Object.entries(CATEGORY_STRING).map(([category, title]) => (
                    <div key={category} className="mb-10">
                        <a className="text-inherit" href={`#${slugify(title, { lower: true })}`}>
                            <h2
                                className={classNames(
                                    'after:text-md relative text-4xl font-medium duration-150',
                                    "after:pl-3 after:text-3xl after:text-gray-400 after:content-['#']",
                                    'after:opacity-0 hover:after:opacity-100 target:after:opacity-100',
                                )}
                                id={slugify(title, { lower: true })}
                            >
                                {title}
                            </h2>
                        </a>
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
