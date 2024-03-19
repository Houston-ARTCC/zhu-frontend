'use client';

import React, { useState } from 'react';
import { TuiCalendar } from '@/components/Calendar';
import type { SelectOption } from '@/components/Forms';
import { ClientPortal } from '@/components/ClientPortal';
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
                height="75vh"
                view="week"
                week={{ taskView: false, eventView: ['time'] }}
                onSelectDateTime={({ start, end }) => {
                    setDateRange({ start, end });
                    setShowModal(true);
                }}
            />
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
