/* eslint-disable */
import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Profile {
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

    type User = Profile;

    interface Session {
        user: User
    }
}
