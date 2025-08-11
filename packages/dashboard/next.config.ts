import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const cspHeader = `
    default-src 'self';
    connect-src 'self' https: https://verify.walletconnect.org  wss://relay.walletconnect.org;
    frame-src 'self' https://verify.walletconnect.org;
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src * data: blob:;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: cspHeader.replace(/\n/g, ""),
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                ],
            },
            {
                source: "/manifest.json",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-Requested-With, content-type, Authorization",
                    },
                ],
            },
        ];
    },
};

export default withNextIntl(nextConfig);
