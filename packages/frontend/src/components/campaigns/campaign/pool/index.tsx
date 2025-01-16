"use client";

import { Typography, Skeleton } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import classNames from "classnames";
import { getCampaigName } from "@/src/utils/campaign";
import type { TargetedCampaign, TargetType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface PoolProps {
    campaign: TargetedCampaign<TargetType.AmmPoolLiquidity>;
}

export function Pool({ campaign }: PoolProps) {
    const t = useTranslations("allCampaigns.pool");

    return (
        <div className={styles.root}>
            <PoolRemoteLogo
                chain={campaign.chainId}
                tokens={campaign.target.pool.tokens.map((token) => ({
                    address: token.address,
                    defaultText: token.symbol,
                }))}
            />
            <div className={styles.titleContainer}>
                <Typography size="lg" weight="medium" truncate>
                    {getCampaigName(campaign)}
                </Typography>
                {campaign.target.pool.fee && (
                    <Typography
                        size="sm"
                        weight="medium"
                        className={styles.campaignFee}
                        light
                    >
                        {formatPercentage(campaign.target.pool.fee)}
                    </Typography>
                )}
                {campaign.specification?.kpi && (
                    <div className={styles.kpi}>
                        <Typography size="sm" weight="medium">
                            {t("kpi")}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}

export function SkeletonPool() {
    return (
        <div className={styles.root}>
            <PoolRemoteLogo
                tokens={[{ address: "0x1" }, { address: "0x2" }]}
                loading
            />
            <div
                className={classNames(
                    styles.titleContainer,
                    styles.titleContainerLoading,
                )}
            >
                <Skeleton size="lg" width={120} />
                <Skeleton size="sm" width={50} className={styles.campaignFee} />
            </div>
        </div>
    );
}
