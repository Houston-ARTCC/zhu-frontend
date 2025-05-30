import { type NextPage } from 'next';
import { fetchApi } from '@/utils/fetch';
import { type TrainingSession } from '@/types/training';
import { SessionsTable } from '../../SessionsTable';

async function getTrainingSessions(cid: string): Promise<TrainingSession[]> {
    return fetchApi(
        `/training/sessions/${cid}/`,
        { cache: 'no-store' },
    );
}

interface StudentProfileParams {
    params: Promise<{
        cid: string;
    }>;
}

const StudentProfile: NextPage<StudentProfileParams> = async (props) => {
    const params = await props.params;
    const trainingSessions = await getTrainingSessions(params.cid);

    return <SessionsTable data={trainingSessions} />;
};

export default StudentProfile;
