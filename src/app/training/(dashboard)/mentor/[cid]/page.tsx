import { type NextPage } from 'next';
import { requireTrainingStaff } from '@/lib/auth/guards';
import { getSessionsByInstructor } from '@/lib/training/repository';
import { SessionsTable } from '../../SessionsTable';

interface MentorProfileParams {
    params: Promise<{
        cid: string;
    }>;
}

const MentorProfile: NextPage<MentorProfileParams> = async (props) => {
    await requireTrainingStaff();
    const params = await props.params;
    const trainingSessions = await getSessionsByInstructor(Number(params.cid));

    return <SessionsTable data={trainingSessions} />;
};

export default MentorProfile;
