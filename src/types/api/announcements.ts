import { type BasicUser } from '@/types/api/users';

export type Announcement = {
    id: number;
    author: BasicUser;
    title: string;
    body: string;
    posted: string;
};
