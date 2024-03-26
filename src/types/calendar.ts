import { type BasicEvent } from '@/types/events';
import { type BasicTrainingSession } from '@/types/training';

export type Calendar = {
    events: BasicEvent[];
    sessions: BasicTrainingSession[];
}
