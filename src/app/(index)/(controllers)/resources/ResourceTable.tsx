'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { LuChevronDown, LuFileEdit } from 'react-icons/lu';
import { format } from 'date-fns-tz';
import DataTable from 'react-data-table-component';
import { useSession } from 'next-auth/react';
import { ResourceModal } from '@/app/(index)/(controllers)/resources/ResourceModal';
import { type Resource } from '@/types/api/resources';

interface ResourceTableProps {
    data: Resource[];
}

export const ResourceTable: React.FC<ResourceTableProps> = ({ data }) => {
    const { data: session } = useSession();

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
                        sortFunction: (a, b) => (new Date(a.updated) > new Date(b.updated) ? 1 : -1),
                        format: (row) => format(new Date(row.updated), 'MMM d, y'),
                    },
                    {
                        button: true,
                        cell: (row) => (
                            <button
                                type="button"
                                aria-label="edit"
                                onClick={() => setEditResource(row)}
                            >
                                <LuFileEdit size={20} />
                            </button>
                        ),
                        omit: !session?.user.is_staff,
                    },
                ]}
            />
            {editResource && ReactDOM.createPortal(
                <ResourceModal
                    resource={editResource}
                    close={() => setEditResource(undefined)}
                />,
                document.body,
            )}
        </>
    );
};
