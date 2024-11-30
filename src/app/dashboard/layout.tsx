import React, { type PropsWithChildren } from 'react';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { SideNav } from '@/components/SideNav';

export const metadata = { title: 'Dashboard' };

const DashboardLayout: React.FC<PropsWithChildren> = async ({ children }) => (
    <Page {...metadata}>
        <PageContent>
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-10">
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
                                { title: 'Quarterly Status', route: 'status' },
                                { title: 'Leave of Absence', route: 'loa' },
                            ],
                        },
                    ]}
                />
                <div className="md:grow md:overflow-x-auto md:px-1">
                    {children}
                </div>
            </div>
        </PageContent>
    </Page>
);

export default DashboardLayout;
