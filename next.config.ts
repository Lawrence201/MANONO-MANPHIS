import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    // Rewrite /uploads/* to API route for dynamic file serving in production
    async rewrites() {
        return [
            {
                source: '/uploads/:path*',
                destination: '/api/uploads/:path*',
            },
        ];
    },
    // Security headers
    async headers() {
        return [
            {
                // Apply security headers to all routes
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    ...(process.env.NODE_ENV === 'production' ? [{
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains',
                    }] : []),
                ],
            },
        ];
    },
};

export default nextConfig;
