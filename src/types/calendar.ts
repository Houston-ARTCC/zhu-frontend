import { type BasicEvent } from '@/types/events';
import { type BasicTrainingSession } from '@/types/training';
import { type ControllerBooking } from '@/types/connections';

export type Calendar = {
    events: BasicEvent[];
    sessions: BasicTrainingSession[];
    bookings: ControllerBooking[];
}
