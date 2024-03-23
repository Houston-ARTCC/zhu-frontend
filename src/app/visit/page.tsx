import React from 'react';
import { type NextPage } from 'next';
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
                        <VisitCriterion status={eligibility.has_home_facility} />
                        You have a home facility
                    </li>
                    <li className="flex items-center gap-2">
                        <VisitCriterion status={eligibility.rce_completed} />
                        You have completed the appropriate rating competency exam
                    </li>
                    <li className="flex items-center gap-2">
                        <VisitCriterion status={eligibility.has_s3_rating} />
                        You have earned at least an S3 rating
                    </li>
                    <li className="flex items-center gap-2">
                        <VisitCriterion status={eligibility.time_since_visit} />
                        It has been at least 60 days since you joined a visiting roster
                    </li>
                    <li className="flex items-center gap-2">
                        <VisitCriterion status={eligibility.time_since_promo} />
                        It has been at least 90 days since promotion to S1, S2, S3, or C1
                    </li>
                    <li className="flex items-center gap-2">
                        <VisitCriterion status={eligibility.controlling_time} />
                        You have controlled 50 hours since promotion to S1, S2, S3, or C1
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
                {eligibility.is_eligible && <VisitForm />}
            </PageContent>
        </Page>
    );
};

export default Visit;
