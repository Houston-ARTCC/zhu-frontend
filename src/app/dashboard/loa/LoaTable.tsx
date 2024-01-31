'use client';

import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { LuCheckCircle2, LuChevronDown, LuMessageCircle, LuX } from 'react-icons/lu';
import { format } from 'date-fns-tz';
import { Tooltip } from 'react-tooltip';
import ReactDOM from 'react-dom';
import { CancelLoaModal } from '@/app/dashboard/loa/CancelLoaModal';
import { dataTableStyle } from '@/utils/dataTableStyle';
import type { LeaveOfAbsence } from '@/types/loa';

interface PendingRequestsTableProps {
    data: LeaveOfAbsence[];
}

export const LoaTable: React.FC<PendingRequestsTableProps> = ({ data }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [cancelLoa, setCancelLoa] = useState<LeaveOfAbsence | undefined>(undefined);

    return (
        <>
            <DataTable
                data={data}
                defaultSortFieldId={2}
                sortIcon={<LuChevronDown />}
                customStyles={dataTableStyle}
                columns={[
                    {
                        name: 'Approved',
                        selector: (row) => row.approved,
                        cell: (row) => row.approved && (
                            <LuCheckCircle2
                                size={20}
                                className="text-green-400"
                            />
                        ),
                        center: true,
                        width: '100px',
                    },
                    {
                        name: 'From',
                        selector: (row) => row.start,
                        sortable: true,
                        format: (row) => format(new Date(row.start), 'MMM d, y @ HH:mm zzz'),
                        sortFunction: (a, b) => a.start.localeCompare(b.start),
                    },
                    {
                        name: 'Until',
                        selector: (row) => row.end,
                        sortable: true,
                        format: (row) => format(new Date(row.end), 'MMM d, y @ HH:mm zzz'),
                        sortFunction: (a, b) => a.end.localeCompare(b.end),
                    },
                    {
                        name: 'Remarks',
                        button: true,
                        selector: (row) => row.remarks,
                        cell: (row) => row.remarks && (
                            <LuMessageCircle
                                size={20}
                                data-tooltip-id="remarks-tooltip"
                                data-tooltip-content={row.remarks}
                            />
                        ),
                        width: '70px',
                    },
                    {
                        name: 'Cancel',
                        button: true,
                        cell: (row) => (
                            <button
                                type="button"
                                onClick={() => {
                                    setCancelLoa(row);
                                    setShowModal(true);
                                }}
                                aria-label="Cancel Request"
                            >
                                <LuX size={20} />
                            </button>
                        ),
                        width: '70px',
                    },
                ]}
            />
            <Tooltip id="remarks-tooltip" className="max-w-lg" />
            {ReactDOM.createPortal(
                <CancelLoaModal
                    loa={cancelLoa}
                    show={showModal}
                    close={() => setShowModal(false)}
                    onClose={() => setCancelLoa(undefined)}
                />,
                document.body,
            )}
        </>
    );
};
