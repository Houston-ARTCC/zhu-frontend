import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { type NextPage } from 'next';
import { LuCircleAlert } from 'react-icons/lu';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { Alert, AlertTitle } from '@/components/Alert';
import { fetchApi } from '@/utils/fetch';
import { type Staff, type User } from '@/types/users';
import { auth } from '@/auth';
import { userToOption } from '@/utils';
import { SessionForm } from '../../[id]/SessionForm';

export const metadata = { title: 'Training Center' };

async function getStudent(cid: string): Promise<User> {
    return fetchApi(
        `/users/${cid}/`,
        { cache: 'no-store' },
    );
}

async function getStaff(): Promise<Staff> {
    return fetchApi(
        '/users/staff/',
        { cache: 'no-store' },
    );
}

interface LogSessionParams {
    params: Promise<{
        cid: string;
    }>;
}

const LogSession: NextPage<LogSessionParams> = async (props) => {
    const session = await auth();
    if (!session) {
        redirect('/');
    }

    const params = await props.params;
    const student = await getStudent(params.cid).catch(notFound);
    const staff = await getStaff();

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
