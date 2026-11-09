import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

// Route prefixes that require an authenticated session. Per-tier checks
// (staff/admin/training) are enforced in the route layouts, not here.
const PROTECTED_ROUTES: RegExp[] = [
    /^\/admin/,
    /^\/training/,
    /^\/dashboard/,
    /^\/events\/new/,
    /^\/events\/[^/]+\/edit/,
    /^\/events\/presets/,
    /^\/events\/scores/,
    /^\/events\/support/,
    /^\/feedback/,
    /^\/visit/,
];

export default auth((req) => {
    if (req.auth) {
        return;
    }

    if (PROTECTED_ROUTES.some((route) => route.test(req.nextUrl.pathname))) {
        const signInUrl = new URL('/api/auth/signin', req.nextUrl.origin);
        signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
        return Response.redirect(signInUrl);
    }
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
