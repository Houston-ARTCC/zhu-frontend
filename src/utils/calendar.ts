import type { CalendarInfo, TimezoneOptions } from '@toast-ui/calendar/types/types/options';
import { format } from 'date-fns-tz';
import type { DeepPartial } from 'react-hook-form';
import type { ThemeState } from '@toast-ui/calendar/types/types/theme';
import type { EventObject } from '@toast-ui/calendar';
import colors from 'tailwindcss/colors';
import { type BasicTrainingSession, SESSION_TYPE_STRING, type TrainingRequest } from '@/types/training';
import type { BasicEvent } from '@/types/events';
import type { ControllerBooking } from '@/types/connections';

export const tuiCalendars: CalendarInfo[] = [
    {
        id: 'events',
        name: 'Events',
        backgroundColor: colors.sky[400],
        borderColor: colors.sky[500],
    },
    {
        id: 'sessions',
        name: 'Training Sessions',
        backgroundColor: colors.red[400],
        borderColor: colors.red[500],
    },
    {
        id: 'requests',
        name: 'Training Requests',
        backgroundColor: colors.gray[400],
        borderColor: colors.gray[500],
    },
    {
        id: 'bookings',
        name: 'Controller Bookings',
        backgroundColor: colors.emerald[400],
        borderColor: colors.emerald[500],
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
        backgroundColor: 'transparent',
        gridSelection: {
            border: `1px solid ${colors.sky[500]}`,
            backgroundColor: `${colors.sky[500]}20`,
        },
    },
    week: {
        timeGridLeft: {
            width: 100,
        },
        today: {
            backgroundColor: `${colors.sky[400]}10`,
        },
        gridSelection: {
            color: colors.sky[500],
        },
        nowIndicatorLabel: {
            color: colors.sky[500],
        },
        nowIndicatorBullet: {
            backgroundColor: colors.sky[500],
        },
        nowIndicatorPast: {
            border: `1px dashed ${colors.sky[500]}`,
        },
        nowIndicatorToday: {
            border: `1px solid ${colors.sky[500]}`,
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

export function eventObjectFromRequest(request: TrainingRequest): EventObject {
    return {
        id: request.id.toString(),
        calendarId: 'requests',
        title: 'Training Request',
        category: 'time',
        isReadOnly: true,
        start: request.start,
        end: request.end,
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
