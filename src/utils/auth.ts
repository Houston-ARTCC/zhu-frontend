import type { AuthOptions } from 'next-auth';
import { parseJwt } from '@/utils/jwt';
import type { UserId } from '@/types/next-auth';

type RefreshedTokens = {
    access: string;
    refresh: string;
    profile: UserId;
}

const refreshTokenPromiseCache: { [key: string]: Promise<Response> } = {};

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
                    accessToken: token.accessToken,
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
                    accessToken: account.access_token!,
                    refreshToken: account.refresh_token!,
                };
            }

            // Access token is expired :(
            if (Date.now() / 1000 > parseJwt(token.accessToken).exp) {
                const body = JSON.stringify({ refresh: token.refreshToken });

                const tokenId = parseJwt(token.refreshToken).jti;

                // Obtain new token pair and new profile data
                if (!refreshTokenPromiseCache[tokenId]) {
                    refreshTokenPromiseCache[tokenId] = fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body,
                        },
                    );
                }
                const resp = await refreshTokenPromiseCache[tokenId];
                const { access, refresh, profile } = await resp.json() as RefreshedTokens;

                return {
                    ...token,
                    user: profile,
                    accessToken: access,
                    refreshToken: refresh,
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
