import React, { type PropsWithChildren } from 'react';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { SideNav } from '@/components/SideNav';

export const metadata = { title: 'Training Center' };

const TrainingCenterLayout: React.FC<PropsWithChildren> = ({ children }) => (
    <Page {...metadata}>
        <PageContent>
            <div className="flex gap-10">
                <SideNav
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
                                { title: 'Scheduled Sessions', route: 'scheduled' },
                                { title: 'Training Requests', route: 'requests' },
                                { title: 'Student Profile', route: 'profile' },
                                { title: 'Mentor Profile', route: 'mentor' },
                            ],
                        },
                    ]}
                />
                <div className="grow">
                    {children}
                </div>
            </div>
        </PageContent>
    </Page>
);

export default TrainingCenterLayout;
