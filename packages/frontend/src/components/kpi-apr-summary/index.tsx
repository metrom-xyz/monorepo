import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { DistributablesType } from "@metrom-xyz/sdk";
import type { Campaign } from "@/src/types/campaign";
import { useMemo } from "react";
import { getCampaignApr } from "@/src/utils/campaign";
import { getCampaignAprTargetText } from "@/src/utils/kpi";

import styles from "./styles.module.css";

interface KpiAprSummaryProps {
    campaign?: Campaign;
}

// TODO: add support for non amm pool liquidity campaigns
export function KpiAprSummary({ campaign }: KpiAprSummaryProps) {
    const t = useTranslations("kpiAprSummary");

    const tokensCampaign = campaign?.isDistributing(DistributablesType.Tokens);

    const maxApr = useMemo(() => {
        if (!campaign || !tokensCampaign || !campaign.specification?.kpi)
            return undefined;

        const { kpi } = campaign.specification;

        return getCampaignApr({
            usdRewards: campaign.distributables.amountUsdValue,
            duration: campaign.to - campaign.from,
            usdTvl: kpi.goal.upperUsdTarget,
            liquidity: campaign.getTargetLiquidity(),
            kpiSpecification: kpi,
            // TODO: add liquidity in range?
            // range: liquidityInRange,
        });
    }, [campaign, tokensCampaign]);

    const lowerBound = campaign?.specification?.kpi?.goal.lowerUsdTarget;
    const upperBound = campaign?.specification?.kpi?.goal.upperUsdTarget;
    const minimumPayout = campaign?.specification?.kpi?.minimumPayoutPercentage;

    if (!maxApr) return null;

    return (
        <Typography size="sm" light className={styles.text}>
            {minimumPayout
                ? t.rich("textWithMinPayout", {
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
                      target: t(getCampaignAprTargetText(campaign) as any),
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
