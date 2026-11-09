import { type NextPage } from 'next';
import { requireTrainingStaff } from '@/lib/auth/guards';
import { getPendingRequests } from '@/lib/training/repository';
import { TrainingRequestsView } from './TrainingRequestsView';

const TrainingRequests: NextPage = async () => {
    await requireTrainingStaff();
    const trainingRequests = await getPendingRequests();

    return <TrainingRequestsView data={trainingRequests} />;
};

export default TrainingRequests;
