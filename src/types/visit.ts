import { type AuthenticatedUser } from '@/types/users';

export type VisitRequest = {
    id: number;
    user: AuthenticatedUser;
    reason: string;
};

export type VisitEligibility = {
    has_vatusa_user: boolean;
    has_home_facility: boolean;
    rce_completed: boolean;
    has_s3_rating: boolean;
    time_since_visit: boolean;
    time_since_promo: boolean;
    controlling_time: boolean;
    membership_check: boolean;
    pending_application_check: boolean;
    is_eligible: boolean;
};
