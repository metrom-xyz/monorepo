import { SkeletonCampaigns } from "@/src/components/campaigns/skeleton-campaigns";
import { BackendCampaignType } from "@metrom-xyz/sdk";

export default function LoadingHomePage() {
    return <SkeletonCampaigns type={BackendCampaignType.Rewards} />;
}
