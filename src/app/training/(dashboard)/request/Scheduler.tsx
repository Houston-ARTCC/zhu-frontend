'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { TuiCalendar } from '@/components/Calendar';
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
                events={requests.map(eventObjectFromRequest)}
                week={{ taskView: false, eventView: ['time'] }}
                onSelectDateTime={({ start, end }) => {
                    setDateRange({ start, end });
                    setShowModal(true);
                }}
            />
            {ReactDOM.createPortal(
                <RequestTrainingModal
                    {...dateRange}
                    show={showModal}
                    close={() => setShowModal(false)}
                    onClose={() => setDateRange(undefined)}
                />,
                document.body,
            )}
        </>
    );
};
