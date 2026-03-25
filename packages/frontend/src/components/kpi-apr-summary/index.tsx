import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import {
    DistributablesType,
    SpecificationDistributionType,
    TargetType,
} from "@metrom-xyz/sdk";
import type { AggregatedCampaignItem } from "@/src/types/campaign";
import { useMemo } from "react";
import { getCampaignApr } from "@/src/utils/campaign";
import { getCampaignAprTargetText } from "@/src/utils/kpi";
import { useLiquidityByAddresses } from "@/src/hooks/useLiquidityByAddresses";
import { usePool } from "@/src/hooks/usePool";

import styles from "./styles.module.css";

interface KpiAprSummaryProps {
    item?: AggregatedCampaignItem;
}

// TODO: add support for non amm pool liquidity campaigns
export function KpiAprSummary({ item }: KpiAprSummaryProps) {
    const t = useTranslations("kpiAprSummary");

    const tokensCampaign = item?.isDistributing(DistributablesType.Tokens);

    const ammPoolLiquidityCampaign =
        item?.isTargeting(TargetType.AmmPoolLiquidity) ||
        item?.isTargeting(TargetType.JumperWhitelistedAmmPoolLiquidity);

    const { loading: loadingPool, pool } = usePool({
        id: ammPoolLiquidityCampaign ? item?.target.pool.id : undefined,
        chainId: item?.target.chainId,
        chainType: item?.target.chainType,
        enabled: item && ammPoolLiquidityCampaign,
    });

    const { loading: loadingLiquidityByAddresses, liquidityByAddresses } =
        useLiquidityByAddresses({
            type: item?.restrictions?.type,
            pool: pool,
            addresses: item?.restrictions?.list,
            enabled: !!pool && !!item?.restrictions,
        });

    const maxApr = useMemo(() => {
        if (
            !item ||
            !tokensCampaign ||
            item?.specification?.distribution?.type !==
                SpecificationDistributionType.Kpi ||
            loadingPool ||
            loadingLiquidityByAddresses ||
            (item.restrictions && !liquidityByAddresses)
        )
            return undefined;

        const { distribution } = item.specification;

        return getCampaignApr({
            usdRewards: item.distributables.amountUsdValue,
            duration: item.to - item.from,
            usdTvl: distribution.goal.upperUsdTarget,
            kpiDistribution: distribution,
            liquidity: pool?.liquidity,
            liquidityByAddresses,
            // TODO: add liquidity in range
            // range: liquidityInRange,
        });
    }, [
        item,
        liquidityByAddresses,
        loadingLiquidityByAddresses,
        loadingPool,
        tokensCampaign,
        pool?.liquidity,
    ]);

    const lowerBound = item?.specification?.distribution?.goal.lowerUsdTarget;
    const upperBound = item?.specification?.distribution?.goal.upperUsdTarget;
    const minimumPayout =
        item?.specification?.distribution?.minimumPayoutPercentage;

    if (loadingPool || loadingLiquidityByAddresses)
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.loading} />
                <div className={styles.loading} />
                <div className={styles.loading} />
            </div>
        );

    if (!maxApr || !item) return null;

    return (
        <Typography size="sm" className={styles.text}>
            {minimumPayout
                ? t.rich("textWithMinPayout", {
                      targetValueName: item.targetValueName,
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
                      targetValueName: item.targetValueName,
                      target: t(getCampaignAprTargetText(item)),
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
