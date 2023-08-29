import { type NextPage } from 'next';
import { fetchApi } from '@/utils/fetch';
import { type TrainingSession } from '@/types/training';
import { SessionsTable } from '../../SessionsTable';

async function getTrainingSessions(cid: string): Promise<TrainingSession[]> {
    return fetchApi(
        `/training/mentor/${cid}/`,
        { cache: 'no-store' },
    );
}

interface MentorProfileParams {
    params: {
        cid: string;
    };
}

const MentorProfile: NextPage<MentorProfileParams> = async ({ params }) => {
    const trainingSessions = await getTrainingSessions(params.cid);

    return <SessionsTable data={trainingSessions} />;
};

export default MentorProfile;
