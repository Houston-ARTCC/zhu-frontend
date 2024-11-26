'use client';

import React from 'react';
import { SideNav } from '@/components/SideNav';
import type { TrainingNotifications } from '@/types/training';

interface TrainingSideNavProps {
    notifications: TrainingNotifications;
}

export const TrainingSideNav: React.FC<TrainingSideNavProps> = ({ notifications }) => (
    <SideNav
        rootPath="/training"
        sections={[
            {
                title: 'Student Resources',
                children: [
                    {
                        title: 'Sessions',
                        route: '',
                        alerts: notifications.scheduled_sessions,
                    },
                    { title: 'Request Training', route: 'request' },
                    {
                        title: 'Academy Courses',
                        url: 'https://academy.vatusa.net/course/index.php?categoryid=58',
                    },
                ],
            },
            {
                title: 'Mentor Resources',
                auth: (user) => user?.permissions.is_training_staff ?? false,
                children: [
                    // TODO: { title: 'My Availability', route: 'availability' },
                    {
                        title: 'Scheduled Sessions',
                        route: 'scheduled',
                        alerts: notifications.scheduled_sessions,
                    },
                    {
                        title: 'Training Requests',
                        route: 'requests',
                        alerts: notifications.instructor_sessions,
                    },
                    { title: 'Student Profile', route: 'profile' },
                    { title: 'Mentor Profile', route: 'mentor' },
                ],
            },
        ]}
    />
);
