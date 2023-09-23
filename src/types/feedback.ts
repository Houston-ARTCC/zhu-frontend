import { type Event } from '@/types/events';
import { type AuthenticatedBasicUser } from '@/types/users';

export type BasicFeedback = {
    id: number;
    controller_callsign?: string;
    pilot_callsign?: string;
    rating: number;
    comments: string;
    event?: Event;
    created: string;
}

export type Feedback = BasicFeedback & {
    controller?: AuthenticatedBasicUser;
    pilot: AuthenticatedBasicUser;
}
