import type { CalendarInfo, TimezoneOptions } from '@toast-ui/calendar/types/types/options';
import { format } from 'date-fns-tz';
import type { DeepPartial } from 'react-hook-form';
import type { ThemeState } from '@toast-ui/calendar/types/types/theme';
import type { EventObject } from '@toast-ui/calendar';
import { type BasicTrainingSession, SESSION_TYPE_STRING } from '@/types/training';
import type { BasicEvent } from '@/types/events';
import type { ControllerBooking } from '@/types/connections';

export const tuiCalendars: CalendarInfo[] = [
    {
        id: 'events',
        name: 'Events',
        bgColor: '#109CF1',
        borderColor: '#50b7ff',
    },
    {
        id: 'sessions',
        name: 'Training Sessions',
        bgColor: '#F7685B',
        borderColor: '#ff6b5f',
    },
    {
        id: 'requests',
        name: 'Training Requests',
        bgColor: '#b0b0b0',
        borderColor: '#949494',
    },
    {
        id: 'bookings',
        name: 'Controller Bookings',
        bgColor: '#2ED47A',
        borderColor: '#40e98d',
    },
];

export const tuiTimezones: TimezoneOptions = {
    zones: [
        {
            timezoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
            displayLabel: format(new Date(), 'zzz'),
            tooltip: 'Local',
        }, {
            timezoneName: 'UTC',
            displayLabel: 'UTC',
            tooltip: 'UTC',
        },
    ],
};

export const tuiTheme: DeepPartial<ThemeState> = {
    common: {
        gridSelection: {
            border: '1px solid #0ea5e9',
            backgroundColor: '#0ea5e910',
        },
        backgroundColor: 'transparent',
    },
    week: {
        timeGridLeft: {
            width: 100,
        },
        today: {
            backgroundColor: '#0ea5e910',
        },
        gridSelection: {
            color: '#0ea5e9',
        },
        nowIndicatorLabel: {
            color: '#0ea5e9',
        },
        nowIndicatorBullet: {
            backgroundColor: '#0ea5e9',
        },
        nowIndicatorPast: {
            border: '1px dashed #0ea5e9',
        },
        nowIndicatorToday: {
            border: '1px solid #0ea5e9',
        },
    },
};

export function eventObjectFromEvent(event: BasicEvent): EventObject {
    return {
        id: event.id.toString(),
        calendarId: 'events',
        title: event.name,
        location: event.host,
        category: 'time',
        isReadOnly: true,
        start: event.start,
        end: event.end,
    };
}

export function eventObjectFromSession(session: BasicTrainingSession): EventObject {
    return {
        id: session.id.toString(),
        calendarId: 'sessions',
        title: `${session.student.first_name} ${session.student.last_name}'s ${SESSION_TYPE_STRING[session.type]} Session`,
        location: session.position ?? 'N/A',
        category: 'time',
        isReadOnly: true,
        start: session.start,
        end: session.end,
    };
}

export function eventObjectFromBooking(booking: ControllerBooking): EventObject {
    return {
        id: booking.id.toString(),
        calendarId: 'bookings',
        title: `${booking.callsign} [${booking.user.first_name} ${booking.user.last_name}]`,
        location: booking.callsign,
        category: 'time',
        isReadOnly: true,
        start: booking.start,
        end: booking.end,
    };
}
