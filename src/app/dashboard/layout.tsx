import React, { type PropsWithChildren } from 'react';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { SideNav } from '@/components/SideNav';

export const metadata = { title: 'Dashboard' };

const DashboardLayout: React.FC<PropsWithChildren> = async ({ children }) => (
    <Page {...metadata}>
        <PageContent>
            <div className="flex items-start gap-10">
                <SideNav
                    rootPath="/dashboard"
                    sections={[
                        {
                            title: 'Settings',
                            children: [
                                { title: 'Profile', route: 'profile' },
                            ],
                        },
                        {
                            title: 'Membership',
                            children: [
                                { title: 'Leave of Absence', route: 'loa' },
                                { title: 'Quarterly Status', route: 'status' },
                            ],
                        },
                    ]}
                />
                <div className="grow px-1">
                    {children}
                </div>
            </div>
        </PageContent>
    </Page>
);

export default DashboardLayout;
