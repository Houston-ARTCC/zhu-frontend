import React from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns-tz';
import classNames from 'classnames';
import { CgSpinner } from 'react-icons/cg';
import { Badge } from '@/components/Badge';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { type LogEntry, LogEntryAction } from '@/types/admin';

const LOG_ACTION_COLORS = ['!bg-green-400', '!bg-sky-500', '!bg-red-400'];

const LOG_ACTION_TEXT = ['created', 'updated', 'deleted'];

interface ExpandedLogEntryRowProps {
    data: LogEntry;
}

const ExpandedLogEntryRow: React.FC<ExpandedLogEntryRowProps> = ({ data }) => (
    <div className="py-5 pl-16">
        <table className="w-full table-fixed">
            <thead>
                <tr className="border-b-2">
                    <th align="right" className="w-44 px-2 py-1">Field</th>
                    {data.action !== LogEntryAction.Create && (
                        <th align="left" className="px-2 py-1">Previous Value</th>
                    )}
                    {data.action !== LogEntryAction.Delete && (
                        <th align="left" className="px-2 py-1">Current Value</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {Object.entries(data.changes).map(([field, change]) => (
                    <tr key={field} className="odd:bg-white">
                        <td align="right" className="px-2 py-1">
                            <code className="text-sm">{field}</code>
                        </td>
                        {data.action !== LogEntryAction.Create && (
                            <td align="left" className="px-2 py-1">
                                <code className="break-words text-sm">{change[0]}</code>
                            </td>
                        )}
                        {data.action !== LogEntryAction.Delete && (
                            <td align="left" className="px-2 py-1">
                                <code className="break-words text-sm">{change[1]}</code>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

interface LogEntryTableProps {
    loading: boolean;
    data: LogEntry[];
    totalEntries: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
}

export const LogEntryTable: React.FC<LogEntryTableProps> = ({ loading, data, totalEntries, pageSize, setPage, setPageSize }) => (
    <DataTable
        data={data}
        progressPending={loading}
        progressComponent={(
            <div className="flex justify-center">
                <CgSpinner className="animate-spin text-darkblue" size={50} />
            </div>
        )}
        pagination
        paginationServer
        paginationTotalRows={totalEntries}
        paginationPerPage={pageSize}
        paginationRowsPerPageOptions={[20, 30, 40, 50]}
        onChangePage={setPage}
        onChangeRowsPerPage={setPageSize}
        expandOnRowClicked
        expandableRows
        expandableRowsComponent={ExpandedLogEntryRow}
        customStyles={dataTableStyle}
        columns={[
            {
                name: 'Action',
                selector: (row) => row.action,
                format: (row) => (
                    <p>
                        {row.content_type} <b>{row.object_id} &mdash; {row.object_repr}</b> was
                        {' '}
                        <Badge small className={classNames('!inline max-w-fit', LOG_ACTION_COLORS[row.action])}>
                            {LOG_ACTION_TEXT[row.action]}
                        </Badge>
                        {' '}
                        by {row.actor ? `${row.actor.first_name} ${row.actor.last_name}` : 'System'}
                    </p>
                ),
            },
            {
                name: 'Timestamp',
                selector: (row) => row.timestamp,
                format: (row) => format(new Date(row.timestamp), 'MMM d, y @ HH:mm zzz'),
                maxWidth: '300px',
            },
        ]}
    />
);
