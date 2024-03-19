const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/media/**',
            },
            {
                protocol: 'https',
                hostname: 'api.houston.center',
                port: '80',
                pathname: '/media/**',
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
    org: 'houston-artcc-ym',
    project: 'zhu-frontend',
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: true,
};

module.exports = withSentryConfig(nextConfig, sentryOptions);
