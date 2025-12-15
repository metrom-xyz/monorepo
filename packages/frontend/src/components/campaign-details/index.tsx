"use client";

import { usePrevious } from "react-use";
import { useTranslations } from "next-intl";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { ChainType, DistributablesType, TargetType } from "@metrom-xyz/sdk";
import { useCampaign } from "@/src/hooks/useCampaign";
import type { Hex } from "viem";
import { Header, SkeletonHeader } from "./header";
import { Kpi } from "./kpi";
import { PageNotFound } from "../page-not-found";
import { Leaderboard } from "../leaderboard";
import { useLeaderboard } from "@/src/hooks/useLeaderboard";
import { Restrictions } from "./restrictions";
import { ContentHeader, SkeletonContentHeader } from "./content-header";
import { PriceRange } from "./price-range";

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
    const ammPoolLiquidityCampaigns = campaign?.isTargeting(
        TargetType.AmmPoolLiquidity,
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
                {!campaign || loadingCampaign ? (
                    <SkeletonContentHeader />
                ) : (
                    <ContentHeader campaign={campaign} />
                )}

                <div className={styles.contentBody}>
                    {ammPoolLiquidityCampaigns && (
                        <PriceRange campaign={campaign} />
                    )}

                    {tokensCampaign && (
                        <Kpi campaign={campaign} loading={loadingCampaign} />
                    )}

                    <Leaderboard
                        chainId={campaign?.chainId}
                        chainType={campaign?.chainType}
                        restrictions={campaign?.restrictions}
                        leaderboard={leaderboard}
                        loading={loadingLeaderboard}
                    />
                </div>
            </div>
            {campaign?.restrictions && (
                <Restrictions {...campaign.restrictions} />
            )}
        </div>
    );
}
