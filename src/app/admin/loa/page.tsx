import type { NextPage } from 'next';
import { fetchApi } from '@/utils/fetch';
import type { LeaveOfAbsence } from '@/types/loa';
import { LoaTable } from './LoaTable';

async function getApprovedLoas(): Promise<LeaveOfAbsence[]> {
    return fetchApi(
        '/loa/admin/',
        { cache: 'no-store' },
    );
}

const ApprovedLoas: NextPage = async () => {
    const loas = await getApprovedLoas();

    const approved = loas.filter((loa) => loa.approved);

    return <LoaTable data={approved} />;
};

export default ApprovedLoas;
