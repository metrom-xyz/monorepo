import { CampaignDetails } from "@/src/components/campaign-details";
import type { SupportedChain } from "@metrom-xyz/contracts";
import type { Hex } from "viem";

export default function CampaignDetailsPage({
    params,
}: {
    params: { chain: SupportedChain; campaignId: Hex };
}) {
    return (
        <CampaignDetails chain={params.chain} campaignId={params.campaignId} />
    );
}
