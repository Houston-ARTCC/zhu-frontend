import type { AuthenticatedBasicUser, BasicUser } from '@/types/users';

export type SupportRequest = {
    id: number;
    user: AuthenticatedBasicUser;
    name: string;
    banner: string;
    start: string;
    end: string;
    host: string;
    requested_fields: string[];
    description: string;
}

export type AdminNotifications = {
    visiting_applications: number;
    pending_feedback: number;
    support_requests: number;
    loa_requests: number;
}

export enum LogEntryAction {
    Create,
    Update,
    Delete,
}

export type LogEntry = {
    id: number;
    action: LogEntryAction;
    actor: BasicUser | null;
    changes: { [key: string]: [string, string] };
    content_type: string;
    object_id: number;
    object_repr: string;
    timestamp: string;
}
