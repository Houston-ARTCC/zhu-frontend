import { type BasicUser } from '@/types/users';

export type Announcement = {
    id: number;
    author: BasicUser | null;
    title: string;
    body: string;
    posted: string;
};
