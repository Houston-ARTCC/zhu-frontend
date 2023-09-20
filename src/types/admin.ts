import { type BasicUser } from '@/types/users';

export type LoaRequest = {
    id: number;
    user: BasicUser;
    start: string;
    end: string;
    remarks: string;
    approved: boolean;
}

export type AdminNotifications = {
    visiting_applications: number;
    pending_feedback: number;
    support_requests: number;
    loa_requests: number;
}
