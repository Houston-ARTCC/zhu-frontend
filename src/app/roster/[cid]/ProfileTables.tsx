'use client';

import React from 'react';
import { format } from 'date-fns-tz';
import DataTable from 'react-data-table-component';
import { LuCalendar, LuChevronDown, LuPlane } from 'react-icons/lu';
import { RatingStars } from '@/components/RatingStars';
import { formatDuration } from '@/utils/time';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { type Session } from '@/types/connections';
import { type BasicFeedback } from '@/types/feedback';

interface ConnectionsTable {
    data: Session[];
}

export const ConnectionsTable: React.FC<ConnectionsTable> = ({ data }) => (
    <DataTable
        data={data}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        defaultSortFieldId={1}
        defaultSortAsc={false}
        sortIcon={<LuChevronDown />}
        customStyles={dataTableStyle}
        columns={[
            {
                name: 'Date',
                selector: (row) => row.start,
                sortable: true,
                sortFunction: (a, b) => a.start.localeCompare(b.start),
                format: (row) => format(new Date(row.start), 'MMM d, y'),
            },
            {
                name: 'Callsign',
                selector: (row) => row.callsign,
                sortable: true,
            },
            {
                name: 'Duration',
                selector: (row) => row.duration,
                sortable: true,
                sortFunction: (a, b) => (a.duration > b.duration ? 1 : -1),
                format: (row) => formatDuration(row.duration),
            },
        ]}
    />
);

interface ExpandedFeedbackRowProps {
    data: BasicFeedback;
}

const ExpandedFeedbackRow: React.FC<ExpandedFeedbackRowProps> = ({ data }) => (
    <div className="px-16 py-5">
        {data.pilot_callsign && (
            <div className="mb-5 flex items-center gap-2 font-medium">
                <LuPlane size={25} />
                {data.pilot_callsign}
            </div>
        )}
        {data.event && (
            <div className="mb-5 flex items-center gap-2 font-medium">
                <LuCalendar size={25} />
                {data.event.name}
            </div>
        )}
        {data.comments}
    </div>
);

interface FeedbackTable {
    data: BasicFeedback[];
}

export const FeedbackTable: React.FC<FeedbackTable> = ({ data }) => (
    <DataTable
        data={data}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        defaultSortFieldId={1}
        defaultSortAsc={false}
        expandOnRowClicked
        expandableRows
        expandableRowsComponent={ExpandedFeedbackRow}
        sortIcon={<LuChevronDown />}
        customStyles={dataTableStyle}
        columns={[
            {
                name: 'Date',
                selector: (row) => row.created,
                sortable: true,
                sortFunction: (a, b) => a.created.localeCompare(b.created),
                format: (row) => format(new Date(row.created), 'MMM d, y'),
            },
            {
                name: 'Callsign',
                selector: (row) => row.controller_callsign ?? '',
                sortable: true,
            },
            {
                name: 'Rating',
                selector: (row) => row.rating,
                sortable: true,
                format: ({ rating }) => <RatingStars rating={rating} />,
            },
        ]}
    />
);
