import React, { type PropsWithChildren } from 'react';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { SideNav } from '@/components/SideNav';
import { fetchApi } from '@/utils/fetch';
import { type TrainingNotifications } from '@/types/training';

export const metadata = { title: 'Training Center' };

async function getTrainingNotifications(): Promise<TrainingNotifications> {
    return fetchApi(
        '/training/notifications/',
        { cache: 'no-store' },
    );
}

const TrainingCenterLayout: React.FC<PropsWithChildren> = async ({ children }) => {
    const notifications = await getTrainingNotifications();

    return (
        <Page {...metadata}>
            <PageContent>
                <div className="flex gap-10">
                    <SideNav
                        rootPath="training"
                        sections={[
                            {
                                title: 'Student Resources',
                                members: [
                                    { title: 'Sessions', route: '' },
                                    { title: 'Request Training', route: 'request' },
                                ],
                            },
                            {
                                title: 'Mentor Resources',
                                members: [
                                    { title: 'My Availability', route: 'availability' },
                                    {
                                        title: 'Scheduled Sessions',
                                        route: 'scheduled',
                                        alerts: notifications.scheduled_sessions,
                                    },
                                    {
                                        title: 'Training Requests',
                                        route: 'requests',
                                        alerts: notifications.training_requests,
                                    },
                                    { title: 'Student Profile', route: 'profile' },
                                    { title: 'Mentor Profile', route: 'mentor' },
                                ],
                            },
                        ]}
                    />
                    <div className="grow overflow-x-auto px-1">
                        {children}
                    </div>
                </div>
            </PageContent>
        </Page>
    );
};

export default TrainingCenterLayout;
