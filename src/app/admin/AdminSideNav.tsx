'use client';

import React from 'react';
import { SideNav } from '@/components/SideNav';
import type { AdminNotifications } from '@/types/admin';

interface AdminSideNavProps {
    notifications: AdminNotifications;
}

export const AdminSideNav: React.FC<AdminSideNavProps> = ({ notifications }) => (
    <SideNav
        rootPath="/admin"
        sections={[
            {
                title: 'General',
                children: [
                    { title: 'ARTCC Information', route: '' },
                    { title: 'Audit Log', route: 'audit' },
                    { title: 'Django Panel', url: `${process.env.NEXT_PUBLIC_API_URL}/admin/` },
                ],
            },
            {
                title: 'Announcements',
                children: [
                    { title: 'Announcements', route: 'announcements' },
                ],
            },
            {
                title: 'Roster',
                children: [
                    {
                        title: 'Approved LOAs',
                        route: 'loa',
                        auth: (user) => user?.permissions.is_admin ?? false,
                    },
                    {
                        title: 'Roster Purge',
                        route: 'purge',
                        auth: (user) => user?.permissions.is_admin ?? false,
                    },
                    { title: 'Event Scores', route: 'scores' },
                ],
            },
            {
                title: 'Approval Queue',
                children: [
                    {
                        title: 'LOA Requests',
                        route: 'queue/loa',
                        alerts: notifications.loa_requests,
                        auth: (user) => user?.permissions.is_admin ?? false,
                    },
                    {
                        title: 'Visiting Requests',
                        route: 'queue/visit',
                        alerts: notifications.visiting_applications,
                        auth: (user) => user?.permissions.is_admin ?? false,
                    },
                    {
                        title: 'Pending Feedback',
                        route: 'queue/feedback',
                        alerts: notifications.pending_feedback,
                        auth: (user) => user?.permissions.is_admin ?? false,
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
);
