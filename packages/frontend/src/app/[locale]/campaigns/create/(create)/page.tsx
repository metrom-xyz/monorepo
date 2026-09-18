import { CreateCampaign } from "@/src/components/create-campaign";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Pick incentivization campaign type",
    openGraph: {
        images: ["/images/opengraph-image.png"],
    },
};

export default function PickCampaignTypePage() {
    notFound();

    return <CreateCampaign />;
}
