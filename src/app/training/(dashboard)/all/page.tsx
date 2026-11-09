import { type NextPage } from 'next';
import { requireTrainingStaff } from '@/lib/auth/guards';
import { getAllSessionsLast30Days } from '@/lib/training/repository';
import { SessionsTable } from '../SessionsTable';

const AllSessions: NextPage = async () => {
    await requireTrainingStaff();
    const trainingSessions = await getAllSessionsLast30Days();

    return <SessionsTable data={trainingSessions} />;
};

export default AllSessions;
