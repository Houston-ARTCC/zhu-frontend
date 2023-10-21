import React from 'react';
import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { EventScoreInfo } from '@/components/EventScoreInfo';
import { fetchApi } from '@/utils/fetch';
import { type EventScore } from '@/types/events';

export const metadata = { title: 'Event Scores' };

async function getEventScores(): Promise<EventScore[]> {
    return fetchApi(
        '/events/scores/',
        { cache: 'no-store' },
    );
}

const EventScores: NextPage = async () => {
    const scores = await getEventScores();

    return (
        <Page {...metadata}>
            <PageContent>
                <p className="mb-3">
                    Your event score is a metric used by events to determine which event shifts are assigned to which controllers.
                    Controllers with higher scores are generally considered to be more reliable, and we encourage you to follow the
                    following tips to ensure your score is as high as it can be.
                </p>
                <p className="mb-3">There are two main factors that are considered when calculating individual event scores:</p>
                <ol className="mb-5">
                    <li>
                        <b>Controlling time: </b>
                        Controlling for the entire duration of your assigned shift(s) is the baseline for a perfect score.
                        Extra credit will be awarded for up to an hour of additional controlling time before and after the event.
                        If you are not able to control for the entire duration of a shift, please let the events staff know in advance to avoid
                        scheduling issues during the event and to avoid a negative impact on your score.
                    </li>
                    <li>
                        <b>Feedback: </b>
                        If a pilot submits feedback for you and specifies the event on the form, your score will be updated to reflect it.
                        <ul>
                            <li>
                                Receiving positive feedback of <b>four or five stars</b> will award an
                                additional 5% and 10% to your score, respectively.
                            </li>
                            <li>
                                Conversely, receiving negative feedback of <b>one or two stars</b> will
                                deduct 5% and 10% points from your score, respectively.
                            </li>
                            <li>Receiving neutral feedback of <b>three stars</b> will have no impact on your score.</li>
                        </ul>
                    </li>
                </ol>
                <EventScoreInfo scores={scores} />
            </PageContent>
        </Page>
    );
};

export default EventScores;
