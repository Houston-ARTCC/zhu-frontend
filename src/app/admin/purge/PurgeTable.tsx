'use client';

import React from 'react';
import { format } from 'date-fns-tz';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import { addQuarters, isEqual, startOfQuarter, subQuarters } from 'date-fns';
import { Button } from '@/components/Button';
import { RosterOptions } from '@/components/RosterOptions';
import type { AdminStatistics } from '@/types/connections';
import { useStatistics } from '../../../utils/useStatistics';
import { PurgeView } from './PurgeView';

interface StatisticsTableProps {
    initialData: AdminStatistics;
}

export const PurgeTable: React.FC<StatisticsTableProps> = ({ initialData }) => {
    const { loading, data, currentDate, setCurrentDate } = useStatistics(
        (key) => `/connections/statistics/admin/${key}/`,
        initialData,
    );

    if (!data) {
        return null;
    }

    return (
        <>
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
                        disabled={isEqual(startOfQuarter(currentDate), startOfQuarter(new Date()))}
                        onClick={() => setCurrentDate((date) => addQuarters(date, 1))}
                    >
                        Next
                        <LuArrowRight />
                    </Button>
                </div>
            </div>
            <hr className="my-5" />
            <RosterOptions
                data={data}
                component={PurgeView}
                loading={loading}
                currentDate={currentDate}
            />
        </>
    );
};
