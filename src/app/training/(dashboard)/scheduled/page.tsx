import { type NextPage } from 'next';
import { fetchApi } from '@/utils/fetch';
import { type TrainingSession } from '@/types/training';
import { ScheduledSessionsTable } from './ScheduledSessionsTable';

async function getScheduledSessions(): Promise<TrainingSession[]> {
    return fetchApi(
        '/training/',
        { cache: 'no-store' },
    );
}

const ScheduledSessions: NextPage = async () => {
    const trainingSessions = await getScheduledSessions();

    return <ScheduledSessionsTable data={trainingSessions} />;
};

export default ScheduledSessions;
