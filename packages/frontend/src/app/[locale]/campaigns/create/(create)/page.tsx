import { CreateCampaign } from "@/src/components/create-campaign";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pick incentivization campaign type",
    openGraph: {
        images: ["/images/opengraph-image.png"],
    },
};

export default function PickCampaignTypePage() {
    return <CreateCampaign />;
}
