import React, { type PropsWithChildren } from 'react';
import { AdminSideNav } from '@/app/admin/AdminSideNav';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { fetchApi } from '@/utils/fetch';
import type { AdminNotifications } from '@/types/admin';

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
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-10">
                    <AdminSideNav notifications={notifications} />
                    <div className="md:grow md:overflow-x-auto md:px-1">
                        {children}
                    </div>
                </div>
            </PageContent>
        </Page>
    );
};

export default AdminLayout;
