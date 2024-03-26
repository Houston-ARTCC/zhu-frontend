/* eslint-disable */
import { type Account } from 'next-auth';

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
        is_senior_staff: boolean;
        is_admin: boolean;
    }
}

declare module 'next-auth' {
    interface User extends UserId { }

    interface Profile extends UserId { }

    interface Account {
        provider: 'vatsim';
        type: 'oauth';
        providerAccountId: string;
        access_token: string;
        access_token_exp: number;
        refresh_token: string;
        refresh_token_exp: number;
    }

    interface Session {
        user: Profile;
        access_token: string;
        refresh_token: string;
    }
}

declare module "next-auth/jwt" {
    interface User extends UserId { }

    interface JWT {
        user: User;
        account: Account;
    }
}
