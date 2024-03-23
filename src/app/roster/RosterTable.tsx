'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DataTable from 'react-data-table-component';
import { LuChevronDown } from 'react-icons/lu';
import { EndorsementBadge } from '@/app/roster/ProfileBadges';
import { ProfilePicture } from '@/components/ProfilePicture';
import { RosterOptions } from '@/components/RosterOptions';
import { dataTableStyle } from '@/utils/dataTableStyle';
import type { Roster, User } from '@/types/users';
import { ratingToInt } from '@/utils';

function sortMinor(a: User, b: User): number {
    if (a.endorsements.app && !b.endorsements.app) return 1;
    if (!a.endorsements.app && b.endorsements.app) return -1;
    if (a.endorsements.twr && !b.endorsements.twr) return 1;
    if (!a.endorsements.twr && b.endorsements.twr) return -1;
    if (a.endorsements.gnd && !b.endorsements.gnd) return 1;
    if (!a.endorsements.gnd && b.endorsements.gnd) return -1;
    return 0;
}

function sortHOU(a: User, b: User): number {
    if (a.endorsements.hou_twr && !b.endorsements.hou_twr) return 1;
    if (!a.endorsements.hou_twr && b.endorsements.hou_twr) return -1;
    if (a.endorsements.hou_gnd && !b.endorsements.hou_gnd) return 1;
    if (!a.endorsements.hou_gnd && b.endorsements.hou_gnd) return -1;
    return sortMinor(a, b);
}

function sortIAH(a: User, b: User): number {
    if (a.endorsements.iah_twr && !b.endorsements.iah_twr) return 1;
    if (!a.endorsements.iah_twr && b.endorsements.iah_twr) return -1;
    if (a.endorsements.iah_gnd && !b.endorsements.iah_gnd) return 1;
    if (!a.endorsements.iah_gnd && b.endorsements.iah_gnd) return -1;
    return sortHOU(a, b);
}

function sortI90(a: User, b: User): number {
    if (a.endorsements.i90_app && !b.endorsements.i90_app) return 1;
    if (!a.endorsements.i90_app && b.endorsements.i90_app) return -1;
    return sortIAH(a, b);
}

function sortZHU(a: User, b: User): number {
    if (a.endorsements.zhu && !b.endorsements.zhu) return 1;
    if (!a.endorsements.zhu && b.endorsements.zhu) return -1;
    return sortI90(a, b);
}

interface RosterViewProps {
    data: User[];
}

export const RosterView: React.FC<RosterViewProps> = ({ data }) => {
    const router = useRouter();

    return (
        <DataTable
            data={data}
            defaultSortFieldId={9}
            defaultSortAsc={false}
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
                    name: 'Name',
                    selector: (user) => `${user.first_name} ${user.last_name}`,
                    sortable: true,
                    sortFunction: (a, b) => a.first_name.localeCompare(b.first_name) || a.last_name.localeCompare(b.last_name),
                    format: (user) => `${user.first_name} ${user.last_name} (${user.initials})`,
                    width: '250px',
                },
                {
                    name: 'CID',
                    selector: (user) => user.cid,
                    sortable: true,
                },
                {
                    name: 'Rating',
                    selector: (user) => user.rating.short,
                    sortFunction: (a, b) => ratingToInt(b.rating.short) - ratingToInt(a.rating.short),
                    sortable: true,
                },
                {
                    name: 'Minor',
                    sortable: true,
                    sortFunction: sortMinor,
                    cell: (user) => {
                        if (user.endorsements.app) return <EndorsementBadge tier={0} name="APP" status={user.endorsements.app} />;
                        if (user.endorsements.twr) return <EndorsementBadge tier={0} name="TWR" status={user.endorsements.twr} />;
                        return <EndorsementBadge tier={0} name="GND" status={user.endorsements.gnd} />;
                    },
                    width: '110px',
                    center: true,
                },
                {
                    name: 'HOU T1',
                    sortable: true,
                    sortFunction: sortHOU,
                    cell: (user) => {
                        if (user.endorsements.hou_twr) return <EndorsementBadge tier={1} name="HOU TWR" status={user.endorsements.hou_twr} />;
                        if (user.endorsements.hou_gnd) return <EndorsementBadge tier={1} name="HOU GND" status={user.endorsements.hou_gnd} />;
                        return <EndorsementBadge tier={1} name="HOU" status={false} />;
                    },
                    width: '110px',
                    center: true,
                },
                {
                    name: 'IAH T1',
                    sortable: true,
                    sortFunction: sortIAH,
                    cell: (user) => {
                        if (user.endorsements.iah_twr) return <EndorsementBadge tier={1} name="IAH TWR" status={user.endorsements.iah_twr} />;
                        if (user.endorsements.iah_gnd) return <EndorsementBadge tier={1} name="IAH GND" status={user.endorsements.iah_gnd} />;
                        return <EndorsementBadge tier={1} name="IAH" status={false} />;
                    },
                    width: '110px',
                    center: true,
                },
                {
                    name: 'I90 T1',
                    sortable: true,
                    sortFunction: sortI90,
                    cell: (user) => {
                        if (user.endorsements.i90_app) return <EndorsementBadge tier={1} name="I90 APP" status={user.endorsements.i90_app} />;
                        return <EndorsementBadge tier={1} name="I90" status={false} />;
                    },
                    width: '110px',
                    center: true,
                },
                {
                    name: 'ZHU',
                    sortable: true,
                    sortFunction: sortZHU,
                    cell: (user) => <EndorsementBadge tier={2} name="ZHU" status={user.endorsements.zhu} />,
                    width: '110px',
                    center: true,
                },
            ]}
        />
    );
};

interface RosterTableProps {
    data: Roster;
}

// We can't import `RosterView` inside the `page.tsx` server-side component, so we wrap it here instead
export const RosterTable: React.FC<RosterTableProps> = ({ data }) => (
    <RosterOptions data={data} component={RosterView} />
);
