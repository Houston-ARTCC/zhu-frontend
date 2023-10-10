import { type EventSourceInput } from '@fullcalendar/core';
import { type BasicEvent } from '@/types/events';
import { type BasicTrainingSession, SESSION_TYPE_STRING } from '@/types/training';
import { type ControllerBooking } from '@/types/connections';

export function eventSourceFromEvents(events: BasicEvent[]): EventSourceInput {
    return {
        events: events.map((event) => ({
            groupId: 'events',
            title: event.name,
            start: event.start,
            end: event.end,
        })),
        color: '#109CF1',
        backgroundColor: '#109CF1',
        borderColor: '#50b7ff',
        textColor: 'white',
    };
}

export function eventSourceFromSessions(sessions: BasicTrainingSession[]): EventSourceInput {
    return {
        events: sessions.map((session) => ({
            groupId: 'sessions',
            title: `${session.student.first_name} ${session.student.last_name}'s ${SESSION_TYPE_STRING[session.type]} Session`,
            start: session.start,
            end: session.end,
        })),
        color: '#F7685B',
        backgroundColor: '#F7685B',
        borderColor: '#ff6b5f',
        textColor: 'white',
    };
}

export function eventSourceFromBookings(bookings: ControllerBooking[]): EventSourceInput {
    return {
        events: bookings.map((booking) => ({
            groupId: 'bookings',
            title: `${booking.user.first_name} ${booking.user.last_name} on ${booking.callsign}`,
            start: booking.start,
            end: booking.end,
        })),
        color: '#2ED47A',
        backgroundColor: '#2ED47A',
        borderColor: '#40e98d',
        textColor: 'white',
    };
}
