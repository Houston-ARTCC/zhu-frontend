import React from 'react';
import { type NextPage } from 'next';
import { requireStaff } from '@/lib/auth/guards';
import { getAnnouncements } from '@/lib/announcements/repository';
import { AnnouncementsTable } from './AnnouncementsTable';
import { NewAnnouncementButton } from './NewAnnouncementModal';

const AnnouncementsPage: NextPage = async () => {
    await requireStaff();
    const announcements = await getAnnouncements();

    return (
        <>
            <NewAnnouncementButton />
            <AnnouncementsTable data={announcements} />
        </>
    );
};

export default AnnouncementsPage;
