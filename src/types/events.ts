import { type BasicUser } from '@/types/users';

export type BasicEvent = {
    id: number;
    name: string;
    banner: string;
    start: string;
    end: string;
    host: string;
    hidden: boolean;
    archived: boolean;
    available_shifts: number;
};

export type EventShiftRequest = {
    id: number;
    user: BasicUser;
};

export type EventShift = {
    id: number;
    user: BasicUser | null;
    start: string;
    end: string;
    requests: EventShiftRequest[];
};

export type EventPosition = {
    id: number;
    callsign: string;
    shifts: EventShift[];
};

export type Event = Omit<BasicEvent, 'available_shifts'> & {
    description: string;
    positions: {
        enroute: EventPosition[];
        tracon: EventPosition[];
        local: EventPosition[];
    };
};

export type EventScore = {
    event: BasicEvent;
    score: number;
    notes: {
        target_duration: number;
        total_duration: number;
        feedback: { rating: number }[];
    }
};

export type PresetPosition = {
    callsign: string;
    shifts: number;
}

export type PositionPreset = {
    id: number;
    name: string;
    positions: PresetPosition[];
}
