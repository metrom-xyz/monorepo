import { Apr, SkeletonApr } from "./apr";
import { Pool, SkeletonPool } from "./pool";
import { SkeletonStatus, Status } from "./status";
import { Rewards, SkeletonRewards } from "./rewards";
import { Chain, SkeletonChain } from "./chain";
import type { NamedCampaign } from "@/src/hooks/useCampaigns";

import styles from "./styles.module.css";
import Link from "next/link";

interface CampaignProps {
    campaign: NamedCampaign;
}

export function Campaign({ campaign }: CampaignProps) {
    return (
        <Link
            href={`/campaigns/${campaign.chainId}/${campaign.id}`}
            className={styles.root}
        >
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
        </Link>
    );
}

export function SkeletonCampaign() {
    return (
        <div className={styles.root}>
            <SkeletonChain />
            <SkeletonPool />
            <SkeletonStatus />
            <SkeletonApr />
            <SkeletonRewards />
        </div>
    );
}
