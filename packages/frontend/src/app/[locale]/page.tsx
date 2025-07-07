import { Suspense } from "react";
import { Campaigns } from "@/src/components/campaigns";
import { SkeletonCampaigns } from "@/src/components/campaigns/skeleton-campaigns";

export const metadata = {
    title: "Explore opportunities",
    openGraph: {
        images: ["/images/opengraph-image.png"],
    },
};

export default function HomePage() {
    return (
        <Suspense fallback={<SkeletonCampaigns />}>
            <Campaigns />
        </Suspense>
    );
}
