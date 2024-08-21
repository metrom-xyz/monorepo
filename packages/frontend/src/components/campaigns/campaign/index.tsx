import type { AmmInfo } from "@/src/types";
import { Apr } from "./apr";
import { Pool } from "./pool";
import { Status } from "./status";
import type { Campaign as CampaignType } from "@metrom-xyz/sdk";
import { Rewards } from "./rewards";

interface CampaignProps {
    campaign: CampaignType;
    amms: AmmInfo[];
    className: string;
}

export function Campaign({ campaign, amms, className }: CampaignProps) {
    return (
        <div className={className}>
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
