'use client';

import React from 'react';
import { format } from 'date-fns-tz';
import DataTable from 'react-data-table-component';
import { LuCalendar, LuChevronDown, LuPlane, LuStar } from 'react-icons/lu';
import { formatDuration } from '@/utils/time';
import { type Session } from '@/types/api/connections';
import { type Feedback } from '@/types/api/feedback';

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
        columns={[
            {
                name: 'Date',
                selector: (row) => row.start,
                sortable: true,
                sortFunction: (a, b) => (new Date(a.start) > new Date(b.start) ? 1 : -1),
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
    data: Feedback;
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

const Stars: React.FC<Feedback> = ({ rating }) => (
    <div className="flex items-center gap-2">
        {[...Array(5)].map((x, i) => (
            i >= rating
                ? <LuStar key={i} size={20} className="" />
                : <LuStar key={i} size={20} className="fill-black" />
        ))}
    </div>
);

interface FeedbackTable {
    data: Feedback[];
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
        customStyles={{
            expanderRow: {
                style: {
                    borderBottom: 'solid 1px rgba(0,0,0,.12)',
                },
            },
        }}
        columns={[
            {
                name: 'Date',
                selector: (row) => row.created,
                sortable: true,
                sortFunction: (a, b) => (new Date(a.created) > new Date(b.created) ? 1 : -1),
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
                format: Stars,
            },
        ]}
    />
);
