'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDay, format, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import * as rbc from 'react-big-calendar';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import classNames from 'classnames';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { calendarEventFromEvent, calendarEventFromSession } from '@/utils/calendar';
import type { Calendar as CalendarResponse } from '@/types/calendar';

export type Event = rbc.Event & {
    type: string;
};

const Toolbar: React.FC<rbc.ToolbarProps<Event>> = ({ label, onNavigate }) => (
    <div className="mb-5 flex flex-col justify-between gap-2 lg:flex-row">
        <h2 className="text-center text-3xl">
            {label}
        </h2>
        <div className="flex justify-center gap-3">
            <Button
                variant="secondary"
                className="gap-1"
                onClick={() => onNavigate(rbc.Navigate.PREVIOUS)}
            >
                <LuArrowLeft />
                Prev
            </Button>
            <Button
                variant="secondary"
                onClick={() => onNavigate(rbc.Navigate.TODAY)}
            >
                Today
            </Button>
            <Button
                variant="secondary"
                className="gap-1"
                onClick={() => onNavigate(rbc.Navigate.NEXT)}
            >
                Next
                <LuArrowRight />
            </Button>
        </div>
    </div>
);

const localizer = rbc.dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {
        'en-US': enUS,
    },
});

const eventPropGetter: rbc.EventPropGetter<Event> = (event) => ({
    className: classNames({
        'bg-sky-400 border-sky-500': event.type === 'event',
        'bg-red-400 border-red-500': event.type === 'session',
        'bg-gray-400 border-gray-500': event.type === 'request',
    }),
});

export type CalendarProps = Omit<rbc.CalendarProps, 'localizer'> & {
    className?: string;
    events?: Event[];
    view: rbc.View;
    onSelectDateTime?: (range: { start: Date, end: Date }) => void;
};

export const Calendar: React.FC<CalendarProps> = ({ className, events: eventsProp, view, onSelectDateTime }) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const [events, setEvents] = useState<Event[]>([]);

    const dateKey = useMemo(() => `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}`, [currentDate]);

    const eventCache = useRef<Map<string, Event[]>>(new Map());

    const onSelectSlot = useCallback((slotInfo: rbc.SlotInfo) => {
        if (onSelectDateTime) {
            onSelectDateTime({ start: slotInfo.start, end: slotInfo.end });
        }
    }, [onSelectDateTime]);

    useEffect(() => {
        if (eventCache.current.has(dateKey)) {
            setEvents([
                ...eventCache.current.get(dateKey) ?? [],
                ...(eventsProp ?? []),
            ]);

            return;
        }

        fetchApi<CalendarResponse>(`/calendar/${dateKey}/`)
            .then((data) => {
                const newEvents = data.events.map(calendarEventFromEvent)
                    .concat(data.sessions.map(calendarEventFromSession));

                setEvents([
                    ...newEvents,
                    ...(eventsProp ?? []),
                ]);

                eventCache.current.set(dateKey, newEvents);
            });
    }, [eventsProp, dateKey]);

    return (
        <div className={className}>
            <rbc.Calendar
                localizer={localizer}
                components={{ toolbar: Toolbar }}
                events={events}
                showAllEvents={true}
                showMultiDayTimes={true}
                eventPropGetter={eventPropGetter}
                selectable={'ignoreEvents'}
                view={view}
                views={[view]}
                onNavigate={(newDate) => setCurrentDate(newDate)}
                onSelectSlot={onSelectSlot}
            />
        </div>
    );
};
