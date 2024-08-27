import { CampaignDetails } from "@/src/components/campaign-details";
import type { SupportedChain } from "@metrom-xyz/contracts";
import type { Address } from "viem";

export default function CampaignDetailsPage({
    params,
}: {
    params: { chain: SupportedChain; campaignId: Address };
}) {
    return (
        <CampaignDetails chain={params.chain} campaignId={params.campaignId} />
    );
}
