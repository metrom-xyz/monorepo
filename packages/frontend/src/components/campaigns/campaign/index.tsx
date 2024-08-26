import type { AmmInfo } from "@/src/types";
import { Apr, SkeletonApr } from "./apr";
import { Pool, SkeletonPool } from "./pool";
import { SkeletonStatus, Status } from "./status";
import type { Campaign as CampaignType } from "@metrom-xyz/sdk";
import { Rewards, SkeletonRewards } from "./rewards";
import { Chain, SkeletonChain } from "./chain";

interface CampaignProps {
    campaign: CampaignType;
    amms: AmmInfo[];
    className: string;
}

export function Campaign({ campaign, amms, className }: CampaignProps) {
    return (
        <div className={className}>
            <Chain id={campaign.chainId} />
            <Pool amms={amms} campaign={campaign} />
            <Status from={campaign.from} to={campaign.to} />
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
