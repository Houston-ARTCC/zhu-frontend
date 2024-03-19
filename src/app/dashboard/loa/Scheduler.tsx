'use client';

import React, { useState } from 'react';
import { TuiCalendar } from '@/components/Calendar';
import { ClientPortal } from '@/components/ClientPortal';
import { RequestLoaModal } from './RequestLoaModal';

export const Scheduler: React.FC = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<{ start: Date, end: Date } | undefined>();

    return (
        <>
            <TuiCalendar
                height="75vh"
                view="month"
                onSelectDateTime={({ start, end }) => {
                    setDateRange({ start, end });
                    setShowModal(true);
                }}
            />
            <ClientPortal>
                <RequestLoaModal
                    {...dateRange}
                    show={showModal}
                    close={() => setShowModal(false)}
                    onClose={() => setDateRange(undefined)}
                />
            </ClientPortal>
        </>
    );
};
