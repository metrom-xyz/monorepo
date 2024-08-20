import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com",
            },
        ],
    },
    async redirects() {
        return [
            {
                source: "/:locale/",
                destination: "/campaigns",
                permanent: true,
            },
        ];
    },
};

export default withNextIntl(nextConfig);
