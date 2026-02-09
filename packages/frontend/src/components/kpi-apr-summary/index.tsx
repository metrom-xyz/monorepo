import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { DistributablesType, TargetType } from "@metrom-xyz/sdk";
import type { Campaign } from "@/src/types/campaign/common";
import { useMemo } from "react";
import { getCampaignApr } from "@/src/utils/campaign";
import { getCampaignAprTargetText } from "@/src/utils/kpi";
import { useLiquidityByAddresses } from "@/src/hooks/useLiquidityByAddresses";
import { usePool } from "@/src/hooks/usePool";

import styles from "./styles.module.css";

interface KpiAprSummaryProps {
    campaign?: Campaign;
}

// TODO: add support for non amm pool liquidity campaigns
export function KpiAprSummary({ campaign }: KpiAprSummaryProps) {
    const t = useTranslations("kpiAprSummary");

    const tokensCampaign = campaign?.isDistributing(DistributablesType.Tokens);
    const ammPoolLiquidityCampaign =
        campaign?.isTargeting(TargetType.AmmPoolLiquidity) ||
        campaign?.isTargeting(TargetType.JumperWhitelistedAmmPoolLiquidity);

    const { loading: loadingPool, pool } = usePool({
        id: ammPoolLiquidityCampaign ? campaign?.target.pool.id : undefined,
        chainId: campaign?.target.chainId,
        chainType: campaign?.target.chainType,
        enabled: campaign && ammPoolLiquidityCampaign,
    });

    const { loading: loadingLiquidityByAddresses, liquidityByAddresses } =
        useLiquidityByAddresses({
            type: campaign?.restrictions?.type,
            pool: pool,
            addresses: campaign?.restrictions?.list,
            enabled: !!pool && !!campaign?.restrictions,
        });

    const maxApr = useMemo(() => {
        if (
            !campaign ||
            !tokensCampaign ||
            !campaign.specification?.kpi ||
            loadingPool ||
            loadingLiquidityByAddresses ||
            (campaign.restrictions && !liquidityByAddresses)
        )
            return undefined;

        const { kpi } = campaign.specification;

        return getCampaignApr({
            usdRewards: campaign.distributables.amountUsdValue,
            duration: campaign.to - campaign.from,
            usdTvl: kpi.goal.upperUsdTarget,
            kpiSpecification: kpi,
            liquidity: pool?.liquidity,
            liquidityByAddresses,
            // TODO: add liquidity in range
            // range: liquidityInRange,
        });
    }, [
        campaign,
        liquidityByAddresses,
        loadingLiquidityByAddresses,
        loadingPool,
        tokensCampaign,
        pool?.liquidity,
    ]);

    const lowerBound = campaign?.specification?.kpi?.goal.lowerUsdTarget;
    const upperBound = campaign?.specification?.kpi?.goal.upperUsdTarget;
    const minimumPayout = campaign?.specification?.kpi?.minimumPayoutPercentage;

    if (loadingPool || loadingLiquidityByAddresses)
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.loading} />
                <div className={styles.loading} />
                <div className={styles.loading} />
            </div>
        );

    if (!maxApr || !campaign) return null;

    return (
        <Typography size="sm" variant="tertiary" className={styles.text}>
            {minimumPayout
                ? t.rich("textWithMinPayout", {
                      targetValueName: campaign.targetValueName,
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
                      targetValueName: campaign.targetValueName,
                      target: t(getCampaignAprTargetText(campaign)),
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
