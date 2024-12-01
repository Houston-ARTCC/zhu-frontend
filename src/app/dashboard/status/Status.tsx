'use client';

import React from 'react';
import { format } from 'date-fns-tz';
import { addQuarters, isEqual, startOfQuarter, subQuarters } from 'date-fns';
import { LuAlertCircle, LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import { Button } from '@/components/Button';
import { Alert, AlertTitle } from '@/components/Alert';
import { useStatistics } from '@/utils/useStatistics';
import type { UserStatusStatistics } from '@/types/connections';
import { StatusBreakdown } from './StatusBreakdown';

interface StatusProps {
    initialData: UserStatusStatistics;
}

export const Status: React.FC<StatusProps> = ({ initialData }) => {
    const { loading, data, currentDate, setCurrentDate } = useStatistics(
        (key) => `/connections/statistics/status/${key}/`,
        initialData,
    );

    const isCurrentQuarter = isEqual(startOfQuarter(currentDate), startOfQuarter(new Date()));

    return (
        <>
            {!isCurrentQuarter && (
                <Alert color="amber-500" icon={LuAlertCircle}>
                    <AlertTitle>Warning</AlertTitle>
                    <p>
                        The data you are currently viewing is from a previous quarter, but is not representative of your
                        activity status during that quarter! The status below is determined by your <b>current</b> endorsements
                        and rating, and <b>not</b> your historical endorsements and rating.
                    </p>
                </Alert>
            )}
            <div className="flex justify-between">
                <h2 className="text-center text-3xl">
                    {format(currentDate, 'yyyy, \'Quarter\' Q')}
                </h2>
                <div className="flex justify-center gap-3">
                    <Button
                        variant="secondary"
                        className="gap-1"
                        onClick={() => setCurrentDate((date) => subQuarters(date, 1))}
                    >
                        <LuArrowLeft />
                        Prev
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setCurrentDate(new Date())}
                    >
                        Today
                    </Button>
                    <Button
                        variant="secondary"
                        className="gap-1"
                        disabled={isCurrentQuarter}
                        onClick={() => setCurrentDate((date) => addQuarters(date, 1))}
                    >
                        Next
                        <LuArrowRight />
                    </Button>
                </div>
            </div>
            <hr className="my-5" />
            <StatusBreakdown
                currentDate={currentDate}
                status={loading ? undefined : data}
            />
        </>
    );
};
