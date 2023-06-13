import { type Event } from '@/types/api/events';

export type Feedback = {
    id: number;
    controller_callsign?: string;
    pilot_callsign?: string;
    rating: number;
    comments: string;
    event?: Event;
    created: string;
}
