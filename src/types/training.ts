import { type BasicUser } from '@/types/users';

export enum SessionType {
    Classroom,
    Sweatbox,
    Online,
    OTS,
}

export const SESSION_TYPE_STRING = {
    [SessionType.Classroom]: 'Classroom',
    [SessionType.Sweatbox]: 'Sweatbox',
    [SessionType.Online]: 'Online',
    [SessionType.OTS]: 'OTS',
};

export enum SessionLevel {
    MinorGround,
    MajorGround,
    MinorTower,
    MajorTower,
    MinorApproach,
    MajorApproach,
    Center,
}

export const SESSION_LEVEL_STRING = {
    [SessionLevel.MinorGround]: 'Minor Ground',
    [SessionLevel.MajorGround]: 'Major Ground',
    [SessionLevel.MinorTower]: 'Minor Tower',
    [SessionLevel.MajorTower]: 'Major Tower',
    [SessionLevel.MinorApproach]: 'Minor Approach',
    [SessionLevel.MajorApproach]: 'Major Approach',
    [SessionLevel.Center]: 'Center',
};

export enum SessionStatus {
    Scheduled,
    Completed,
    Cancelled,
    NoShow,
}

export enum SessionOTSStatus {
    NonOTS,
    Passed,
    Failed,
    Recommended,
}

export type BasicTrainingSession = {
    id: number;
    student: BasicUser;
    start: string;
    end: string;
    position: string | null;
    type: SessionType;
    level: SessionLevel;
}

export type TrainingSession = BasicTrainingSession & {
    instructor: BasicUser;
    movements: number;
    progress: number;
    status: SessionStatus;
    ots_status: SessionOTSStatus;
    notes: string | null;
    solo_granted: boolean;
}

export type TrainingRequest = {
    id: number;
    start: string;
    end: string;
    type: SessionType;
    level: SessionLevel;
    remarks: string;
}

export type UserTrainingRequests = {
    user: BasicUser;
    requests: TrainingRequest[];
    last_session: string | null;
}

export type AvailabilitySlot = {
    id: number;
    user: BasicUser;
    day: number;
    start: string;
    end: string;
}

export type TrainingNotifications = {
    scheduled_sessions: number;
    training_requests: number;
    instructor_sessions: number;
}
