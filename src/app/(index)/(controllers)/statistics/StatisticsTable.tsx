'use client';

import React, { useMemo, useState } from 'react';
import { format } from 'date-fns-tz';
import DataTable from 'react-data-table-component';
import { LuCheck, LuChevronDown } from 'react-icons/lu';
import { subMonths } from 'date-fns';
import classNames from 'classnames';
import { TextInput } from '@/components/Forms';
import { Button, ButtonGroup } from '@/components/Button';
import { durationToSeconds, formatDuration } from '@/utils/time';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { type Statistics } from '@/types/connections';
import { ratingToInt } from '@/utils';

interface ControllerHoursProps {
    required: string;
    completed: string;
}

const ControllerHours: React.FC<ControllerHoursProps> = ({ required, completed }) => (
    <>
        <LuCheck
            size={25}
            className={classNames(
                'mr-3 stroke-emerald-400',
                { 'opacity-0': durationToSeconds(completed) < (durationToSeconds(required) || Infinity) },
            )}
        />
        {formatDuration(completed)}
    </>
);

interface StatisticsTableProps {
    data: Statistics;
}

export const StatisticsTable: React.FC<StatisticsTableProps> = ({ data }) => {
    const [searchString, setSearchString] = useState<string>('');
    const [filter, setFilter] = useState<'home' | 'visiting' | 'mavp' | 'all'>('home');

    const controllers = useMemo(() => {
        if (filter === 'home') return data.home;
        if (filter === 'visiting') return data.visiting;
        if (filter === 'mavp') return data.mavp;
        return data.home.concat(data.visiting).concat(data.mavp);
    }, [data, filter]);

    return (
        <div className="mt-10">
            <div className="mb-5 flex justify-between">
                <TextInput placeholder="Search for controller..." onUpdate={setSearchString} />
                <ButtonGroup>
                    <Button
                        className={classNames(
                            'py-0.5 transition-colors duration-150',
                            { '!bg-white text-gray-500': filter !== 'home' },
                        )}
                        variant="secondary"
                        onClick={() => setFilter('home')}
                    >
                        Home
                    </Button>
                    <Button
                        className={classNames(
                            'py-0.5 transition-colors duration-150',
                            { '!bg-white text-gray-500': filter !== 'visiting' },
                        )}
                        variant="secondary"
                        onClick={() => setFilter('visiting')}
                    >
                        Visiting
                    </Button>
                    <Button
                        className={classNames(
                            'py-0.5 transition-colors duration-150',
                            { '!bg-white text-gray-500': filter !== 'mavp' },
                        )}
                        variant="secondary"
                        onClick={() => setFilter('mavp')}
                    >
                        MAVP
                    </Button>
                    <Button
                        className={classNames(
                            'py-0.5 transition-colors duration-150',
                            { '!bg-white text-gray-500': filter !== 'all' },
                        )}
                        variant="secondary"
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                </ButtonGroup>
            </div>
            <DataTable
                data={controllers
                    .filter((row) => (
                        `${row.first_name} ${row.last_name} (${row.initials})`.toLowerCase().includes(searchString.toLowerCase())
                        || row.cid.toString().includes(searchString)
                    ))}
                defaultSortFieldId={1}
                sortIcon={<LuChevronDown />}
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
        </div>
    );
};
