import type { NextConfig } from 'next';
import { type SentryBuildOptions, withSentryConfig } from '@sentry/nextjs/config';

const nextConfig: NextConfig = {
    output: 'standalone',
    typedRoutes: true,
    turbopack: {
        rules: {
            '*.css': {
                loaders: ['@tailwindcss/turbopack'],
            },
        },
    },
    experimental: {
        // Lets the auth guards render forbidden.tsx and unauthorized.tsx.
        authInterrupts: true,
        serverActions: {
            // Resource and profile picture uploads go through server actions; the largest existing file is under 12 MB.
            bodySizeLimit: '16mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.houston.center',
            },
        ],
    },
    redirects: async () => [
        {
            source: '/dashboard',
            destination: '/dashboard/profile',
            permanent: true,
        },
    ],
};

const sentryOptions: SentryBuildOptions = {
    org: 'zhuartcc',
    project: 'zhu-frontend',
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,
    bundleSizeOptimizations: {
        excludeDebugStatements: true,
    },
    widenClientFileUpload: true,
};

export default withSentryConfig(nextConfig, sentryOptions);
