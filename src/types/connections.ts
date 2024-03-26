import { type BasicUser, type Endorsements, type Roster } from '@/types/users';

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

export type UserStatistic = BasicUser & {
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
    t1_hours?: string;
    t1_active: boolean;
    training_hours?: string;
    training_active: boolean;
};

export type UserStatusStatistics = AdminUserStatistic & {
    endorsements: Endorsements;
    quarter_quota: string;
    hou_gnd_hours?: string;
    hou_twr_hours?: string;
    iah_gnd_hours?: string;
    iah_twr_hours?: string;
    i90_hours?: string;
    zhu_hours?: string;
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
