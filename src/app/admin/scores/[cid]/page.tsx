import { type NextPage } from 'next';
import { EventScoreInfo } from '@/components/EventScoreInfo';
import { getEventScoresForUser } from '@/lib/events/repository';

interface EventScoresParams {
    params: Promise<{
        cid: string;
    }>;
}

const EventScores: NextPage<EventScoresParams> = async (props) => {
    const params = await props.params;
    const scores = await getEventScoresForUser(Number(params.cid));

    return <EventScoreInfo scores={scores} />;
};

export default EventScores;
