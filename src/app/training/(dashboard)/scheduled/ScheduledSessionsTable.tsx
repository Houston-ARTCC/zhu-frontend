'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DataTable from 'react-data-table-component';
import { LuChevronDown, LuFileBadge, LuUserX, LuX } from 'react-icons/lu';
import { format } from 'date-fns-tz';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/Badge';
import { ClientPortal } from '@/components/ClientPortal';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { SESSION_LEVEL_STRING, SESSION_TYPE_STRING, type TrainingSession } from '@/types/training';
import { CancelSessionModal } from './CancelSessionModal';
import { NoShowSessionModal } from './NoShowSessionModal';

interface ScheduledSessionsTableProps {
    data: TrainingSession[];
}

export const ScheduledSessionsTable: React.FC<ScheduledSessionsTableProps> = ({ data }) => {
    const { data: session } = useSession();

    const [showCancelSession, setShowCancelSession] = useState<boolean>(false);
    const [cancelSession, setCancelSession] = useState<TrainingSession | undefined>();

    const [showNoShowSession, setShowNoShowSession] = useState<boolean>(false);
    const [noShowSession, setNoShowSession] = useState<TrainingSession | undefined>();

    return (
        <>
            <DataTable
                data={data}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 15, 20, 25]}
                defaultSortFieldId={1}
                defaultSortAsc={false}
                sortIcon={<LuChevronDown />}
                customStyles={dataTableStyle}
                columns={[
                    {
                        name: 'Date',
                        selector: (row) => row.start,
                        sortable: true,
                        format: (row) => format(new Date(row.start), 'MMM d, y @ HH:mm zzz'),
                        sortFunction: (a, b) => a.start.localeCompare(b.start),
                        width: '20%',
                    },
                    {
                        name: 'Instructor',
                        selector: (row) => row.instructor.cid,
                        sortable: true,
                        format: (row) => (
                            row.instructor.cid === session?.user.cid
                                ? (
                                    <div className="flex items-center gap-2">
                                        {row.instructor.first_name} {row.instructor.last_name}
                                        <Badge small className="max-w-fit">Me</Badge>
                                    </div>
                                )
                                : `${row.instructor.first_name} ${row.instructor.last_name}`
                        ),
                        sortFunction: (a, b) => (
                            a.instructor.first_name.localeCompare(b.instructor.first_name)
                            || a.instructor.last_name.localeCompare(b.instructor.last_name)
                        ),
                    },
                    {
                        name: 'Student',
                        selector: (row) => row.student.cid,
                        sortable: true,
                        format: (row) => `${row.student.first_name} ${row.student.last_name}`,
                        sortFunction: (a, b) => (
                            a.student.first_name.localeCompare(b.student.first_name)
                            || a.student.last_name.localeCompare(b.student.last_name)
                        ),
                    },
                    {
                        name: 'Level',
                        selector: (row) => row.level,
                        sortable: true,
                        format: (row) => SESSION_LEVEL_STRING[row.level],
                    },
                    {
                        name: 'Type',
                        selector: (row) => row.type,
                        sortable: true,
                        format: (row) => SESSION_TYPE_STRING[row.type],
                    },
                    {
                        name: 'File',
                        button: true,
                        cell: (row) => (
                            <Link
                                className="text-inherit"
                                href={`/training/session/${row.id}/file`}
                            >
                                <LuFileBadge size={20} />
                            </Link>
                        ),
                        width: '60px',
                    },
                    {
                        name: 'Cancel',
                        button: true,
                        cell: (row) => (
                            <button
                                type="button"
                                onClick={() => {
                                    setCancelSession(row);
                                    setShowCancelSession(true);
                                }}
                                aria-label="Cancel Session"
                            >
                                <LuX size={20} />
                            </button>
                        ),
                        width: '60px',
                    },
                    {
                        name: 'No-Show',
                        button: true,
                        cell: (row) => (
                            <button
                                type="button"
                                onClick={() => {
                                    setNoShowSession(row);
                                    setShowNoShowSession(true);
                                }}
                                aria-label="Student No-Show"
                            >
                                <LuUserX size={20} />
                            </button>
                        ),
                        width: '60px',
                    },
                ]}
            />
            <ClientPortal>
                <CancelSessionModal
                    show={showCancelSession}
                    session={cancelSession}
                    close={() => setShowCancelSession(false)}
                    onClose={() => setCancelSession(undefined)}
                />
            </ClientPortal>
            <ClientPortal>
                <NoShowSessionModal
                    show={showNoShowSession}
                    session={noShowSession}
                    close={() => setShowNoShowSession(false)}
                    onClose={() => setNoShowSession(undefined)}
                />
            </ClientPortal>
        </>
    );
};
