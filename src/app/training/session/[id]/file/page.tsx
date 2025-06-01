import React from 'react';
import { type NextPage } from 'next';
import { LuCircleAlert } from 'react-icons/lu';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { Alert, AlertTitle } from '@/components/Alert';
import { fetchApi } from '@/utils/fetch';
import { type TrainingSession } from '@/types/training';
import { type Staff } from '@/types/users';
import { userToOption } from '@/utils';
import { SessionForm } from '../SessionForm';

export const metadata = { title: 'Training Center' };

async function getTrainingSession(id: string): Promise<TrainingSession> {
    return fetchApi(
        `/training/session/${id}/`,
        { cache: 'no-store' },
    );
}

async function getStaff(): Promise<Staff> {
    return fetchApi(
        '/users/staff/',
        { cache: 'no-store' },
    );
}

interface FileSessionParams {
    params: Promise<{
        id: string;
    }>;
}

const FileSession: NextPage<FileSessionParams> = async (props) => {
    const params = await props.params;
    const trainingSession = await getTrainingSession(params.id);
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
                    instructorOptions={options}
                />
            </PageContent>
        </Page>
    );
};

export default FileSession;
