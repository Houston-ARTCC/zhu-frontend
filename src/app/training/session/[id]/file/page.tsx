import React from 'react';
import { notFound } from 'next/navigation';
import { type NextPage } from 'next';
import { LuCircleAlert } from 'react-icons/lu';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { Alert, AlertTitle } from '@/components/Alert';
import { userToOption } from '@/utils';
import { requireTrainingStaff } from '@/lib/auth/guards';
import { getSessionById } from '@/lib/training/repository';
import { getTrainingStaff } from '@/lib/users/repository';
import { SessionForm } from '../SessionForm';

export const metadata = { title: 'Training Center' };

interface FileSessionParams {
    params: Promise<{
        id: string;
    }>;
}

const FileSession: NextPage<FileSessionParams> = async (props) => {
    await requireTrainingStaff();
    const params = await props.params;
    const trainingSession = await getSessionById(Number(params.id));
    if (!trainingSession) {
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
                    <p className="mb-3">
                        Submitting this form will automatically submit this training session to the VATUSA Centralized Training Record System,
                        thus there is no need to create this session on the VATUSA website! That being said, do not submit this form if the
                        student failed to appear for the session or if the session was cancelled.
                    </p>
                    <p>
                        If this session is a rating examination, submit the rating examination form separately as a supplement to this note at
                        {' '}
                        <a href="https://www.vatusa.net/mgt/controller/1339822/promote" target="_blank" rel="noreferrer">
                            https://www.vatusa.net/mgt/controller/1339822/promote
                        </a>.
                    </p>
                </Alert>
                <SessionForm
                    session={trainingSession}
                    student={trainingSession.student}
                    instructor={trainingSession.instructor}
                    instructorOptions={options}
                />
            </PageContent>
        </Page>
    );
};

export default FileSession;
