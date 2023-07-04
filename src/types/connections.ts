import { type BasicUser } from '@/types/users';

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
    curr_hours: string;
    prev_hours: string;
    prev_prev_hours: string;
    activity_requirement: string;
};

export type Statistics = {
    home: UserStatistic[];
    visiting: UserStatistic[];
    mavp: UserStatistic[];
};

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
