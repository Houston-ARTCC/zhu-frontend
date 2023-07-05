import React from 'react';
import DataTable from 'react-data-table-component';
import { LuChevronDown, LuCircle } from 'react-icons/lu';
import classNames from 'classnames';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { type User } from '@/types/users';
import { ratingToInt } from '@/utils';

const CERT_COLOR = ['fill-slate-300', 'fill-amber-400', 'fill-green-400', 'fill-red-400'];

interface CertificationProps {
    level: 0 | 1 | 2 | 3;
}

const Certification: React.FC<CertificationProps> = ({ level }) => (
    <LuCircle size={20} className={classNames('stroke-none', CERT_COLOR[level])} />
);

interface TableViewProps {
    data: User[];
}

export const TableView: React.FC<TableViewProps> = ({ data }) => (
    <DataTable
        data={data}
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
                width: '180px',
            },
            {
                name: 'Rating',
                selector: (row) => row.rating.short,
                sortFunction: (a, b) => (ratingToInt(a.rating.short) > ratingToInt(b.rating.short) ? 1 : -1),
                sortable: true,
                width: '150px',
            },
            {
                name: 'DEL',
                selector: (row) => row.del_cert,
                sortable: true,
                sortFunction: (a, b) => (a.del_cert > b.del_cert ? 1 : -1),
                cell: (row) => <Certification level={row.del_cert} />,
                width: '120px',
                center: true,
            },
            {
                name: 'GND',
                selector: (row) => row.gnd_cert,
                sortable: true,
                sortFunction: (a, b) => (a.gnd_cert > b.gnd_cert ? 1 : -1),
                cell: (row) => <Certification level={row.gnd_cert} />,
                width: '120px',
                center: true,
            },
            {
                name: 'TWR',
                selector: (row) => row.twr_cert,
                sortable: true,
                sortFunction: (a, b) => (a.twr_cert > b.twr_cert ? 1 : -1),
                cell: (row) => <Certification level={row.twr_cert} />,
                width: '120px',
                center: true,
            },
            {
                name: 'APP',
                selector: (row) => row.app_cert,
                sortable: true,
                sortFunction: (a, b) => (a.app_cert > b.app_cert ? 1 : -1),
                cell: (row) => <Certification level={row.app_cert} />,
                width: '120px',
                center: true,
            },
            {
                name: 'CTR',
                selector: (row) => row.ctr_cert,
                sortable: true,
                sortFunction: (a, b) => (a.ctr_cert > b.ctr_cert ? 1 : -1),
                cell: (row) => <Certification level={row.ctr_cert} />,
                width: '120px',
                center: true,
            },
            {
                name: 'OCN',
                selector: (row) => row.ocn_cert,
                sortable: true,
                sortFunction: (a, b) => (a.ocn_cert > b.ocn_cert ? 1 : -1),
                cell: (row) => <Certification level={row.ocn_cert} />,
                width: '120px',
                center: true,
            },
        ]}
    />
);
