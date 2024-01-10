'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns-tz';
import DataTable from 'react-data-table-component';
import { LuCheck, LuChevronDown } from 'react-icons/lu';
import { addMonths, getQuarter, startOfQuarter } from 'date-fns';
import classNames from 'classnames';
import { RosterOptions } from '@/components/RosterOptions';
import { ProfilePicture } from '@/components/ProfilePicture';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { durationToSeconds } from '@/utils/time';
import type { Statistics, UserStatistic } from '@/types/connections';

interface StatisticsViewProps {
    data: UserStatistic[];
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ data }) => {
    const router = useRouter();

    return (
        <DataTable
            data={data}
            defaultSortFieldId={2}
            sortIcon={<LuChevronDown />}
            highlightOnHover
            pointerOnHover
            onRowClicked={(row) => router.push(`/roster/${row.cid}`)}
            customStyles={dataTableStyle}
            columns={[
                {
                    cell: (user) => <ProfilePicture user={user} size={30} />,
                    width: '40px',
                    compact: true,
                    right: true,
                },
                {
                    name: 'Controller',
                    selector: (user) => `${user.first_name} ${user.last_name}`,
                    sortable: true,
                    sortFunction: (a, b) => a.first_name.localeCompare(b.first_name) || a.last_name.localeCompare(b.last_name),
                    format: (user) => `${user.first_name} ${user.last_name} (${user.initials})`,
                    width: '300px',
                },
                { selector: (user) => user.cid, width: '90px' },
                { selector: (user) => user.rating },
                {
                    name: format(startOfQuarter(new Date()), 'MMMM'),
                    selector: (user) => user.month_1_hours ?? '',
                    sortable: true,
                    sortFunction: (a, b) => durationToSeconds(a.month_1_hours) - durationToSeconds(b.month_1_hours),
                    width: '110px',
                    right: true,
                    style: { fontFamily: 'monospace' },
                },
                {
                    name: format(addMonths(startOfQuarter(new Date()), 1), 'MMMM'),
                    selector: (user) => user.month_2_hours ?? '',
                    sortable: true,
                    sortFunction: (a, b) => durationToSeconds(a.month_2_hours) - durationToSeconds(b.month_2_hours),
                    width: '110px',
                    right: true,
                    style: { fontFamily: 'monospace' },
                },
                {
                    name: format(addMonths(startOfQuarter(new Date()), 2), 'MMMM'),
                    selector: (user) => user.month_3_hours ?? '',
                    sortable: true,
                    sortFunction: (a, b) => durationToSeconds(a.month_3_hours) - durationToSeconds(b.month_3_hours),
                    width: '110px',
                    right: true,
                    style: { fontFamily: 'monospace' },
                },
                {
                    name: `Quarter ${getQuarter(new Date())} Total`,
                    selector: (user) => user.quarter_hours ?? '',
                    sortable: true,
                    sortFunction: (a, b) => durationToSeconds(a.quarter_hours) - durationToSeconds(b.quarter_hours),
                    cell: (user) => (
                        <div className={classNames('flex', { 'text-green-500': user.quarter_active })}>
                            {user.quarter_active && <LuCheck size={20} />}
                            <p className="w-12 text-right">{user.quarter_hours}</p>
                        </div>
                    ),
                    width: '160px',
                    right: true,
                    style: { fontFamily: 'monospace' },
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
