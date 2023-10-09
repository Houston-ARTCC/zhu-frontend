import React from 'react';
import { type NextPage } from 'next';
import { fetchApi } from '@/utils/fetch';
import { type Announcement } from '@/types/announcements';
import { AnnouncementsTable } from './AnnouncementsTable';
import { NewAnnouncementButton } from './NewAnnouncementModal';

async function getAnnouncements(): Promise<Announcement[]> {
    return fetchApi(
        '/announcements/',
        { cache: 'no-store' },
    );
}

const LoaRequests: NextPage = async () => {
    const announcements = await getAnnouncements();

    return (
        <>
            <NewAnnouncementButton />
            <AnnouncementsTable data={announcements} />
        </>
    );
};

export default LoaRequests;
