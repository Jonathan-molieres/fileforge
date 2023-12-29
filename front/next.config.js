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
    async redirects() {
        return [
            {
                source: '/legales',
                destination: '/mentions-legales',
                permanent: true,
            },
            {
                source: '/nos-engagements',
                destination: '/engagements',
                permanent: true,
            },
            {
                source: '/services/formation',
                destination: '/formations',
                permanent: true,
            },
            {
                source: '/jobs/:path*',
                destination: '/nos-offres/',
                permanent: false,
            }
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'source.unsplash.com',
                port: '',
                pathname: '/random',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'api.uplead.com',
            },
            {
                protocol: 'https',
                hostname: 'workandyou.fr',
            },
        ],
    },
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
