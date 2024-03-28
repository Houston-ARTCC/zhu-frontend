'use client';

import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns-tz';
import { LuX } from 'react-icons/lu';
import { AnnouncementModal } from '@/components/AnnouncementModal';
import { ClientPortal } from '@/components/ClientPortal';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { type Announcement } from '@/types/announcements';
import { DeleteAnnouncementModal } from './DeleteAnnouncementModal';

interface AnnouncementsTableProps {
    data: Announcement[];
}

export const AnnouncementsTable: React.FC<AnnouncementsTableProps> = ({ data }) => {
    const [showAnnouncement, setShowAnnouncement] = useState<boolean>(false);
    const [showDelete, setShowDelete] = useState<boolean>(false);

    const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | undefined>();

    return (
        <>
            <DataTable
                data={data}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 15, 20, 25]}
                pointerOnHover
                onRowClicked={(row) => {
                    setCurrentAnnouncement(row);
                    setShowAnnouncement(true);
                }}
                customStyles={dataTableStyle}
                columns={[
                    {
                        name: 'Title',
                        selector: (row) => row.title,
                    },
                    {
                        name: 'Date Posted',
                        selector: (row) => row.posted,
                        format: (row) => format(new Date(row.posted), 'MMM d, y @ HH:mm zzz'),
                        maxWidth: '300px',
                    },
                    {
                        name: 'Delete',
                        button: true,
                        cell: (row) => (
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentAnnouncement(row);
                                    setShowDelete(true);
                                }}
                                aria-label="Delete Announcement"
                            >
                                <LuX size={20} />
                            </button>
                        ),
                        width: '65px',
                    },
                ]}
            />
            <ClientPortal>
                <AnnouncementModal
                    show={showAnnouncement}
                    announcement={currentAnnouncement}
                    close={() => setShowAnnouncement(false)}
                    onClose={() => setCurrentAnnouncement(undefined)}
                />
            </ClientPortal>
            <ClientPortal>
                <DeleteAnnouncementModal
                    show={showDelete}
                    announcement={currentAnnouncement}
                    close={() => setShowDelete(false)}
                    onClose={() => setCurrentAnnouncement(undefined)}
                />
            </ClientPortal>
        </>
    );
};
