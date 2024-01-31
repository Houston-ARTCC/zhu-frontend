import type { BasicUser } from '@/types/users';

export type LeaveOfAbsence = {
    id: number;
    user: BasicUser;
    start: string;
    end: string;
    remarks: string;
    approved: boolean;
}
