import { type AuthenticatedUser } from '@/types/users';

export type VisitRequest = {
    id: number;
    user: AuthenticatedUser;
    reason: string;
};

export type VisitEligibility = {
    rating_check: boolean;
    rating_time_check: boolean;
    rating_hours_check: boolean;
    membership_check: boolean;
    pending_application_check: boolean;
    is_eligible: boolean;
};
