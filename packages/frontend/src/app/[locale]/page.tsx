import { Campaigns } from "@/src/components/campaigns";

export const metadata = {
    openGraph: {
        images: ["/images/opengraph-image.png"],
    },
};

export default function HomePage() {
    return <Campaigns />;
}
