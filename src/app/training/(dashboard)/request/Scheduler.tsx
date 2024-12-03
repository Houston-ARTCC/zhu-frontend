'use client';

import React, { useState } from 'react';
import { LuAlertCircle } from 'react-icons/lu';
import { TuiCalendar } from '@/components/Calendar';
import { ClientPortal } from '@/components/ClientPortal';
import { Alert, AlertTitle } from '@/components/Alert';
import { Button } from '@/components/Button';
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
                className="hidden sm:block"
                height="75vh"
                view="week"
                events={requests.map(eventObjectFromRequest)}
                week={{ taskView: false, eventView: ['time'] }}
                onSelectDateTime={({ start, end }) => {
                    setDateRange({ start, end });
                    setShowModal(true);
                }}
            />
            <Alert className="sm:hidden" color="amber-500" icon={LuAlertCircle}>
                <AlertTitle>Larger screen needed!</AlertTitle>
                <p className="mb-3">
                    Your device is too small to view the training scheduler.
                    We recommend switching to a larger device, or trying landscape mode.
                    Alternatively, you can request training without viewing the calendar.
                </p>
                <Button variant="secondary" color="red-400" onClick={() => setShowModal(true)}>
                    Proceed Anyway
                </Button>
            </Alert>
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
