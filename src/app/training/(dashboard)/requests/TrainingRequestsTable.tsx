'use client';

import React from 'react';
import DataTable from 'react-data-table-component';
import { LuChevronDown, LuMessageCircle } from 'react-icons/lu';
import { format } from 'date-fns-tz';
import { Tooltip } from 'react-tooltip';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { SESSION_LEVEL_STRING, SESSION_TYPE_STRING, type UserTrainingRequests } from '@/types/training';
import { BookSessionButton } from './BookSessionModal';

interface ExpandedSessionRowProps {
    data: UserTrainingRequests;
}

const ExpandedSessionRow: React.FC<ExpandedSessionRowProps> = ({ data }) => (
    <div className="flex flex-col gap-2 py-5 pl-16">
        {data.requests.map((request) => (
            <div key={request.id} className="flex items-center gap-2">
                <BookSessionButton request={request} />
                <p>
                    {SESSION_LEVEL_STRING[request.level]} {SESSION_TYPE_STRING[request.type]}
                    {' '}on <b>{format(new Date(request.start), 'MMM d')}</b>
                    {' '}from <b>{format(new Date(request.start), 'HH:mm')}</b>
                    {' '}to <b>{format(new Date(request.end), 'HH:mm z')}</b>
                </p>
                {request.remarks && (
                    <LuMessageCircle
                        size={20}
                        data-tooltip-id="remarks-tooltip"
                        data-tooltip-content={request.remarks}
                    />
                )}
            </div>
        ))}
    </div>
);

interface TrainingRequestsTableProps {
    data: UserTrainingRequests[];
}

export const TrainingRequestsTable: React.FC<TrainingRequestsTableProps> = ({ data }) => (
    <>
        <DataTable
            data={data}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 15, 20, 25]}
            defaultSortFieldId={1}
            defaultSortAsc={false}
            sortIcon={<LuChevronDown />}
            expandOnRowClicked
            expandableRows
            expandableRowsComponent={ExpandedSessionRow}
            customStyles={dataTableStyle}
            columns={[
                {
                    name: 'Student',
                    selector: (row) => row.user.cid,
                    sortable: true,
                    format: (row) => `${row.user.first_name} ${row.user.last_name}`,
                    sortFunction: (a, b) => (
                        a.user.first_name.localeCompare(b.user.first_name)
                            || a.user.last_name.localeCompare(b.user.last_name)
                    ),
                },
                {
                    name: 'Last Session',
                    selector: (row) => row.last_session ?? 'Never',
                    sortable: true,
                    format: (row) => (
                        row.last_session
                            ? format(new Date(row.last_session), 'MMM d, y')
                            : 'Never'
                    ),
                    // TODO: Replace with some sort of localeCompare
                    sortFunction: (a, b) => (
                        new Date(a.last_session ?? 0) > new Date(b.last_session ?? 0)
                            ? 1
                            : -1
                    ),
                },
                {
                    name: 'Requests',
                    selector: (row) => row.requests.length,
                    sortable: true,
                },
            ]}
        />
        <Tooltip id="remarks-tooltip" className="max-w-lg" />
    </>
);
