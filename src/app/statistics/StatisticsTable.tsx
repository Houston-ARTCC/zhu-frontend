'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns-tz';
import DataTable from 'react-data-table-component';
import { LuChevronDown } from 'react-icons/lu';
import { subMonths } from 'date-fns';
import { ControllerHours } from '@/components/ControllerHours';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { ratingToInt } from '@/utils';
import { Statistics, UserStatistic } from '@/types/connections';
import { RosterOptions } from '@/components/RosterOptions';

interface StatisticsViewProps {
    data: UserStatistic[];
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ data }) => {
    const router = useRouter();

    return (
        <DataTable
            data={data}
            defaultSortFieldId={1}
            sortIcon={<LuChevronDown />}
            highlightOnHover
            pointerOnHover
            onRowClicked={(row) => router.push(`/roster/${row.cid}`)}
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
    );
};

interface StatisticsTableProps {
    data: Statistics;
}

// We can't import `StatisticsView` inside the `page.tsx` server-side component, so we wrap it here instead
export const StatisticsTable: React.FC<StatisticsTableProps> = ({ data }) => (
    <RosterOptions data={data} component={StatisticsView} />
);
