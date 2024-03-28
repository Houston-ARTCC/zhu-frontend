import React from 'react';
import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { fetchApi } from '@/utils/fetch';
import { type DailyStatistic, type Statistics } from '@/types/connections';
import { Heatmap } from '../../components/Heatmap';
import { StatisticsTable } from './StatisticsTable';

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

const StatisticsPage: NextPage = async () => {
    const aggregateStatistics = await getAggregateStatistics();
    const statistics = await getStatistics();

    return (
        <Page {...metadata}>
            <PageContent>
                <div className="mb-12">
                    <Heatmap data={aggregateStatistics} />
                </div>
                <StatisticsTable data={statistics} />
            </PageContent>
        </Page>
    );
};

export default StatisticsPage;
