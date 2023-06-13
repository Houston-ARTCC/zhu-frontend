/* eslint-disable */
import NextAuth, { type Account, type Profile } from 'next-auth';

type UserId = {
    first_name: string;
    last_name: string;
    cid: number;
    email: string;
    rating: string;
    facility: string;
    is_member: boolean;
    is_training_staff: boolean;
    is_staff: boolean;
    is_senior_staff: boolean;
    is_admin: boolean;
}

declare module 'next-auth' {
    interface User extends UserId {}

    interface Profile extends UserId {}

    interface Session {
        user: Profile;
        access_token: string;
    }
}

declare module "next-auth/jwt" {
    interface User extends UserId {}

    interface JWT {
        user: User;
        account: Account;
    }
}
