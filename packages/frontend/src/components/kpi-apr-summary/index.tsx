import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { type Campaign, DistributablesType, TargetType } from "@metrom-xyz/sdk";
import { useMemo } from "react";
import { getAmmPoolLiquidityCampaignApr } from "@/src/utils/campaign";

import styles from "./styles.module.css";

interface KpiAprSummaryProps {
    campaign?: Campaign;
}

// TODO: add support for non amm pool liquidity campaigns
export function KpiAprSummary({ campaign }: KpiAprSummaryProps) {
    const t = useTranslations("kpiAprSummary");

    const ammCampaign = campaign?.isTargeting(TargetType.AmmPoolLiquidity);
    const tokensCampaign = campaign?.isDistributing(DistributablesType.Tokens);

    const maxApr = useMemo(() => {
        if (!campaign || !tokensCampaign || !campaign.specification?.kpi)
            return undefined;

        const { kpi } = campaign.specification;

        if (ammCampaign)
            return getAmmPoolLiquidityCampaignApr({
                usdRewards: campaign.distributables.amountUsdValue,
                duration: campaign.to - campaign.from,
                poolUsdTvl: kpi.goal.upperUsdTarget,
                kpiSpecification: kpi,
                // TODO: add liquidity in range?
                // range: liquidityInRange,
            });

        return undefined;
    }, [campaign, ammCampaign, tokensCampaign]);

    const lowerBound = campaign?.specification?.kpi?.goal.lowerUsdTarget;
    const upperBound = campaign?.specification?.kpi?.goal.upperUsdTarget;

    if (!maxApr) return null;

    return (
        <Typography size="sm" light className={styles.text}>
            {t.rich("ammPoolLiquidity", {
                lowerBound: formatUsdAmount({
                    amount: lowerBound,
                }),
                upperBound: formatUsdAmount({
                    amount: upperBound,
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
