"use client";

import { usePrevious } from "react-use";
import { useTranslations } from "next-intl";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { ChainType } from "@metrom-xyz/sdk";
import { useAggregatedCampaign } from "@/src/hooks/useAggregatedCampaign";
import type { Hex } from "viem";
import { Header, SkeletonHeader } from "./header";
import { PageNotFound } from "../page-not-found";
import { ContentHeader, SkeletonContentHeader } from "./content-header";
import { BackButton } from "../back-button";
import { ItemsTable } from "./items-table";

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

    const { loading: loadingAggregatedCampaign, campaign: aggregatedCampaign } =
        useAggregatedCampaign({
            id: campaignId,
            chainId: chain,
            chainType,
        });

    const prevLoadingCampaign = usePrevious(loadingAggregatedCampaign);
    if (
        prevLoadingCampaign &&
        !loadingAggregatedCampaign &&
        !aggregatedCampaign
    )
        return <PageNotFound message={t("notFound")} />;

    return (
        <div className={styles.root}>
            <BackButton />
            <div className={styles.headerWrapper}>
                {!aggregatedCampaign || loadingAggregatedCampaign ? (
                    <SkeletonHeader />
                ) : (
                    <Header campaign={aggregatedCampaign} />
                )}
            </div>
            <div className={styles.contentWrapper}>
                {!aggregatedCampaign || loadingAggregatedCampaign ? (
                    <SkeletonContentHeader />
                ) : (
                    <ContentHeader campaign={aggregatedCampaign} />
                )}

                <ItemsTable
                    aggregatedCampaign={aggregatedCampaign}
                    loadingAggregatedCampaign={loadingAggregatedCampaign}
                />
            </div>
        </div>
    );
}
