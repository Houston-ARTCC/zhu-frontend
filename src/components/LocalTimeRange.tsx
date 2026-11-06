'use client';

import React, { useEffect, useState } from 'react';
import { isSameDay } from 'date-fns';
import { format } from 'date-fns-tz';

interface LocalTimeRangeProps {
    className?: string;
    start: string;
    end: string;
}

export const LocalTimeRange: React.FC<LocalTimeRangeProps> = ({ className, start, end }) => {
    const [range, setRange] = useState<string | null>(null);

    // Set after mount because the server can't know the viewer's timezone.
    useEffect(() => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (startDate.getTimezoneOffset() === 0) return;

        const endFormat = isSameDay(startDate, endDate) ? 'h:mm a zzz' : 'EEE, MMM d, h:mm a zzz';
        setRange(`${format(startDate, 'EEE, MMM d, h:mm a')} - ${format(endDate, endFormat)}`);
    }, [start, end]);

    if (!range) return null;

    return <span className={className}>{range}</span>;
};
