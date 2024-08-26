import type { AmmInfo } from "@/src/types";
import { Apr, SkeletonApr } from "./apr";
import { Pool, SkeletonPool } from "./pool";
import { SkeletonStatus, Status } from "./status";
import { Rewards, SkeletonRewards } from "./rewards";
import { Chain, SkeletonChain } from "./chain";
import type { NamedCampaign } from "@/src/hooks/useCampaigns";

interface CampaignProps {
    campaign: NamedCampaign;
    className: string;
}

export function Campaign({ campaign, className }: CampaignProps) {
    return (
        <div className={className}>
            <Chain id={campaign.chainId} />
            <Pool campaign={campaign} />
            <Status
                from={campaign.from}
                to={campaign.to}
                status={campaign.status}
            />
            <Apr apr={campaign.apr} />
            <Rewards
                from={campaign.from}
                to={campaign.to}
                rewards={campaign.rewards}
            />
        </div>
    );
}

interface SkeletonCampaignProps {
    className: string;
}

export function SkeletonCampaign({ className }: SkeletonCampaignProps) {
    return (
        <div className={className}>
            <SkeletonChain />
            <SkeletonPool />
            <SkeletonStatus />
            <SkeletonApr />
            <SkeletonRewards />
        </div>
    );
}
