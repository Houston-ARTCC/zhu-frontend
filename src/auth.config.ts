import type { NextAuthConfig } from 'next-auth';

const VATSIM_URL = process.env.VATSIM_CONNECT_URL ?? 'https://auth.vatsim.net';

export const authConfig: NextAuthConfig = {
    session: {
        strategy: 'jwt',
        maxAge: (60 * 60 * 24 * 7) - 60,
    },
    callbacks: {
        jwt: ({ token, profile, trigger }) => {
            if (trigger === 'signIn' && profile?.data) {
                token.cid = Number(profile.data.cid);
            }
            return token;
        },
    },
    providers: [
        {
            id: 'vatsim',
            name: 'VATSIM Connect',
            type: 'oauth',
            clientId: process.env.VATSIM_CONNECT_CLIENT_ID,
            clientSecret: process.env.VATSIM_CONNECT_CLIENT_SECRET,
            authorization: {
                url: `${VATSIM_URL}/oauth/authorize`,
                params: {
                    scope: 'full_name vatsim_details email',
                },
            },
            token: `${VATSIM_URL}/oauth/token`,
            userinfo: `${VATSIM_URL}/api/user`,
            profile: (profile) => ({ id: String(profile.data.cid) }),
        },
    ],
};
