'use client';

import React, { useState } from 'react';
import { format } from 'date-fns-tz';
import DataTable from 'react-data-table-component';
import { LuCheck, LuChevronDown, LuEye, LuUserX } from 'react-icons/lu';
import { addMonths, getQuarter, startOfQuarter } from 'date-fns';
import classNames from 'classnames';
import { CgSpinner } from 'react-icons/cg';
import { Button } from '@/components/Button';
import { ProfilePicture } from '@/components/ProfilePicture';
import { ClientPortal } from '@/components/ClientPortal';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { durationToSeconds } from '@/utils/time';
import type { AdminUserStatistic } from '@/types/connections';
import { PurgeModal } from './PurgeModal';

interface PurgeViewProps {
    data: AdminUserStatistic[];
    loading: boolean;
    currentDate: Date;
}

export const PurgeView: React.FC<PurgeViewProps> = ({ data, loading, currentDate }) => {
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
                progressPending={loading}
                progressComponent={(
                    <div className="flex justify-center">
                        <CgSpinner className="animate-spin text-sky-500" size={50} />
                    </div>
                )}
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
                            color="red-400"
                            className="text-sm"
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
                        width: '45px',
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
                        name: format(startOfQuarter(currentDate), 'MMMM'),
                        selector: (user) => user.month_1_hours ?? '',
                        sortable: true,
                        sortFunction: (a, b) => durationToSeconds(a.month_1_hours) - durationToSeconds(b.month_1_hours),
                        width: '107px',
                        right: true,
                        style: { fontFamily: 'monospace', fontSize: '0.9rem' },
                    },
                    {
                        name: format(addMonths(startOfQuarter(currentDate), 1), 'MMMM'),
                        selector: (user) => user.month_2_hours ?? '',
                        sortable: true,
                        sortFunction: (a, b) => durationToSeconds(a.month_2_hours) - durationToSeconds(b.month_2_hours),
                        width: '107px',
                        right: true,
                        style: { fontFamily: 'monospace', fontSize: '0.9rem' },
                    },
                    {
                        name: format(addMonths(startOfQuarter(currentDate), 2), 'MMMM'),
                        selector: (user) => user.month_3_hours ?? '',
                        sortable: true,
                        sortFunction: (a, b) => durationToSeconds(a.month_3_hours) - durationToSeconds(b.month_3_hours),
                        width: '107px',
                        right: true,
                        style: { fontFamily: 'monospace', fontSize: '0.9rem' },
                    },
                    {
                        name: `Q${getQuarter(currentDate)} Total`,
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
                        selector: (user) => user.t1_hours ?? '',
                        sortable: true,
                        sortFunction: (a, b) => durationToSeconds(a.t1_hours) - durationToSeconds(b.t1_hours),
                        cell: (user) => (
                            <div className={classNames('flex items-center', { 'text-green-500': user.t1_active })}>
                                {user.t1_active && <LuCheck size={20} />}
                                <p className="w-14 text-right">{user.t1_hours}</p>
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
