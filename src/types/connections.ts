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
    initials: string;
    rating: string;
    month_1_hours?: string;
    month_2_hours?: string;
    month_3_hours?: string;
    quarter_hours?: string;
    quarter_active: boolean;
};

export type Statistics = Roster<UserStatistic>;

export type AdminUserStatistic = UserStatistic & {
    is_staff: boolean;
    quarter_hou_t1_hours?: string;
    quarter_iah_t1_hours?: string;
    quarter_i90_t1_hours?: string;
    quarter_t1_hours?: string;
    quarter_t1_active: boolean;
    training_hours?: string;
    training_active: boolean;
};

export type AdminStatistics = Roster<AdminUserStatistic>;


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
