import { cache } from 'react';
import NextAuth, { type Session } from 'next-auth';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { usersUser } from '@/lib/db/schema';
import { getPermissions } from '@/lib/users/permissions';
import { upsertUserFromVatsim } from '@/lib/users/provisioning';
import { authConfig } from '@/auth.config';

const nextAuth = NextAuth({
    ...authConfig,
    callbacks: {
        ...authConfig.callbacks,
        signIn: async ({ profile }) => {
            if (!profile?.data) {
                return false;
            }
            await upsertUserFromVatsim(profile.data);
            return true;
        },
        session: async ({ session, token }): Promise<Session> => {
            const [user] = await db
                .select()
                .from(usersUser)
                .where(eq(usersUser.cid, token.cid));

            // Auth.js treats a throw here as signed out and clears the cookie.
            if (!user) throw new Error(`User ${token.cid} no longer exists`);

            return {
                ...session,
                user: {
                    cid: user.cid,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    email: user.email,
                    rating: user.rating,
                    home_facility: user.homeFacility,
                    endorsements: user.endorsements as Record<string, boolean | string> | null,
                    permissions: await getPermissions(user.cid),
                },
            };
        },
    },
});

export const { handlers, signIn, signOut } = nextAuth;

// Shares one session lookup across the layouts, pages, and components of a request.
export const auth = cache(() => nextAuth.auth());
