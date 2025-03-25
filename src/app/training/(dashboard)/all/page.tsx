import { type NextPage } from 'next';
import { fetchApi } from '@/utils/fetch';
import { type TrainingSession } from '@/types/training';
import { SessionsTable } from '../SessionsTable';

async function getTrainingSessions(): Promise<TrainingSession[]> {
    return fetchApi(
        '/training/sessions/all/',
        { cache: 'no-store' },
    );
}

const AllSessions: NextPage = async () => {
    const trainingSessions = await getTrainingSessions();

    return <SessionsTable data={trainingSessions} />;
};

export default AllSessions;
