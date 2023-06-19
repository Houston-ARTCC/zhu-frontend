import { type BasicUser } from '@/types/users';

export type Announcement = {
    id: number;
    author: BasicUser;
    title: string;
    body: string;
    posted: string;
};
