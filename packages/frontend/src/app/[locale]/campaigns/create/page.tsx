import { CreateCampaign } from "@/src/components/create-campaign";

export const metadata = {
    title: "Pick incentivization campaign type",
    openGraph: {
        images: ["/images/opengraph-image.png"],
    },
};

export default function PickCampaignTypePage() {
    return <CreateCampaign />;
}
