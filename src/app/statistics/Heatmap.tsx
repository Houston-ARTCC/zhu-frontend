'use client';

import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { endOfYear, startOfYear, subDays } from 'date-fns';
import { Tooltip } from 'react-tooltip';
import { type DailyStatistic } from '@/types/connections';
import 'react-calendar-heatmap/dist/styles.css';

const cellColor = (value: number): string => {
    if (value > 90) return 'fill-[#334d6e]';
    if (value > 80) return 'fill-[#3e6184]';
    if (value > 70) return 'fill-[#497599]';
    if (value > 60) return 'fill-[#558bad]';
    if (value > 50) return 'fill-[#6c9eb8]';
    if (value > 40) return 'fill-[#82b0c2]';
    if (value > 30) return 'fill-[#98c0cc]';
    if (value > 20) return 'fill-[#aed0d7]';
    if (value > 10) return 'fill-[#c4dee1]';
    if (value > 0) return 'fill-[#daebec]';
    return 'fill-[#f0f0f0]';
};

interface HeatmapProps {
    data: DailyStatistic[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ data }) => (
    <>
        <CalendarHeatmap
            gutterSize={1.5}
            startDate={subDays(startOfYear(new Date()), 2)}
            endDate={endOfYear(new Date())}
            values={data}
            classForValue={(cell: DailyStatistic | null) => cellColor(cell?.count ?? 0)}
            tooltipDataAttrs={(value: DailyStatistic) => (
                value.count
                    ? { 'data-tooltip-html': `<b>${value.date}:</b> ${value.count.toFixed(2)} hours` }
                    : {}
            )}
        />
        <Tooltip anchorSelect="rect" />
    </>
);
