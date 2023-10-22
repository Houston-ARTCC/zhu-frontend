'use client';

import React, { useMemo, useState } from 'react';
import { format } from 'date-fns-tz';
import DataTable from 'react-data-table-component';
import { LuChevronDown, LuUserX } from 'react-icons/lu';
import { subMonths } from 'date-fns';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { Button, ButtonGroup } from '@/components/Button';
import { ControllerHours } from '@/components/ControllerHours';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { type Statistics, type UserStatistic } from '@/types/connections';
import { ratingToInt } from '@/utils';
import { PurgeModal } from './PurgeModal';

interface PurgeTableProps {
    data: Statistics;
}

export const PurgeTable: React.FC<PurgeTableProps> = ({ data }) => {
    const [showPurgeModal, setShowPurgeModal] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<UserStatistic[]>([]);
    const [filter, setFilter] = useState<'home' | 'visiting' | 'all'>('home');

    const controllers = useMemo(() => {
        if (filter === 'home') return data.home;
        if (filter === 'visiting') return data.visiting;
        return data.home.concat(data.visiting);
    }, [data, filter]);

    return (
        <>
            <div className="mb-3 flex justify-between">
                <ButtonGroup>
                    <Button
                        className={classNames(
                            'py-0.5 transition-colors duration-150',
                            { '!bg-white !text-gray-500': filter !== 'home' },
                        )}
                        variant="secondary"
                        onClick={() => setFilter('home')}
                    >
                        Home
                    </Button>
                    <Button
                        className={classNames(
                            'py-0.5 transition-colors duration-150',
                            { '!bg-white !text-gray-500': filter !== 'visiting' },
                        )}
                        variant="secondary"
                        onClick={() => setFilter('visiting')}
                    >
                        Visiting
                    </Button>
                    <Button
                        className={classNames(
                            'py-0.5 transition-colors duration-150',
                            { '!bg-white !text-gray-500': filter !== 'all' },
                        )}
                        variant="secondary"
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                </ButtonGroup>
            </div>
            <DataTable
                data={controllers}
                title={<p className="text-base">Select users to purge</p>}
                defaultSortFieldId={1}
                sortIcon={<LuChevronDown />}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 15, 20, 25]}
                selectableRows
                selectableRowsHighlight
                selectableRowDisabled={(row) => row.is_staff}
                onSelectedRowsChange={({ selectedRows: rows }) => setSelectedRows(rows)}
                contextActions={(
                    <Button className="!bg-red-400 !text-sm !shadow-red-400/25" onClick={() => setShowPurgeModal(true)}>
                        <LuUserX size={17} />
                        Purge
                    </Button>
                )}
                customStyles={dataTableStyle}
                columns={[
                    {
                        name: 'Name',
                        selector: (row) => `${row.first_name} ${row.last_name}`,
                        sortable: true,
                        sortFunction: (a, b) => a.first_name.localeCompare(b.first_name) || a.last_name.localeCompare(b.last_name),
                        format: (row) => `${row.first_name} ${row.last_name} (${row.initials})`,
                    },
                    {
                        name: 'CID',
                        selector: (row) => row.cid,
                        sortable: true,
                        width: '120px',
                    },
                    {
                        name: 'Rating',
                        selector: (row) => row.rating,
                        sortFunction: (a, b) => (ratingToInt(a.rating) > ratingToInt(b.rating) ? 1 : -1),
                        sortable: true,
                        width: '100px',
                    },
                    {
                        name: format(subMonths(new Date(new Date().getUTCFullYear(), new Date().getUTCMonth()), 2), 'MMMM'),
                        selector: (row) => row.prev_prev_hours,
                        sortable: true,
                        sortFunction: (a, b) => a.prev_prev_hours.localeCompare(b.prev_prev_hours),
                        cell: (row) => <ControllerHours required={row.activity_requirement} completed={row.prev_prev_hours} />,
                        width: '200px',
                    },
                    {
                        name: format(subMonths(new Date(new Date().getUTCFullYear(), new Date().getUTCMonth()), 1), 'MMMM'),
                        selector: (row) => row.prev_hours,
                        sortable: true,
                        sortFunction: (a, b) => a.prev_hours.localeCompare(b.prev_hours),
                        cell: (row) => <ControllerHours required={row.activity_requirement} completed={row.prev_hours} />,
                        width: '200px',
                    },
                    {
                        name: format(new Date(new Date().getUTCFullYear(), new Date().getUTCMonth()), 'MMMM'),
                        selector: (row) => row.curr_hours,
                        sortable: true,
                        sortFunction: (a, b) => a.curr_hours.localeCompare(b.curr_hours),
                        cell: (row) => <ControllerHours required={row.activity_requirement} completed={row.curr_hours} />,
                        width: '200px',
                    },
                ]}
            />
            {ReactDOM.createPortal(
                <PurgeModal
                    show={showPurgeModal}
                    users={selectedRows}
                    close={() => setShowPurgeModal(false)}
                />,
                document.body,
            )}
        </>
    );
};
