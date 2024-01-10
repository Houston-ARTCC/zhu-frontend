'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { TuiCalendar } from '@/components/Calendar';
import { RequestTrainingModal } from './RequestTrainingModal';

export const Scheduler: React.FC = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<{ start: Date, end: Date } | undefined>();

    return (
        <>
            <TuiCalendar
                height="1000px"
                week={{ taskView: false }}
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
