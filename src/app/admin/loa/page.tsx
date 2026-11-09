import type { NextPage } from 'next';
import { requireAdmin } from '@/lib/auth/guards';
import { getAdminLoas } from '@/lib/loa/repository';
import { LoaTable } from './LoaTable';

const ApprovedLoas: NextPage = async () => {
    await requireAdmin();
    const loas = await getAdminLoas();

    const approved = loas.filter((loa) => loa.approved);

    return <LoaTable data={approved} />;
};

export default ApprovedLoas;
