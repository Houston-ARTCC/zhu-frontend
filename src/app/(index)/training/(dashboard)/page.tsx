import { type NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchApi } from '@/utils/fetch';
import { type TrainingSession } from '@/types/training';
import { SessionsTable } from './SessionsTable';

async function getTrainingSessions(cid: number): Promise<TrainingSession[]> {
    return fetchApi(
        `/training/sessions/${cid}/`,
        { cache: 'no-store' },
    );
}

const Sessions: NextPage = async () => {
    const session = await getServerSession(authOptions);
    const trainingSessions = await getTrainingSessions(session.user.cid);

    return <SessionsTable data={trainingSessions} />;
};

export default Sessions;
