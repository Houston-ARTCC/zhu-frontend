const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
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
    sentry: {
        hideSourceMaps: true,
        disableLogger: true,
    },
};

const sentryOptions = {
    org: 'zhuartcc',
    project: 'zhu-frontend',
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: true,
};

module.exports = withSentryConfig(nextConfig, sentryOptions);
