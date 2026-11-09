import React, { type PropsWithChildren } from 'react';
import { TrainingSideNav } from '@/app/training/(dashboard)/TrainingSideNav';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { requireMember } from '@/lib/auth/guards';
import { getTrainingNotifications } from '@/lib/training/repository';

export const metadata = { title: 'Training Center' };

const TrainingCenterLayout: React.FC<PropsWithChildren> = async ({ children }) => {
    const session = await requireMember();
    const notifications = await getTrainingNotifications(session.user.cid);

    return (
        <Page {...metadata}>
            <PageContent>
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-10">
                    <TrainingSideNav notifications={notifications} />
                    <div className="md:grow md:overflow-x-auto md:px-1">
                        {children}
                    </div>
                </div>
            </PageContent>
        </Page>
    );
};

export default TrainingCenterLayout;
