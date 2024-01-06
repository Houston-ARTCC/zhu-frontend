import { type BasicUser, Roster } from '@/types/users';

export type Session = {
    id: number;
    callsign: string;
    start: string;
    duration: string;
};

export type DailyStatistic = {
    date: string;
    count: number;
};

export type UserStatistic = {
    cid: number;
    first_name: string;
    last_name: string;
    rating: string;
    initials: string;
    is_staff: boolean;
    curr_hours: string;
    prev_hours: string;
    prev_prev_hours: string;
    activity_requirement: string;
};

export type Statistics = Roster<UserStatistic>;

export type AdminStatistics = {
    month: number;
    year: number;
}

export type OnlineConnection = {
    id: number;
    user: BasicUser;
    callsign: string;
    online_since: string;
    last_updated: string;
};

export type TopController = {
    first_name: string;
    last_name: string;
    hours: string;
};

export type TopPosition = {
    position: string;
    hours: string;
};

export type ControllerBooking = {
    id: number;
    user: BasicUser;
    callsign: string;
    start: string;
    end: string;
};
