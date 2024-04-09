import React from 'react';
import type { NextPage } from 'next';
import { fetchApi } from '@/utils/fetch';
import type { UserStatusStatistics } from '@/types/connections';
import { Status } from './Status';

async function getQuarterlyStatus(): Promise<UserStatusStatistics> {
    return fetchApi(
        '/connections/statistics/status/',
        { cache: 'no-store' },
    );
}

const QuarterlyStatus: NextPage = async () => {
    const status = await getQuarterlyStatus();

    return <Status initialData={status} />;
};

export default QuarterlyStatus;
