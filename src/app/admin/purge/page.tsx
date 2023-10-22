import React from 'react';
import { type NextPage } from 'next';
import { PurgeTable } from '@/app/admin/purge/PurgeTable';
import { fetchApi } from '@/utils/fetch';
import { type Statistics } from '@/types/connections';

async function getStatistics(): Promise<Statistics> {
    return fetchApi(
        '/connections/statistics/',
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
