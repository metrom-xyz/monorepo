"use client";

import { usePrevious } from "react-use";
import { useTranslations } from "next-intl";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { ChainType } from "@metrom-xyz/sdk";
import { useCampaignDetails } from "@/src/hooks/useCampaignDetails";
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

    const { loading, campaignDetails } = useCampaignDetails({
        id: campaignId,
        chainId: chain,
        chainType,
    });

    const prevLoadingCampaign = usePrevious(loading);
    if (prevLoadingCampaign && !loading && !campaignDetails)
        return <PageNotFound message={t("notFound")} />;

    return (
        <div className={styles.root}>
            <BackButton />
            <div className={styles.headerWrapper}>
                {!campaignDetails || loading ? (
                    <SkeletonHeader />
                ) : (
                    <Header campaignDetails={campaignDetails} />
                )}
            </div>
            <div className={styles.contentWrapper}>
                {!campaignDetails || loading ? (
                    <SkeletonContentHeader />
                ) : (
                    <ContentHeader campaign={campaignDetails} />
                )}

                <ItemsTable
                    campaignDetails={campaignDetails}
                    loadingCampaignDetails={loading}
                />
            </div>
        </div>
    );
}
