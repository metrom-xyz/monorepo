import { Campaigns } from "@/src/components/campaigns";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore opportunities",
    openGraph: {
        images: ["/images/opengraph-image.png"],
    },
};

export default function HomePage() {
    return <Campaigns />;
}
