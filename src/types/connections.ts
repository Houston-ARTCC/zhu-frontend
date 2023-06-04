import { BasicUser } from '@/types/users';

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
