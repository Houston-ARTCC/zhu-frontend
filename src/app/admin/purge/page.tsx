import React from 'react';
import { type NextPage } from 'next';
import { PurgeTable } from '@/app/admin/purge/PurgeTable';
import { getAdminStatistics } from '@/lib/connections/repository';

const RosterPurge: NextPage = async () => {
    const statistics = await getAdminStatistics();

    return (
        <PurgeTable initialData={statistics} />
    );
};

export default RosterPurge;
