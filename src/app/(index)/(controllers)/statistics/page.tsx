import React from 'react';
import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { fetchApi } from '@/utils/fetch';
import { type DailyStatistic, type Statistics } from '@/types/connections';
import { StatisticsTable } from './StatisticsTable';
import { Heatmap } from './Heatmap';

export const metadata = { title: 'Controller Statistics' };

async function getAggregateStatistics(): Promise<DailyStatistic[]> {
    return fetchApi(
        `/connections/daily/${new Date().getFullYear()}/`,
        { next: { revalidate: 3600 } },
    );
}

async function getStatistics(): Promise<Statistics> {
    return fetchApi(
        '/connections/statistics/',
        { next: { revalidate: 3600 } },
    );
}

const Statistics: NextPage = async () => {
    const aggregateStatistics = await getAggregateStatistics();
    const statistics = await getStatistics();

    return (
        <Page {...metadata}>
            <PageContent>
                <Heatmap data={aggregateStatistics} />
                <StatisticsTable data={statistics} />
            </PageContent>
        </Page>
    );
};

export default Statistics;
