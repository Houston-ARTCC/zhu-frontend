'use client';

import React from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns-tz';
import { LuChevronDown } from 'react-icons/lu';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { type TrainingRequestHistoryEntry } from '@/types/training';

interface TrainingRequestHistoryTableProps {
    data: TrainingRequestHistoryEntry[];
}

export const TrainingRequestHistoryTable: React.FC<TrainingRequestHistoryTableProps> = ({ data }) => (
    <DataTable
        data={data}
        pagination
        paginationPerPage={20}
        paginationRowsPerPageOptions={[20, 30, 40, 50]}
        defaultSortFieldId={3}
        defaultSortAsc={false}
        sortIcon={<LuChevronDown />}
        customStyles={dataTableStyle}
        columns={[
            {
                id: 'student',
                name: 'Student',
                selector: (row) => row.user.cid,
                sortable: true,
                format: (row) => `${row.user.first_name} ${row.user.last_name} (${row.user.cid})`,
                sortFunction: (a, b) => (
                    a.user.first_name.localeCompare(b.user.first_name)
                    || a.user.last_name.localeCompare(b.user.last_name)
                ),
            },
            {
                id: 'count',
                name: 'Total Requests',
                selector: (row) => row.count,
                sortable: true,
            },
            {
                id: 'last_request',
                name: 'Most Recent',
                selector: (row) => row.last_request,
                sortable: true,
                format: (row) => format(new Date(row.last_request), 'MMM d, y @ HH:mm zzz'),
            },
        ]}
    />
);
