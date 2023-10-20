import { withAuth } from 'next-auth/middleware';
import { type JWT } from 'next-auth/jwt';

const isStaff = (token: JWT | null) => token?.user.is_staff ?? false;
const isTrainingStaff = (token: JWT | null) => token?.user.is_training_staff ?? false;
const isMember = (token: JWT | null) => token?.user.is_member ?? false;
const isLoggedIn = (token: JWT | null) => token !== null;

const ROUTE_AUTH_MAP: {re: RegExp, verify: (token: JWT | null) => boolean }[] = [
    // Need to be staff
    { re: /\/admin(\/(.*))?/, verify: isStaff },
    // Need to be training staff
    { re: /\/training\/mentor/, verify: isTrainingStaff },
    { re: /\/training\/profile/, verify: isTrainingStaff },
    { re: /\/training\/requests/, verify: isTrainingStaff },
    { re: /\/training\/scheduled/, verify: isTrainingStaff },
    { re: /\/training\/session\/(d+)/, verify: isTrainingStaff },
    // Need to be member
    { re: /\/training/, verify: isMember },
    // Just need to be logged in
    { re: /\/feedback/, verify: isLoggedIn },
    { re: /\/visit/, verify: isLoggedIn },
    { re: /\/events\/support/, verify: isLoggedIn },
];

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => (
            ROUTE_AUTH_MAP.find(({ re }) => re.test(req.nextUrl.pathname))
                // Protected route, check verify function
                ?.verify(token)
                // Unprotected route
                ?? true
        ),
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
