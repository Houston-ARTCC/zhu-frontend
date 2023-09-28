import { type BasicEvent } from '@/types/events';
import { type AuthenticatedBasicUser } from '@/types/users';

export type BasicFeedback = {
    id: number;
    controller_callsign?: string;
    pilot_callsign?: string;
    rating: number;
    comments: string;
    event?: BasicEvent;
    created: string;
}

export type Feedback = BasicFeedback & {
    controller?: AuthenticatedBasicUser;
    pilot: AuthenticatedBasicUser;
}
