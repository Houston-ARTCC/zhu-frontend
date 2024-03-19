'use client';

import React, { useState } from 'react';
import { format } from 'date-fns-tz';
import DataTable from 'react-data-table-component';
import { LuCheck, LuChevronDown, LuEye, LuUserX } from 'react-icons/lu';
import { addMonths, getQuarter, startOfQuarter } from 'date-fns';
import classNames from 'classnames';
import { Button } from '@/components/Button';
import { RosterOptions } from '@/components/RosterOptions';
import { ProfilePicture } from '@/components/ProfilePicture';
import { ClientPortal } from '@/components/ClientPortal';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { durationToSeconds } from '@/utils/time';
import type { AdminStatistics, AdminUserStatistic } from '@/types/connections';
import { PurgeModal } from './PurgeModal';

interface PurgeViewProps {
    data: AdminUserStatistic[];
}

export const PurgeView: React.FC<PurgeViewProps> = ({ data }) => {
    const [showSelectedRows, setShowSelectedRows] = useState<boolean>(false);
    const [showPurgeModal, setShowPurgeModal] = useState<boolean>(false);

    const [selectedRows, setSelectedRows] = useState<AdminUserStatistic[]>([]);

    return (
        <>
            <DataTable
                data={data.filter((row) => !showSelectedRows || selectedRows.includes(row))}
                title={<p className="text-base font-medium">Select users to purge</p>}
                defaultSortFieldId={2}
                sortIcon={<LuChevronDown />}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 15, 20, 25]}
                selectableRows
                selectableRowsHighlight
                selectableRowsNoSelectAll
                selectableRowDisabled={(row) => row.is_staff}
                onSelectedRowsChange={({ selectedRows: rows }) => {
                    setSelectedRows(rows);

                    if (rows.length === 0) {
                        setShowSelectedRows(false);
                    }
                }}
                contextActions={(
                    <div className="flex gap-5">
                        <Button
                            variant={showSelectedRows ? 'primary' : 'secondary'}
                            className="text-sm"
                            onClick={() => setShowSelectedRows((show) => !show)}
                        >
                            <LuEye size={17} />
                            Only Show Selected
                        </Button>
                        <Button
                            className="!bg-red-400 !text-sm !shadow-red-400/25"
                            onClick={() => setShowPurgeModal(true)}
                        >
                            <LuUserX size={17} />
                            Purge
                        </Button>
                    </div>
                )}
                customStyles={dataTableStyle}
                columns={[
                    {
                        cell: (user) => <ProfilePicture user={user} size={30} />,
                        width: '30px',
                        compact: true,
                        right: true,
                    },
                    {
                        name: 'Controller',
                        selector: (user) => `${user.first_name} ${user.last_name}`,
                        sortable: true,
                        sortFunction: (a, b) => a.first_name.localeCompare(b.first_name) || a.last_name.localeCompare(b.last_name),
                        format: (user) => `${user.first_name} ${user.last_name} (${user.initials})`,
                        width: '200px',
                    },
                    { selector: (user) => user.cid, width: '90px' },
                    { selector: (user) => user.rating, width: '60px' },
                    {
                        name: format(startOfQuarter(new Date()), 'MMMM'),
                        selector: (user) => user.month_1_hours ?? '',
                        sortable: true,
                        sortFunction: (a, b) => durationToSeconds(a.month_1_hours) - durationToSeconds(b.month_1_hours),
                        width: '107px',
                        right: true,
                        style: { fontFamily: 'monospace', fontSize: '0.9rem' },
                    },
                    {
                        name: format(addMonths(startOfQuarter(new Date()), 1), 'MMMM'),
                        selector: (user) => user.month_2_hours ?? '',
                        sortable: true,
                        sortFunction: (a, b) => durationToSeconds(a.month_2_hours) - durationToSeconds(b.month_2_hours),
                        width: '107px',
                        right: true,
                        style: { fontFamily: 'monospace', fontSize: '0.9rem' },
                    },
                    {
                        name: format(addMonths(startOfQuarter(new Date()), 2), 'MMMM'),
                        selector: (user) => user.month_3_hours ?? '',
                        sortable: true,
                        sortFunction: (a, b) => durationToSeconds(a.month_3_hours) - durationToSeconds(b.month_3_hours),
                        width: '107px',
                        right: true,
                        style: { fontFamily: 'monospace', fontSize: '0.9rem' },
                    },
                    {
                        name: `Q${getQuarter(new Date())} Total`,
                        selector: (user) => user.quarter_hours ?? '',
                        sortable: true,
                        sortFunction: (a, b) => durationToSeconds(a.quarter_hours) - durationToSeconds(b.quarter_hours),
                        cell: (user) => (
                            <div className={classNames('flex items-center', { 'text-green-500': user.quarter_active })}>
                                {user.quarter_active && <LuCheck size={20} />}
                                <p className="w-14 text-right">{user.quarter_hours}</p>
                            </div>
                        ),
                        width: '125px',
                        right: true,
                        style: { fontFamily: 'monospace', fontSize: '0.9rem' },
                    },
                    {
                        name: 'Tier 1',
                        selector: (user) => user.quarter_t1_hours ?? '',
                        sortable: true,
                        sortFunction: (a, b) => durationToSeconds(a.quarter_t1_hours) - durationToSeconds(b.quarter_t1_hours),
                        cell: (user) => (
                            <div className={classNames('flex items-center', { 'text-green-500': user.quarter_t1_active })}>
                                {user.quarter_t1_active && <LuCheck size={20} />}
                                <p className="w-14 text-right">{user.quarter_t1_hours}</p>
                            </div>
                        ),
                        width: '125px',
                        right: true,
                        style: { fontFamily: 'monospace', fontSize: '0.9rem' },
                    },
                    {
                        name: 'Training',
                        selector: (user) => user.training_hours ?? '',
                        sortable: true,
                        sortFunction: (a, b) => durationToSeconds(a.training_hours) - durationToSeconds(b.training_hours),
                        cell: (user) => (
                            <div className={classNames('flex items-center', { 'text-green-500': user.training_active })}>
                                {user.training_active && <LuCheck size={20} />}
                                <p className="w-14 text-right">{user.training_hours}</p>
                            </div>
                        ),
                        width: '125px',
                        right: true,
                        style: { fontFamily: 'monospace', fontSize: '0.9rem' },
                    },
                ]}
            />
            <ClientPortal>
                <PurgeModal
                    show={showPurgeModal}
                    users={selectedRows}
                    close={() => setShowPurgeModal(false)}
                />
            </ClientPortal>
        </>
    );
};

interface StatisticsTableProps {
    data: AdminStatistics;
}

// We can't import `PurgeView` inside the `page.tsx` server-side component, so we wrap it here instead
export const PurgeTable: React.FC<StatisticsTableProps> = ({ data }) => (
    <RosterOptions data={data} component={PurgeView} />
);
