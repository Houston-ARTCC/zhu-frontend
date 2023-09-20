import { type NextPage } from 'next';
import { fetchApi } from '@/utils/fetch';
import { type UserTrainingRequests } from '@/types/training';
import { TrainingRequestsTable } from './TrainingRequestsTable';

async function getTrainingRequests(): Promise<UserTrainingRequests[]> {
    return fetchApi(
        '/training/request/pending/',
        { cache: 'no-store' },
    );
}

const TrainingRequests: NextPage = async () => {
    const trainingRequests = await getTrainingRequests();

    return <TrainingRequestsTable data={trainingRequests} />;
};

export default TrainingRequests;
