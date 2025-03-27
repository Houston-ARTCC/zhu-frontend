import 'next-auth';

type UserId = {
    first_name: string;
    last_name: string;
    cid: number;
    email: string;
    rating: string;
    home_facility: string;
    permissions: {
        is_member: boolean;
        is_training_staff: boolean;
        is_staff: boolean;
        is_admin: boolean;
    }
}

declare module 'next-auth' {
    interface User extends UserId { }

    interface Profile extends UserId { }

    interface Session {
        user: Profile;
        accessToken: string;
    }
}

declare module 'next-auth/jwt' {
    interface User extends UserId { }

    interface JWT {
        user: User;
        accessToken: string;
        refreshToken: string;
    }
}
