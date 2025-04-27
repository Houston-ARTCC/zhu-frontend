import { withAuth } from 'next-auth/middleware';
import { type JWT } from 'next-auth/jwt';
import { parseJwt } from '@/utils/jwt';

const isAdmin = (token: JWT | null) => token?.user.permissions.is_admin ?? false;
const isStaff = (token: JWT | null) => token?.user.permissions.is_staff ?? false;
const isTrainingStaff = (token: JWT | null) => token?.user.permissions.is_training_staff ?? false;
const isMember = (token: JWT | null) => token?.user.permissions.is_member ?? false;
const isLoggedIn = (token: JWT | null) => token !== null;

const ROUTE_AUTH_MAP: { re: RegExp, verify: (token: JWT | null) => boolean }[] = [
    // Need to be admin
    { re: /\/admin\/loa/, verify: isAdmin },
    { re: /\/admin\/purge/, verify: isAdmin },
    { re: /\/admin\/queue\/loa/, verify: isAdmin },
    { re: /\/admin\/queue\/visit/, verify: isAdmin },
    { re: /\/admin\/queue\/feedback/, verify: isAdmin },
    // Need to be staff
    { re: /\/admin(\/(.*))?/, verify: isStaff },
    { re: /\/events\/(d+)\/edit/, verify: isStaff },
    { re: /\/events\/new/, verify: isStaff },
    { re: /\/events\/presets/, verify: isStaff },
    // Need to be training staff
    { re: /\/training\/availability/, verify: isTrainingStaff },
    { re: /\/training\/mentor/, verify: isTrainingStaff },
    { re: /\/training\/profile/, verify: isTrainingStaff },
    { re: /\/training\/requests/, verify: isTrainingStaff },
    { re: /\/training\/scheduled/, verify: isTrainingStaff },
    { re: /\/training\/session\/(d+)/, verify: isTrainingStaff },
    // Need to be member
    { re: /\/training(\/(.*))?/, verify: isMember },
    { re: /\/dashboard(\/(.*))?/, verify: isMember },
    { re: /\/events\/scores/, verify: isMember },
    // Just need to be logged in
    { re: /\/feedback/, verify: isLoggedIn },
    { re: /\/visit/, verify: isLoggedIn },
    { re: /\/events\/support/, verify: isLoggedIn },
];

export default withAuth({
    callbacks: {
        authorized: async ({ req, token }) => {
            const now = Date.now() / 1000;

            // Check if refresh token is still valid
            if (token && now > parseJwt(token.refreshToken).exp) {
                return false;
            }

            // Check if user has access to current path
            return ROUTE_AUTH_MAP.find(({ re }) => re.test(req.nextUrl.pathname))
                // Protected route, check verify function
                ?.verify(token)
                // Unprotected route
                ?? true;
        },
    },
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
