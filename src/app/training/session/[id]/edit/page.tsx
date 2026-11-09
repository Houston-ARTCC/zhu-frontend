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
                    <p>
                        Submitting this form will automatically edit this training session on the VATUSA Centralized Training Record System,
                        thus there is no need to edit this session on the VATUSA website!.
                    </p>
                </Alert>
                <SessionForm
                    editing
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
