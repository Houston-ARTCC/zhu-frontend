import type { Event } from '@/components/Calendar';
import { type BasicTrainingSession, SESSION_TYPE_STRING, type TrainingRequest } from '@/types/training';
import type { BasicEvent } from '@/types/events';

export function calendarEventFromEvent(event: BasicEvent): Event {
    return {
        title: event.name,
        start: new Date(event.start),
        end: new Date(event.end),
        allDay: false,
        type: 'event',
    };
}

export function calendarEventFromSession(session: BasicTrainingSession): Event {
    return {
        title: `${session.student.first_name} ${session.student.last_name}'s ${SESSION_TYPE_STRING[session.type]} Session`,
        start: new Date(session.start),
        end: new Date(session.end),
        allDay: false,
        type: 'session',
    };
}

export function calendarEventFromRequest(request: TrainingRequest): Event {
    return {
        title: 'Training Request',
        start: new Date(request.start),
        end: new Date(request.end),
        allDay: false,
        type: 'request',
    };
}
