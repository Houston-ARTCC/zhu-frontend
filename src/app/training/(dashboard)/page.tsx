import { type NextPage } from 'next';
import { type Session, getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
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
    const session = await getServerSession(authOptions) as Session;
    const trainingSessions = await getTrainingSessions(session.user.cid);

    return <SessionsTable data={trainingSessions} />;
};

export default Sessions;
