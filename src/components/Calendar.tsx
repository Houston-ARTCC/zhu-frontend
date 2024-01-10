'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import ToastCalendar from '@toast-ui/react-calendar';
import type { Options } from '@toast-ui/calendar/types/types/options';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import type { EventObject, ExternalEventTypes } from '@toast-ui/calendar';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { eventObjectFromBooking, eventObjectFromEvent, eventObjectFromSession, tuiCalendars, tuiTheme, tuiTimezones } from '@/utils/calendar';
import type { Calendar } from '@/types/calendar';

type ReactCalendarOptions = Omit<Options, 'defaultView'>;
type CalendarView = Required<Options>['defaultView'];
type CalendarExternalEventNames = Extract<keyof ExternalEventTypes, string>;
type ReactCalendarEventNames = `on${Capitalize<CalendarExternalEventNames>}`;
type ReactCalendarEventHandler = ExternalEventTypes[CalendarExternalEventNames];
type ReactCalendarExternalEvents = { [events in ReactCalendarEventNames]: ReactCalendarEventHandler; };

type TuiCalendarProps = ReactCalendarOptions & ReactCalendarExternalEvents & {
    height: string;
    events?: Partial<EventObject>[];
    view?: CalendarView;
};

export const TuiCalendar: React.FC<TuiCalendarProps> = ({ events, ...props }) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const dateKey = useMemo(() => `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}`, [currentDate]);

    const calendarRef = useRef<ToastCalendar>(null);

    const eventMap = useRef<Map<string, EventObject[]>>(new Map());

    useEffect(() => {
        const calendar = calendarRef.current?.getInstance();

        if (calendar && eventMap.current.has(dateKey)) {
            calendar.clear();
            calendar.createEvents(eventMap.current.get(dateKey) ?? []);
            calendar.createEvents(events ?? []);
            return;
        }

        fetchApi<Calendar>(`/calendar/${dateKey}/`)
            .then((data) => {
                const newEvents = data.events.map(eventObjectFromEvent)
                    .concat(data.sessions.map(eventObjectFromSession))
                    .concat(data.bookings.map(eventObjectFromBooking));

                if (calendar) {
                    calendar.clear();
                    calendar.createEvents(newEvents);
                    calendar.createEvents(events ?? []);
                }

                eventMap.current.set(dateKey, newEvents);
            });
    }, [events, dateKey, calendarRef]);

    return (
        <div>
            <div className="flex justify-between">
                <h2 className="mb-5 text-center text-3xl">
                    {format(currentDate, 'MMMM y')}
                </h2>
                <div className="mb-5 flex justify-center gap-3">
                    <Button
                        variant="secondary"
                        className="gap-1"
                        onClick={() => {
                            const calendar = calendarRef.current?.getInstance();
                            if (calendar) {
                                calendar.prev();
                                setCurrentDate(calendar.getDate().toDate());
                            }
                        }}
                    >
                        <LuArrowLeft />
                        Prev
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            const calendar = calendarRef.current?.getInstance();
                            if (calendar) {
                                calendar.today();
                                setCurrentDate(calendar.getDate().toDate());
                            }
                        }}
                    >
                        Today
                    </Button>
                    <Button
                        variant="secondary"
                        className="gap-1"
                        onClick={() => {
                            const calendar = calendarRef.current?.getInstance();
                            if (calendar) {
                                calendar.next();
                                setCurrentDate(calendar.getDate().toDate());
                            }
                        }}
                    >
                        Next
                        <LuArrowRight />
                    </Button>
                </div>
            </div>
            <ToastCalendar
                ref={calendarRef}
                usageStatistics={false}
                calendars={tuiCalendars}
                timezone={tuiTimezones}
                theme={tuiTheme}
                {...props}
            />
        </div>
    );
};
