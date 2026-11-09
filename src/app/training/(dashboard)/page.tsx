import { redirect } from 'next/navigation';
import { type NextPage } from 'next';
import { fetchApi } from '@/utils/fetch';
import { type TrainingSession } from '@/types/training';
import { auth } from '@/auth';
import { SessionsTable } from './SessionsTable';

async function getTrainingSessions(cid: number): Promise<TrainingSession[]> {
    return fetchApi(
        `/training/sessions/${cid}/`,
        { cache: 'no-store' },
    );
}

const Sessions: NextPage = async () => {
    const session = await auth();
    if (!session) {
        redirect('/');
    }

    const trainingSessions = await getTrainingSessions(session.user.cid);

    return <SessionsTable data={trainingSessions} />;
};

export default Sessions;
