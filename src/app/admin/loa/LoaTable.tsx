'use client';

import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { LuChevronDown, LuMessageCircle, LuX } from 'react-icons/lu';
import { format } from 'date-fns-tz';
import { Tooltip } from 'react-tooltip';
import ReactDOM from 'react-dom';
import { ProfilePicture } from '@/components/ProfilePicture';
import { dataTableStyle } from '@/utils/dataTableStyle';
import type { LeaveOfAbsence } from '@/types/loa';
import { CancelLoaModal } from './CancelLoaModal';

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
                        cell: (loa) => <ProfilePicture user={loa.user} size={30} />,
                        width: '40px',
                        compact: true,
                        right: true,
                    },
                    {
                        name: 'Controller',
                        selector: (loa) => `${loa.user.first_name} ${loa.user.last_name}`,
                        sortable: true,
                    },
                    {
                        name: 'From',
                        selector: (loa) => loa.start,
                        sortable: true,
                        format: (loa) => format(new Date(loa.start), 'MMM d, y @ HH:mm zzz'),
                        sortFunction: (a, b) => a.start.localeCompare(b.start),
                    },
                    {
                        name: 'Until',
                        selector: (loa) => loa.end,
                        sortable: true,
                        format: (loa) => format(new Date(loa.end), 'MMM d, y @ HH:mm zzz'),
                        sortFunction: (a, b) => a.end.localeCompare(b.end),
                    },
                    {
                        name: 'Remarks',
                        button: true,
                        selector: (loa) => loa.remarks,
                        cell: (loa) => loa.remarks && (
                            <LuMessageCircle
                                size={20}
                                data-tooltip-id="remarks-tooltip"
                                data-tooltip-content={loa.remarks}
                            />
                        ),
                        width: '70px',
                    },
                    {
                        name: 'Cancel',
                        button: true,
                        cell: (loa) => (
                            <button
                                type="button"
                                onClick={() => {
                                    setCancelLoa(loa);
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
