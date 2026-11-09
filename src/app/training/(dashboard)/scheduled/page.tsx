import { type NextPage } from 'next';
import { requireTrainingStaff } from '@/lib/auth/guards';
import { getAllScheduledSessions } from '@/lib/training/repository';
import { ScheduledSessionsTable } from './ScheduledSessionsTable';

const ScheduledSessions: NextPage = async () => {
    await requireTrainingStaff();
    const trainingSessions = await getAllScheduledSessions();

    return <ScheduledSessionsTable data={trainingSessions} />;
};

export default ScheduledSessions;
