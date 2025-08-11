"use client";

import { usePrevious } from "react-use";
import { useTranslations } from "next-intl";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { ChainType, DistributablesType, TargetType } from "@metrom-xyz/sdk";
import { useCampaign } from "@/src/hooks/useCampaign";
import type { Hex } from "viem";
import { Header, SkeletonHeader } from "./header";
import { Details } from "./details";
import { Rewards } from "./rewards";
import { Points } from "./points";
import { Kpi } from "./kpi";
import { PageNotFound } from "../page-not-found";
import { PriceRange } from "./price-range";
import { Leaderboard } from "../leaderboard";
import { useLeaderboard } from "@/src/hooks/useLeaderboard";
import { Weighting } from "./weighting";
import { Restrictions } from "./restrictions";

import styles from "./styles.module.css";

interface CampaignDetailsProps {
    chain: SupportedChain;
    chainType: ChainType;
    campaignId: Hex;
}

export function CampaignDetails({
    chain,
    chainType,
    campaignId,
}: CampaignDetailsProps) {
    const t = useTranslations("campaignDetails");

    const { loading: loadingCampaign, campaign } = useCampaign({
        id: campaignId,
        chainId: chain,
        chainType,
    });

    const { loading: loadingLeaderboard, leaderboard } = useLeaderboard({
        campaignId: campaign?.id,
        chainId: campaign?.chainId,
        chainType: campaign?.chainType,
        enabled: !!campaign,
    });

    const prevLoadingCampaign = usePrevious(loadingCampaign);
    if (prevLoadingCampaign && !loadingCampaign && !campaign)
        return <PageNotFound message={t("notFound")} />;

    const tokensCampaign = campaign?.isDistributing(DistributablesType.Tokens);
    const pointsCampaign = campaign?.isDistributing(DistributablesType.Points);
    const ammPoolCampaign = campaign?.isTargeting(TargetType.AmmPoolLiquidity);

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
                {ammPoolCampaign && (
                    <>
                        <Weighting
                            specification={campaign.specification}
                            pool={campaign.target.pool}
                        />
                        <PriceRange campaign={campaign} />
                    </>
                )}
                {tokensCampaign && (
                    <Kpi campaign={campaign} loading={loadingCampaign} />
                )}
                {campaign?.restrictions && (
                    <Restrictions {...campaign.restrictions} />
                )}
                <Leaderboard
                    chainId={campaign?.chainId}
                    restrictions={campaign?.restrictions}
                    leaderboard={leaderboard}
                    loading={loadingLeaderboard}
                />
            </div>
        </div>
    );
}
