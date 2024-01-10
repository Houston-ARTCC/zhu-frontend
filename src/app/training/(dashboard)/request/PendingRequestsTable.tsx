'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from 'react-data-table-component';
import { LuChevronDown, LuMessageCircle, LuX } from 'react-icons/lu';
import { format } from 'date-fns-tz';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { fetchApi } from '@/utils/fetch';
import { SESSION_LEVEL_STRING, SESSION_TYPE_STRING, type TrainingRequest } from '@/types/training';

interface PendingRequestsTableProps {
    data: TrainingRequest[];
}

export const PendingRequestsTable: React.FC<PendingRequestsTableProps> = ({ data }) => {
    const router = useRouter();

    const cancelRequest = useCallback(({ id }: TrainingRequest) => {
        toast.promise(
            fetchApi(`/training/request/${id}/`, { method: 'DELETE' }),
            {
                pending: 'Cancelling request',
                success: 'Successfully cancelled',
                error: 'Something went wrong, check console for more info',
            },
        )
            .then(() => router.refresh());
    }, [router]);

    return (
        <>
            <DataTable
                data={data}
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 15]}
                defaultSortFieldId={1}
                sortIcon={<LuChevronDown />}
                customStyles={dataTableStyle}
                columns={[
                    {
                        name: 'From',
                        selector: (row) => row.start,
                        sortable: true,
                        format: (row) => format(new Date(row.start), 'MMM d, y @ HH:mm zzz'),
                        sortFunction: (a, b) => a.start.localeCompare(b.start),
                    },
                    {
                        name: 'Until',
                        selector: (row) => row.end,
                        sortable: true,
                        format: (row) => format(new Date(row.end), 'MMM d, y @ HH:mm zzz'),
                        sortFunction: (a, b) => a.end.localeCompare(b.end),
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
                        name: 'Remarks',
                        button: true,
                        selector: (row) => row.remarks,
                        cell: (row) => row.remarks && (
                            <LuMessageCircle
                                size={20}
                                data-tooltip-id="remarks-tooltip"
                                data-tooltip-content={row.remarks}
                            />
                        ),
                        width: '70px',
                    },
                    {
                        name: 'Cancel',
                        button: true,
                        cell: (row) => (
                            <button
                                type="button"
                                onClick={() => cancelRequest(row)}
                                aria-label="Cancel Request"
                            >
                                <LuX size={20} />
                            </button>
                        ),
                        width: '70px',
                    },
                ]}
            />
            <Tooltip id="remarks-tooltip" className="max-w-lg" />
        </>
    );
};
