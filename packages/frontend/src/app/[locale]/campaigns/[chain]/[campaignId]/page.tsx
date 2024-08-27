import { CampaignDetails } from "@/src/components/campaign-details";
import type { SupportedChain } from "@metrom-xyz/contracts";

export default function CampaignDetailsPage({
    params,
}: {
    params: { chain: SupportedChain; campaignId: string };
}) {
    return (
        <CampaignDetails chain={params.chain} campaignId={params.campaignId} />
    );
}
