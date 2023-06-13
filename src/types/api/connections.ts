import { type BasicUser } from '@/types/api/users';

export type Session = {
    id: number;
    callsign: string;
    start: string;
    duration: string;
}

export type DailyStatistic = {
    date: string;
    count: number;
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
