"use client";

import { usePrevious } from "react-use";
import { useTranslations } from "next-intl";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useCampaign } from "@/src/hooks/useCampaign";
import type { Hex } from "viem";
import { Header, SkeletonHeader } from "./header";
import { Details } from "./details";
import { Rewards } from "./rewards";
import { Points } from "./points";
import { Leaderboard } from "./leaderboard";
import { Kpi } from "./kpi";
import { PageNotFound } from "../page-not-found";
import { DistributablesType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface CampaignDetailsProps {
    chain: SupportedChain;
    campaignId: Hex;
}

export function CampaignDetails({ chain, campaignId }: CampaignDetailsProps) {
    const t = useTranslations("campaignDetails");

    const { loading: loadingCampaign, campaign } = useCampaign(
        chain,
        campaignId,
    );

    const prevLoadingCampaign = usePrevious(loadingCampaign);
    if (prevLoadingCampaign && !loadingCampaign && !campaign)
        return <PageNotFound message={t("notFound")} />;

    const tokensCampaign = campaign?.isDistributing(DistributablesType.Tokens);
    const pointsCampaign = campaign?.isDistributing(DistributablesType.Points);

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
                {tokensCampaign && (
                    <Rewards campaign={campaign} loading={loadingCampaign} />
                )}
                {pointsCampaign && (
                    <Points campaign={campaign} loading={loadingCampaign} />
                )}
                {tokensCampaign && (
                    <Kpi campaign={campaign} loading={loadingCampaign} />
                )}
                <Leaderboard campaign={campaign} loading={loadingCampaign} />
            </div>
        </div>
    );
}
