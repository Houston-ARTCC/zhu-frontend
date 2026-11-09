'use client';

import React from 'react';
import CalendarHeatmap, { type TooltipDataAttrs } from 'react-calendar-heatmap';
import { endOfYear, format, parseISO, startOfYear } from 'date-fns';
import { Tooltip } from 'react-tooltip';
import { type DailyStatistic } from '@/types/connections';

const cellColor = (value: number): string => {
    if (value > 90) return 'fill-heatmap-900 dark:fill-heatmap-50';
    if (value > 80) return 'fill-heatmap-800 dark:fill-heatmap-100';
    if (value > 70) return 'fill-heatmap-700 dark:fill-heatmap-200';
    if (value > 60) return 'fill-heatmap-600 dark:fill-heatmap-300';
    if (value > 50) return 'fill-heatmap-500 dark:fill-heatmap-400';
    if (value > 40) return 'fill-heatmap-400 dark:fill-heatmap-500';
    if (value > 30) return 'fill-heatmap-300 dark:fill-heatmap-600';
    if (value > 20) return 'fill-heatmap-200 dark:fill-heatmap-700';
    if (value > 10) return 'fill-heatmap-100 dark:fill-heatmap-800';
    if (value > 0) return 'fill-heatmap-50 dark:fill-heatmap-900';
    return 'fill-gray-200 dark:fill-zinc-700';
};

interface HeatmapProps {
    data: DailyStatistic[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ data }) => (
    <>
        <CalendarHeatmap
            gutterSize={2}
            startDate={startOfYear(new Date())}
            endDate={endOfYear(new Date())}
            // Local dates, since the heatmap reads date strings as UTC midnight, a day early in US time zones.
            values={data.map((day) => ({ ...day, date: parseISO(day.date) }))}
            classForValue={(cell) => cellColor(cell?.count ?? 0)}
            tooltipDataAttrs={(value) => (
                value?.count
                    ? { 'data-date': format(value.date, 'yyyy-MM-dd'), 'data-hours': value.count.toFixed(2) } as TooltipDataAttrs
                    : {}
            )}
        />
        <Tooltip
            anchorSelect="rect[data-date]"
            render={({ activeAnchor }) => (
                <><b>{activeAnchor?.getAttribute('data-date')}:</b> {activeAnchor?.getAttribute('data-hours')} hours</>
            )}
        />
    </>
);
