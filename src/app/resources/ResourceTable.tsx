'use client';

import React, { useState } from 'react';
import { LuChevronDown, LuFileEdit } from 'react-icons/lu';
import { format } from 'date-fns-tz';
import DataTable from 'react-data-table-component';
import { useSession } from 'next-auth/react';
import { ClientPortal } from '@/components/ClientPortal';
import { dataTableStyle } from '@/utils/dataTableStyle';
import { type Resource } from '@/types/resources';
import { ResourceModal } from './ResourceModal';

interface ResourceTableProps {
    data: Resource[];
}

export const ResourceTable: React.FC<ResourceTableProps> = ({ data }) => {
    const { data: session } = useSession();

    const [showEditResource, setShowEditResource] = useState<boolean>(false);
    const [editResource, setEditResource] = useState<Resource | undefined>();

    return (
        <>
            <DataTable
                data={data}
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                defaultSortFieldId={1}
                defaultSortAsc={false}
                sortIcon={<LuChevronDown />}
                highlightOnHover
                pointerOnHover
                onRowClicked={(row) => window.open(process.env.NEXT_PUBLIC_API_URL + row.path, '_blank')}
                customStyles={dataTableStyle}
                columns={[
                    {
                        name: 'Name',
                        selector: (row) => row.name,
                        sortable: true,
                    },
                    {
                        name: 'Extension',
                        selector: (row) => row.extension,
                        sortable: true,
                    },
                    {
                        name: 'Size',
                        selector: (row) => row.size,
                        sortable: true,
                    },
                    {
                        name: 'Updated',
                        selector: (row) => row.updated,
                        sortable: true,
                        sortFunction: (a, b) => a.updated.localeCompare(b.updated),
                        format: (row) => format(new Date(row.updated), 'MMM d, y'),
                    },
                    {
                        button: true,
                        cell: (row) => (
                            <button
                                className="p-3"
                                type="button"
                                aria-label="edit"
                                onClick={() => {
                                    setEditResource(row);
                                    setShowEditResource(true);
                                }}
                            >
                                <LuFileEdit size={20} />
                            </button>
                        ),
                        omit: !session?.user.permissions.is_staff,
                    },
                ]}
            />
            <ClientPortal>
                <ResourceModal
                    show={showEditResource}
                    resource={editResource}
                    close={() => setShowEditResource(false)}
                    onClose={() => setEditResource(undefined)}
                />
            </ClientPortal>
        </>
    );
};
