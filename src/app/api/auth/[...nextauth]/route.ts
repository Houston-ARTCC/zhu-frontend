import NextAuth, { type AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
    session: { strategy: 'jwt' },
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
        jwt: ({ token, user, account }) => {
            if (user && account) {
                return { ...token, user, account };
            }

            // console.log(token);
            // if (Date.now() < (token.account.expires_at ?? 0)) {
            //     console.log('expired!');
            // } else {
            //     console.log('not expired :/');
            // }

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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
