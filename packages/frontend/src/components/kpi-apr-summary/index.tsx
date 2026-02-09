import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import {
    DistributablesType,
    SpecificationDistributionType,
    TargetType,
    type KpiDistributionSpecification,
    type Specification,
} from "@metrom-xyz/sdk";
import type { CampaignItem } from "@/src/types/campaign/common";
import { useMemo } from "react";
import { getCampaignApr } from "@/src/utils/campaign";
import { getCampaignAprTargetText } from "@/src/utils/kpi";
import { useLiquidityByAddresses } from "@/src/hooks/useLiquidityByAddresses";
import { usePool } from "@/src/hooks/usePool";

import styles from "./styles.module.css";

interface KpiAprSummaryProps {
    campaignItem?: CampaignItem & {
        specification: Specification & {
            distribution: KpiDistributionSpecification;
        };
    };
}

export function KpiAprSummary({ campaignItem }: KpiAprSummaryProps) {
    const t = useTranslations("kpiAprSummary");

    const tokensCampaign = campaignItem?.isDistributing(
        DistributablesType.Tokens,
    );

    const ammPoolLiquidityCampaign =
        campaignItem?.isTargeting(TargetType.AmmPoolLiquidity) ||
        campaignItem?.isTargeting(TargetType.JumperWhitelistedAmmPoolLiquidity);

    const { loading: loadingPool, pool } = usePool({
        id: ammPoolLiquidityCampaign ? campaignItem?.target.pool.id : undefined,
        chainId: campaignItem?.target.chainId,
        chainType: campaignItem?.target.chainType,
        enabled: campaignItem && ammPoolLiquidityCampaign,
    });

    const { loading: loadingLiquidityByAddresses, liquidityByAddresses } =
        useLiquidityByAddresses({
            type: campaignItem?.restrictions?.type,
            pool: pool,
            addresses: campaignItem?.restrictions?.list,
            enabled: !!pool && !!campaignItem?.restrictions,
        });

    const maxApr = useMemo(() => {
        if (
            !campaignItem ||
            !tokensCampaign ||
            campaignItem?.specification?.distribution?.type !==
                SpecificationDistributionType.Kpi ||
            loadingPool ||
            loadingLiquidityByAddresses ||
            (campaignItem.restrictions && !liquidityByAddresses)
        )
            return undefined;

        const { distribution } = campaignItem.specification;

        return getCampaignApr({
            usdRewards: campaignItem.distributables.amountUsdValue,
            duration: campaignItem.to - campaignItem.from,
            usdTvl: distribution.goal.upperUsdTarget,
            kpiDistribution: distribution,
            liquidity: pool?.liquidity,
            liquidityByAddresses,
            // TODO: add liquidity in range
            // range: liquidityInRange,
        });
    }, [
        campaignItem,
        liquidityByAddresses,
        loadingLiquidityByAddresses,
        loadingPool,
        tokensCampaign,
        pool?.liquidity,
    ]);

    const lowerBound =
        campaignItem?.specification?.distribution?.goal.lowerUsdTarget;
    const upperBound =
        campaignItem?.specification?.distribution?.goal.upperUsdTarget;
    const minimumPayout =
        campaignItem?.specification?.distribution?.minimumPayoutPercentage;

    if (loadingPool || loadingLiquidityByAddresses)
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.loading} />
                <div className={styles.loading} />
                <div className={styles.loading} />
            </div>
        );

    if (!maxApr || !campaignItem) return null;

    return (
        <Typography size="sm" className={styles.text}>
            {minimumPayout
                ? t.rich("textWithMinPayout", {
                      targetValueName: campaignItem.targetValueName,
                      minimumPayout: formatPercentage({
                          percentage: minimumPayout * 100,
                      }),
                      upperBound: formatUsdAmount({
                          amount: upperBound,
                          cutoff: false,
                      }),
                      maxApr: formatPercentage({
                          percentage: maxApr,
                      }),
                      bold: (chunks) => (
                          <span className={styles.boldText}>{chunks}</span>
                      ),
                      apr: (chunks) => (
                          <span className={styles.aprText}>{chunks}</span>
                      ),
                  })
                : t.rich("textNoMinPayout", {
                      targetValueName: campaignItem.targetValueName,
                      target: t(getCampaignAprTargetText(campaignItem)),
                      lowerBound: formatUsdAmount({
                          amount: lowerBound,
                          cutoff: false,
                      }),
                      upperBound: formatUsdAmount({
                          amount: upperBound,
                          cutoff: false,
                      }),
                      maxApr: formatPercentage({
                          percentage: maxApr,
                      }),
                      bold: (chunks) => (
                          <span className={styles.boldText}>{chunks}</span>
                      ),
                      apr: (chunks) => (
                          <span className={styles.aprText}>{chunks}</span>
                      ),
                  })}
        </Typography>
    );
}
