import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const ALLOWED_FRAME_ANCESTORS = [
    "https://app.safe.global",
    "https://vault.petra.app",
];

const cspHeader = `
    default-src 'self';
    connect-src 'self' https: https://verify.walletconnect.org  wss://relay.walletconnect.org wss://www.walletlink.org wss://api.testnet.solana.com wss://api.testnet.solana.com;
    frame-src 'self' https://verify.walletconnect.org;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.usefathom.com https://umami.metrom.xyz;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src * data: blob:;
    font-src 'self' https://fonts.gstatic.com https://fonts.reown.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors ${ALLOWED_FRAME_ANCESTORS.join(" ")};
    upgrade-insecure-requests;
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        optimizePackageImports: [
            "@reown/appkit",
            "@reown/appkit-adapter-wagmi",
            "wagmi",
            "viem",
            "@wagmi/core",
            "@aptos-labs/js-pro",
            "@aptos-labs/react",
            "@aptos-labs/wallet-adapter-react",
            "@aptos-labs/ts-sdk",
            "recharts",
            "motion",
            "react-use",
            "@metrom-xyz/ui",
            "@metrom-xyz/sdk",
            "@metrom-xyz/chains",
        ],
    },
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
                    {
                        key: "Content-Security-Policy",
                        value: cspHeader.replace(/\n/g, ""),
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
    async redirects() {
        return [
            // Redirect old campaign page links to use 'evm' as the default chain type
            {
                source: "/en/campaigns/:chain(\\d{1,})/:id",
                destination: "/en/campaigns/evm/:chain/:id",
                permanent: false,
            },
            // Prefix any non-localized path with the default locale (replaces next-intl middleware)
            {
                source: "/",
                destination: "/en",
                permanent: false,
            },
            {
                source: "/:path((?!en$|en/|_next/|api/|.*\\.).+)",
                destination: "/en/:path",
                permanent: false,
            },
        ];
    },
};

export default withNextIntl(nextConfig);
