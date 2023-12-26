import React, { type PropsWithChildren } from 'react';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { SideNav } from '@/components/SideNav';
import { fetchApi } from '@/utils/fetch';
import { type AdminNotifications } from '@/types/admin';

export const metadata = { title: 'Administration' };

async function getAdminNotifications(): Promise<AdminNotifications> {
    return fetchApi(
        '/administration/notifications/',
        { cache: 'no-store' },
    );
}

const AdminLayout: React.FC<PropsWithChildren> = async ({ children }) => {
    const notifications = await getAdminNotifications();

    return (
        <Page {...metadata}>
            <PageContent>
                <div className="flex gap-10">
                    <SideNav
                        rootPath="admin"
                        sections={[
                            {
                                title: 'General',
                                members: [
                                    { title: 'ARTCC Information', route: '' },
                                    { title: 'Audit Log', route: 'audit' },
                                    { title: 'Django Panel', url: `${process.env.NEXT_PUBLIC_API_URL}/admin/` },
                                ],
                            },
                            {
                                title: 'Announcements',
                                members: [
                                    { title: 'Announcements', route: 'announcements' },
                                ],
                            },
                            {
                                title: 'Roster',
                                members: [
                                    { title: 'Active LOAs', route: 'loa' },
                                    { title: 'Roster Purge', route: 'purge' },
                                    { title: 'Event Scores', route: 'scores' },
                                ],
                            },
                            {
                                title: 'Approval Queue',
                                members: [
                                    {
                                        title: 'LOA Requests',
                                        route: 'queue/loa',
                                        alerts: notifications.loa_requests,
                                    },
                                    {
                                        title: 'Visiting Requests',
                                        route: 'queue/visit',
                                        alerts: notifications.visiting_applications,
                                    },
                                    {
                                        title: 'Pending Feedback',
                                        route: 'queue/feedback',
                                        alerts: notifications.pending_feedback,
                                    },
                                    {
                                        title: 'Event Support',
                                        route: 'queue/events',
                                        alerts: notifications.support_requests,
                                    },
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

export default AdminLayout;
