'use client';

import React from 'react';
import Link from 'next/link';
import DataTable from 'react-data-table-component';
import { LuCalendar, LuChevronDown, LuClock, LuFileCog, LuPlane, LuRadioTower } from 'react-icons/lu';
import { format } from 'date-fns-tz';
import { useSession } from 'next-auth/react';
import { RiArrowRightCircleFill, RiCheckboxCircleFill, RiCloseCircleFill, RiIndeterminateCircleFill } from 'react-icons/ri';
import classNames from 'classnames';
import { Badge } from '@/components/Badge';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { parseHtml } from '@/utils/parseHtml';
import { SESSION_LEVEL_STRING, SESSION_TYPE_STRING, SessionOTSStatus, SessionStatus, type TrainingSession } from '@/types/training';

interface StatusIconProps {
    status: SessionStatus;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
    switch (status) {
        case SessionStatus.Completed:
            return <Badge small className="!bg-green-400">Completed</Badge>;
        case SessionStatus.Cancelled:
            return <Badge small className="!bg-red-400">Cancelled</Badge>;
        case SessionStatus.Scheduled:
            return <Badge small className="!bg-sky-500">Scheduled</Badge>;
        case SessionStatus.NoShow:
            return <Badge small className="!bg-amber-400">No Show</Badge>;
        default:
            return null;
    }
};

interface OTSStatusIconProps {
    status: SessionOTSStatus;
}

const OTSStatusIcon: React.FC<OTSStatusIconProps> = ({ status }) => {
    switch (status) {
        case SessionOTSStatus.Passed:
            return <RiCheckboxCircleFill size={22} className="fill-green-400" />;
        case SessionOTSStatus.Failed:
            return <RiCloseCircleFill size={22} className="fill-red-400" />;
        case SessionOTSStatus.Recommended:
            return <RiArrowRightCircleFill size={22} className="fill-sky-500" />;
        case SessionOTSStatus.NonOTS:
            return <RiIndeterminateCircleFill size={22} className="fill-slate-300" />;
        default:
            return null;
    }
};

interface ExpandedSessionRowProps {
    data: TrainingSession;
}

const ExpandedSessionRow: React.FC<ExpandedSessionRowProps> = ({ data }) => (
    <div className="py-5 pl-16">
        {data.ots_status !== SessionOTSStatus.NonOTS && (
            <div
                className={classNames(
                    'mb-5 flex items-center gap-3 rounded-md px-6 py-4 font-medium',
                    {
                        'bg-green-400/10 text-green-400': data.ots_status === SessionOTSStatus.Passed,
                        'bg-red-400/10 text-red-400': data.ots_status === SessionOTSStatus.Failed,
                        'bg-sky-500/10 text-sky-500': data.ots_status === SessionOTSStatus.Recommended,
                    },
                )}
            >
                <OTSStatusIcon status={data.ots_status} />
                {data.ots_status === SessionOTSStatus.Passed
                    ? 'Passed OTS Examination'
                    : data.ots_status === SessionOTSStatus.Failed
                        ? 'Failed OTS Examination'
                        : 'Recommended for OTS Examination'}
            </div>
        )}
        {data.solo_granted && (
            <div className="mb-5 flex items-center gap-3 rounded-md bg-indigo-400/10 px-6 py-4 font-medium text-indigo-400">
                <RiCheckboxCircleFill size={22} className="fill-indigo-400" />
                Solo Certification Granted
            </div>
        )}
        <div className="mb-5 grid max-w-3xl grid-cols-2 gap-5">
            <div className="flex items-center gap-2 font-medium">
                <LuCalendar size={25} />
                {format(new Date(data.start), 'MMM d, y')}
            </div>
            <div className="flex items-center gap-2 font-medium">
                <LuRadioTower size={25} />
                {data.position || 'N/A'}
            </div>
            <div className="flex items-center gap-2 font-medium">
                <LuClock size={25} />
                {format(new Date(data.start), 'HH:mm')}
                &nbsp;&rarr;&nbsp;
                {format(new Date(data.end), 'HH:mm zzz')}
            </div>
            <div className="flex items-center gap-2 font-medium">
                <LuPlane size={25} />
                {data.movements} Movements
            </div>
        </div>
        <div className="prose max-w-none">
            {data.notes
                ? parseHtml(data.notes)
                : 'No notes provided.'}
        </div>
    </div>
);

interface SessionsTableProps {
    data: TrainingSession[];
}

export const SessionsTable: React.FC<SessionsTableProps> = ({ data }) => {
    const { data: session } = useSession();

    return (
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
            expandableRowDisabled={(row) => row.status !== SessionStatus.Completed}
            expandableRowsComponent={ExpandedSessionRow}
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
                    format: (row) => `${row.instructor.first_name} ${row.instructor.last_name}`,
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
                    name: 'Status',
                    selector: (row) => row.status,
                    sortable: true,
                    format: (row) => <StatusIcon status={row.status} />,
                    width: '110px',
                },
                {
                    name: 'OTS',
                    selector: (row) => row.ots_status,
                    sortable: true,
                    format: (row) => <OTSStatusIcon status={row.ots_status} />,
                    width: '75px',
                    center: true,
                },
                {
                    name: 'Edit',
                    button: true,
                    cell: (row) => (
                        <Link href={`/training/session/${row.id}/edit`}>
                            <LuFileCog size={20} className="text-gray-900" />
                        </Link>
                    ),
                    omit: !session?.user.permissions.is_training_staff,
                    width: '60px',
                },
            ]}
        />
    );
};
