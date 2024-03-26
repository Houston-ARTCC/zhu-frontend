import type { AuthOptions } from 'next-auth';
import type { UserId } from '@/types/next-auth';

type RefreshedTokens = {
    access: string;
    refresh: string;
    profile: UserId;
}

type JWTPayload = {
    token_type: 'access' | 'refresh';
    exp: number;
    iat: number;
    jti: string;
    user_id: number;
}

function parseJwt(token: string): JWTPayload {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

export const authOptions: AuthOptions = {
    session: {
        strategy: 'jwt',
        // Slightly shorter than SIMPLE_JWT.REFRESH_TOKEN_LIFETIME in
        // https://github.com/Houston-ARTCC/zhu-core/blob/main/zhu_core/settings.py
        maxAge: (60 * 60 * 24 * 7) - 60,
    },
    callbacks: {
        session: ({ session, token }) => {
            if (token) {
                return {
                    ...session,
                    user: token.user,
                    access_token: token.account.access_token,
                };
            }
            return session;
        },
        jwt: async ({ token, user, account, trigger }) => {
            if (trigger === 'signIn') {
                if (!user || !account) {
                    throw Error('Unable to create token for user.');
                }

                return {
                    user: user as UserId,
                    account: {
                        ...account,
                        access_token_exp: parseJwt(account.access_token).exp,
                        refresh_token_exp: parseJwt(account.refresh_token).exp,
                    },
                };
            }

            // Access token is expired :(
            if (Date.now() / 1000 > token.account.access_token_exp) {
                const body = JSON.stringify({ refresh: token.account.refresh_token });

                // Obtain new token pair and new profile data
                const { access, refresh, profile } = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body,
                    },
                )
                    .then<RefreshedTokens>((resp) => resp.json());

                return {
                    ...token,
                    user: profile,
                    account: {
                        ...token.account,
                        access_token: access,
                        access_token_exp: parseJwt(access).exp,
                        refresh_token: refresh,
                        refresh_token_exp: parseJwt(refresh).exp,
                    },
                };
            }

            return token;
        },
    },
    providers: [
        {
            id: 'vatsim',
            name: 'VATSIM Connect',
            type: 'oauth',
            userinfo: `${process.env.NEXT_PUBLIC_API_URL}/auth/profile/`,
            client: {
                client_id: process.env.VATSIM_CONNECT_CLIENT_ID,
                token_endpoint_auth_method: 'none',
            },
            authorization: {
                url: process.env.NODE_ENV === 'development'
                    ? 'https://auth-dev.vatsim.net/oauth/authorize'
                    : 'https://auth.vatsim.net/oauth/authorize',
                params: {
                    scope: 'full_name vatsim_details email',
                    required_scopes: 'full_name vatsim_details email',
                    response_type: 'code',
                },
            },
            token: `${process.env.NEXT_PUBLIC_API_URL}/auth/token/`,
            profile: (profile) => ({ id: profile.cid, ...profile }),
        },
    ],
};
