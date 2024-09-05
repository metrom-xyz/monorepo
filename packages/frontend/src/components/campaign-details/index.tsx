"use client";

import type { SupportedChain } from "@metrom-xyz/contracts";
import { useCampaign } from "@/src/hooks/useCampaign";
import type { Hex } from "viem";
import { Header, SkeletonHeader } from "./header";
import { Details } from "./details";
import { Rewards } from "./rewards";
import { Leaderboard } from "./leaderboard";

import styles from "./styles.module.css";

interface CampaignDetailsProps {
    chain: SupportedChain;
    campaignId: Hex;
}

export function CampaignDetails({ chain, campaignId }: CampaignDetailsProps) {
    // TODO: add watch to hook to fetch live updates every distribution snapshot
    const { loading: loadingCampaign, campaign } = useCampaign(
        chain,
        campaignId,
    );

    return (
        <div className={styles.root}>
            <div className={styles.headerWrapper}>
                {!campaign || loadingCampaign ? (
                    <SkeletonHeader />
                ) : (
                    <Header campaign={campaign} />
                )}
            </div>
            <div className={styles.contentWrapper}>
                <Details campaign={campaign} loading={loadingCampaign} />
                <Rewards campaign={campaign} loading={loadingCampaign} />
                <Leaderboard campaign={campaign} loading={loadingCampaign} />
            </div>
        </div>
    );
}
