import { type NextPage } from 'next';
import { EventScoreInfo } from '@/components/EventScoreInfo';
import { fetchApi } from '@/utils/fetch';
import { type EventScore } from '@/types/events';

async function getEventScores(cid: string): Promise<EventScore[]> {
    return fetchApi(
        `/events/scores/${cid}/`,
        { cache: 'no-store' },
    );
}

interface EventScoresParams {
    params: {
        cid: string;
    };
}

const EventScores: NextPage<EventScoresParams> = async ({ params }) => {
    const scores = await getEventScores(params.cid);

    return <EventScoreInfo scores={scores} />;
};

export default EventScores;
