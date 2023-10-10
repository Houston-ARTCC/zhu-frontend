'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { type NextPage } from 'next';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { type EventSourceInput } from '@fullcalendar/core';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import { format } from 'date-fns';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import { Button } from '@/components/Button';
import { fetchApi } from '@/utils/fetch';
import { eventSourceFromBookings, eventSourceFromEvents, eventSourceFromSessions } from '@/utils/calendar';
import { type Calendar } from '@/types/calendar';

const Calendar: NextPage = () => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const dateKey = useMemo(() => `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}`, [currentDate]);

    const calendarRef = useRef<FullCalendar>(null);

    const events = useRef<Map<string, EventSourceInput[]>>(new Map());

    useEffect(() => {
        const calendarApi = calendarRef.current?.getApi();

        if (calendarApi && events.current.has(dateKey)) {
            calendarApi.removeAllEventSources();
            events.current.get(dateKey)?.forEach((eventSource) => (
                calendarApi.addEventSource(eventSource)
            ));

            return;
        }

        fetchApi<Calendar>(`/calendar/${dateKey}/`)
            .then((data) => {
                const sources = [
                    eventSourceFromEvents(data.events),
                    eventSourceFromSessions(data.sessions),
                    eventSourceFromBookings(data.bookings),
                ];

                if (calendarApi) {
                    calendarApi.removeAllEventSources();
                    sources.forEach((eventSource) => (
                        calendarApi.addEventSource(eventSource)
                    ));
                }

                events.current.set(dateKey, sources);
            });
    }, [dateKey, calendarRef]);

    return (
        <Page title="Calendar">
            <PageContent>
                <h2 className="mb-5 text-center text-3xl font-medium">
                    {format(currentDate, 'MMMM y')}
                </h2>
                <div className="mb-10 flex justify-center gap-3">
                    <Button
                        variant="secondary"
                        className="gap-1"
                        onClick={() => {
                            if (calendarRef.current) {
                                const calendarApi = calendarRef.current.getApi();
                                calendarApi.prev();
                                setCurrentDate(calendarApi.getDate());
                            }
                        }}
                    >
                        <LuArrowLeft />
                        Prev
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            if (calendarRef.current) {
                                const calendarApi = calendarRef.current.getApi();
                                calendarApi.today();
                                setCurrentDate(calendarApi.getDate());
                            }
                        }}
                    >
                        Today
                    </Button>
                    <Button
                        variant="secondary"
                        className="gap-1"
                        onClick={() => {
                            if (calendarRef.current) {
                                const calendarApi = calendarRef.current.getApi();
                                calendarApi.next();
                                setCurrentDate(calendarApi.getDate());
                            }
                        }}
                    >
                        Next
                        <LuArrowRight />
                    </Button>
                </div>
                <FullCalendar
                    height="auto"
                    ref={calendarRef}
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    initialDate={currentDate}
                    headerToolbar={false}
                    fixedWeekCount={false}
                    showNonCurrentDates={false}
                />
            </PageContent>
        </Page>
    );
};

export default Calendar;
