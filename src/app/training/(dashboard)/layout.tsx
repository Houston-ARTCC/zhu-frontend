import React, { type PropsWithChildren } from 'react';
import { TrainingSideNav } from '@/app/training/(dashboard)/TrainingSideNav';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { fetchApi } from '@/utils/fetch';
import type { TrainingNotifications } from '@/types/training';

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
                <div className="flex items-start gap-10">
                    <TrainingSideNav notifications={notifications} />
                    <div className="grow px-1">
                        {children}
                    </div>
                </div>
            </PageContent>
        </Page>
    );
};

export default TrainingCenterLayout;
