import React from 'react';
import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { Heatmap } from '@/components/Heatmap';
import { getDailyStatistics, getStatistics } from '@/lib/connections/repository';
import { StatisticsTable } from './StatisticsTable';

export const metadata = { title: 'Controller Statistics' };

const StatisticsPage: NextPage = async () => {
    const [aggregateStatistics, statistics] = await Promise.all([
        getDailyStatistics(new Date().getFullYear()),
        getStatistics(),
    ]);

    return (
        <Page {...metadata}>
            <PageContent>
                <div className="mb-12 hidden md:block">
                    <Heatmap data={aggregateStatistics} />
                </div>
                <StatisticsTable data={statistics} />
            </PageContent>
        </Page>
    );
};

export default StatisticsPage;
