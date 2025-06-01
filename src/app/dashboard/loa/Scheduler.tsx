'use client';

import React, { useState } from 'react';
import { LuCircleAlert } from 'react-icons/lu';
import { Calendar } from '@/components/Calendar';
import { ClientPortal } from '@/components/ClientPortal';
import { Alert, AlertTitle } from '@/components/Alert';
import { Button } from '@/components/Button';
import { RequestLoaModal } from './RequestLoaModal';

export const Scheduler: React.FC = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<{ start: Date, end: Date } | undefined>();

    return (
        <>
            <Calendar
                className="hidden lg:block h-[75vh]"
                view="month"
                onSelectDateTime={({ start, end }) => {
                    setDateRange({ start, end });
                    setShowModal(true);
                }}
            />
            <Alert className="lg:hidden" color="amber-500" icon={LuCircleAlert}>
                <AlertTitle>Larger screen needed!</AlertTitle>
                <p className="mb-3">
                    Your device is too small to view the LOA scheduler.
                    We recommend switching to a larger device, or trying landscape mode.
                    Alternatively, you can request an LOA without viewing the calendar.
                </p>
                <Button variant="secondary" color="red-400" onClick={() => setShowModal(true)}>
                    Proceed Anyway
                </Button>
            </Alert>
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
