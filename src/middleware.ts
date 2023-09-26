import { withAuth } from 'next-auth/middleware';

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            if (!token) return false;

            if (req.nextUrl.pathname.startsWith('/admin')) {
                return token.user.is_admin;
            }

            if (req.nextUrl.pathname.startsWith('/training')) {
                if (req.nextUrl.pathname === '/training') {
                    return token.user.is_member;
                }
                return token.user.is_training_staff;
            }

            return true;
        },
    },
});

export const config = {
    matcher: [
        // Need to be admin
        '/admin/:path*',
        // Need to be training staff
        '/training/availability',
        '/training/mentor',
        '/training/profile',
        '/training/requests',
        '/training/scheduled',
        '/training/session/:path*',
        // Need to be member
        '/training',
        // Just need to be logged in
        '/feedback',
        '/visit',
    ],
};
