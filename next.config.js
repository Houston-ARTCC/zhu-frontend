/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['localhost', 'api.zhuartcc.org', 'api.zhuartcc.devel'],
    },
};

module.exports = nextConfig;
