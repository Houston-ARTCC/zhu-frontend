'use client';

import React, { useState } from 'react';
import { TuiCalendar } from '@/components/Calendar';
import { ClientPortal } from '@/components/ClientPortal';
import { eventObjectFromRequest } from '@/utils/calendar';
import { type TrainingRequest } from '@/types/training';
import { RequestTrainingModal } from './RequestTrainingModal';

interface SchedulerProps {
    requests: TrainingRequest[];
}

export const Scheduler: React.FC<SchedulerProps> = ({ requests }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<{ start: Date, end: Date } | undefined>();

    return (
        <>
            <TuiCalendar
                height="75vh"
                view="week"
                events={requests.map(eventObjectFromRequest)}
                week={{ taskView: false, eventView: ['time'] }}
                onSelectDateTime={({ start, end }) => {
                    setDateRange({ start, end });
                    setShowModal(true);
                }}
            />
            <ClientPortal>
                <RequestTrainingModal
                    {...dateRange}
                    show={showModal}
                    close={() => setShowModal(false)}
                    onClose={() => setDateRange(undefined)}
                />
            </ClientPortal>
        </>
    );
};
