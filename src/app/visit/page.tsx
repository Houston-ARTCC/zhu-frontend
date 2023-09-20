import React from 'react';
import { type NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PageContent } from '@/components/PageContent';
import { Page } from '@/components/Page';
import { fetchApi } from '@/utils/fetch';
import { type VisitEligibility } from '@/types/visit';
import { VisitCriterion } from './VisitCriterion';
import { VisitForm } from './VisitForm';

export const metadata = { title: 'Visit Houston' };

async function getVisitEligibility(): Promise<VisitEligibility> {
    return fetchApi(
        '/visit/eligible/',
        { cache: 'no-store' },
    );
}

const Visit: NextPage = async () => {
    const session = await getServerSession(authOptions);
    const eligibility = await getVisitEligibility();

    return (
        <Page {...metadata}>
            <PageContent>
                <p className="mb-3">
                    Hello and thank you for your interest in becoming a visiting controller at the virtual Houston ARTCC!
                    Onced trained, visiting controllers are able to control the same positions and fields as home controllers.
                    If you would like to leave your current facility and join Houston as a home controller, you must instead
                    {' '}
                    <a href="https://www.vatusa.net/my/profile">submit a transfer request through VATUSA</a>.
                </p>
                <p className="mb-8">
                    As per the VATSIM Transfer and Visiting Controller Policy, we are not able to provide rating training to
                    visiting controllers. You must contact your home facility's training department for rating training. The
                    Houston ARTCC training department will only provide local procedure training and major endorsement checkouts.
                </p>
                <h3 className="mb-3 text-2xl font-medium">Visiting Checklist</h3>
                <ul className="mb-8 ml-0 list-none">
                    <li className="flex items-center gap-2">
                        <VisitCriterion status={eligibility.rating_check} />
                        You hold an S2 controller rating or greater
                    </li>
                    <li className="flex items-center gap-2">
                        <VisitCriterion status={eligibility.rating_time_check} />
                        You have held your current rating for at least 90 days
                    </li>
                    <li className="flex items-center gap-2">
                        <VisitCriterion status={eligibility.rating_hours_check} />
                        You have at least 50 hours of controlling time at your current rating
                    </li>
                    <li className="flex items-center gap-2">
                        <VisitCriterion status={eligibility.membership_check} />
                        You are not already an active controller at Houston
                    </li>
                    <li className="flex items-center gap-2">
                        <VisitCriterion status={eligibility.pending_application_check} />
                        You do not have any pending visiting applications
                    </li>
                    <hr className="my-2 w-96 border-slate-200" />
                    <li className="flex items-center gap-2">
                        <VisitCriterion status={eligibility.is_eligible} />
                        You are eligible to apply as a visiting controller at Houston
                    </li>
                </ul>
                {eligibility.is_eligible && <VisitForm user={session.user} />}
            </PageContent>
        </Page>
    );
};

export default Visit;
