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
    }
}

declare module 'next-auth' {
    type User = UserId

    type Profile = UserId

    interface Session {
        user: Profile;
        accessToken: string;
        error?: 'RefreshAccessTokenError';
    }
}

declare module 'next-auth/jwt' {
    type User = UserId

    interface JWT {
        user: User;
        accessToken: string;
        refreshToken: string;
        error?: 'RefreshAccessTokenError';
    }
}
