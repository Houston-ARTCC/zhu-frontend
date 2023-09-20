'use client';

import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { endOfYear, startOfYear } from 'date-fns';
import { Tooltip } from 'react-tooltip';
import { type DailyStatistic } from '@/types/connections';
import 'react-calendar-heatmap/dist/styles.css';

const cellColor = (value: number): string => {
    if (value > 9) return 'fill-[#334d6e]';
    if (value > 8) return 'fill-[#3e6184]';
    if (value > 7) return 'fill-[#497599]';
    if (value > 6) return 'fill-[#558bad]';
    if (value > 5) return 'fill-[#6c9eb8]';
    if (value > 4) return 'fill-[#82b0c2]';
    if (value > 3) return 'fill-[#98c0cc]';
    if (value > 2) return 'fill-[#aed0d7]';
    if (value > 1) return 'fill-[#c4dee1]';
    if (value > 0) return 'fill-[#daebec]';
    return 'fill-[#f0f0f0]';
};

interface HeatmapProps {
    data: DailyStatistic[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ data }) => (
    <>
        <CalendarHeatmap
            gutterSize={3}
            startDate={startOfYear(new Date())}
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
