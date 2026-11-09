import React from 'react';
import type { NextPage } from 'next';
import { requireMember } from '@/lib/auth/guards';
import { getUserQuarterlyStatus } from '@/lib/connections/repository';
import { Status } from './Status';

const QuarterlyStatus: NextPage = async () => {
    const session = await requireMember();
    const status = await getUserQuarterlyStatus(session.user.cid);

    return <Status initialData={status} />;
};

export default QuarterlyStatus;
