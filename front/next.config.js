/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: process.env.NODE_ENV === 'production',
    // ...(process.env.NODE_ENV === 'production' ? { output: 'standalone' } : {}),
    experimental: {
        proxyTimeout: 2 * 60 * 1000, // 2 minutes
    },
    swcMinify: true,
    // modularizeImports: {
    //     '@mui/icons-material': {
    //         transform: '@mui/icons-material/{{member}}',
    //     },
    // },

    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    eslint: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig
