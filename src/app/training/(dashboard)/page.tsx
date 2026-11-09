import { type NextPage } from 'next';
import { requireMember } from '@/lib/auth/guards';
import { getSessionsByStudent } from '@/lib/training/repository';
import { SessionsTable } from './SessionsTable';

const Sessions: NextPage = async () => {
    const session = await requireMember();
    const trainingSessions = await getSessionsByStudent(session.user.cid);

    return <SessionsTable data={trainingSessions} />;
};

export default Sessions;
