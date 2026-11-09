import 'next-auth';

interface UserId {
    first_name: string;
    last_name: string;
    cid: number;
    email: string;
    rating: string;
    home_facility: string;
    endorsements: Record<string, boolean | string> | null;
    permissions: {
        is_member: boolean;
        is_training_staff: boolean;
        is_training_admin: boolean;
        is_staff: boolean;
        is_admin: boolean;
        endorsement_scope: 'all' | 'own';
        can_view_audit_log: boolean;
    }
}

declare module 'next-auth' {
    type User = UserId

    interface Profile {
        data: {
            cid: number | string;
            personal: { email: string; name_first: string; name_last: string };
            vatsim: { rating: { short: string }; division: { id: string } };
        };
    }

    interface Session {
        user: UserId;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        cid: number;
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        cid: number;
    }
}
