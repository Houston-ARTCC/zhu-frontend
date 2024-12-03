'use client';

import React, { useState } from 'react';
import { LuAlertCircle } from 'react-icons/lu';
import { TuiCalendar } from '@/components/Calendar';
import type { SelectOption } from '@/components/Forms';
import { ClientPortal } from '@/components/ClientPortal';
import { Alert, AlertTitle } from '@/components/Alert';
import { Button } from '@/components/Button';
import { NewEventModal } from './NewEventModal';

interface SchedulerProps {
    presets: SelectOption[];
}

export const Scheduler: React.FC<SchedulerProps> = ({ presets }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<{ start: Date, end: Date } | undefined>();

    return (
        <>
            <TuiCalendar
                className="hidden sm:block"
                height="75vh"
                view="week"
                week={{ taskView: false, eventView: ['time'] }}
                onSelectDateTime={({ start, end }) => {
                    setDateRange({ start, end });
                    setShowModal(true);
                }}
            />
            <Alert className="sm:hidden" color="amber-500" icon={LuAlertCircle}>
                <AlertTitle>Larger screen needed!</AlertTitle>
                <p className="mb-3">
                    Your device is too small to view the event scheduler.
                    We recommend switching to a larger device, or trying landscape mode.
                    Alternatively, you can create an event without viewing the calendar.
                </p>
                <Button variant="secondary" color="red-400" onClick={() => setShowModal(true)}>
                    Proceed Anyway
                </Button>
            </Alert>
            <ClientPortal>
                <NewEventModal
                    {...dateRange}
                    presets={presets}
                    show={showModal}
                    close={() => setShowModal(false)}
                    onClose={() => setDateRange(undefined)}
                />
            </ClientPortal>
        </>
    );
};
