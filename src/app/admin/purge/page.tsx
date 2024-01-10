import React from 'react';
import { type NextPage } from 'next';
import { PurgeTable } from '@/app/admin/purge/PurgeTable';
import { fetchApi } from '@/utils/fetch';
import type { AdminStatistics } from '@/types/connections';

async function getStatistics(): Promise<AdminStatistics> {
    return fetchApi(
        '/connections/statistics/admin/',
        { next: { revalidate: 3600 } },
    );
}

const RosterPurge: NextPage = async () => {
    const statistics = await getStatistics();

    return (
        <PurgeTable data={statistics} />
    );
};

export default RosterPurge;
