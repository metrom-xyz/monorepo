import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const cspHeader = `
    default-src 'self';
    connect-src 'self' https: https://verify.walletconnect.org  wss://relay.walletconnect.org wss://www.walletlink.org;
    frame-src 'self' https://verify.walletconnect.org;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.usefathom.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src * data: blob:;
    font-src 'self' https://fonts.gstatic.com https://fonts.reown.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "assets.coingecko.com",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    // {
                    //     key: "Content-Security-Policy",
                    //     value: cspHeader.replace(/\n/g, ""),
                    // },
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
    // Redirect old campaign page links to use 'evm' as the default chain type
    async redirects() {
        return [
            {
                source: "/en/campaigns/:chain(\\d{1,})/:id",
                destination: "/en/campaigns/evm/:chain/:id",
                permanent: false,
            },
        ];
    },
};

export default withNextIntl(nextConfig);
