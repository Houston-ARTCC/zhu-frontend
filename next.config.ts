import type { NextConfig } from 'next';
import { type SentryBuildOptions, withSentryConfig } from '@sentry/nextjs/config';

const nextConfig: NextConfig = {
    output: 'standalone',
    turbopack: {
        rules: {
            '*.css': {
                loaders: ['@tailwindcss/turbopack'],
            },
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
