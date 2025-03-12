import { Campaigns } from "@/src/components/campaigns";

export const metadata = {
    title: "Explore opportunities",
    openGraph: {
        images: ["/images/opengraph-image.png"],
    },
};

export default function HomePage() {
    return <Campaigns />;
}
