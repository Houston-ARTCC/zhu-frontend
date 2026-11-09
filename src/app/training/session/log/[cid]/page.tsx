import React from 'react';
import { notFound } from 'next/navigation';
import { type NextPage } from 'next';
import { LuCircleAlert } from 'react-icons/lu';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { Alert, AlertTitle } from '@/components/Alert';
import { userToOption } from '@/utils';
import { requireTrainingStaff } from '@/lib/auth/guards';
import { getAuthenticatedUserById, getTrainingStaff } from '@/lib/users/repository';
import { SessionForm } from '../../[id]/SessionForm';

export const metadata = { title: 'Training Center' };

interface LogSessionParams {
    params: Promise<{
        cid: string;
    }>;
}

const LogSession: NextPage<LogSessionParams> = async (props) => {
    const session = await requireTrainingStaff();
    const params = await props.params;
    const student = await getAuthenticatedUserById(Number(params.cid));
    if (!student) {
        notFound();
    }
    const staff = await getTrainingStaff();

    const options = [
        {
            label: 'Instructors',
            options: staff.ins.map(userToOption),
        },
        {
            label: 'Mentors',
            options: staff.mtr.map(userToOption),
        },
    ];

    return (
        <Page {...metadata}>
            <PageContent>
                <Alert color="amber-500" icon={LuCircleAlert} className="mb-16">
                    <AlertTitle>Read before submitting!</AlertTitle>
                    <p>
                        Use this form for a session that already happened without a training request. Submitting it will automatically
                        submit the session to the VATUSA Centralized Training Record System, so there is no need to create it on the VATUSA website.
                    </p>
                </Alert>
                <SessionForm
                    student={student}
                    instructor={session.user}
                    instructorOptions={options}
                />
            </PageContent>
        </Page>
    );
};

export default LogSession;
