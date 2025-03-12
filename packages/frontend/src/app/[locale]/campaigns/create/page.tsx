import { CreateCampaign } from "@/src/components/create-campaign";

export const metadata = {
    openGraph: {
        images: ["/images/opengraph-image.png"],
    },
};

export default function PickCampaignTypePage() {
    return <CreateCampaign />;
}
