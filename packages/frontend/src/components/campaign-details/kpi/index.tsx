import type { NamedCampaign } from "@/src/hooks/useCampaign";
import { TextField, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { KpiMetric, type KpiSpecification } from "@metrom-xyz/sdk";
import { useMemo } from "react";
import { KpiSimulationChart } from "../../kpi-simulation-chart";
import { getReachedGoalPercentage } from "@/src/utils/kpi";
import { useKpiMeasurements } from "@/src/hooks/useKpiMeasurements";
import { DistributionChart } from "./distribution-chart";
import { AverageDistributionChart } from "./average-distribution-chart";

import styles from "./styles.module.css";

interface KpiProps {
    campaign?: NamedCampaign;
    loading: boolean;
}

export function Kpi({ campaign, loading }: KpiProps) {
    const t = useTranslations("campaignDetails.kpi");

    const specificationLoading = loading || !campaign;

    const { kpiMeasurements, loading: loadingKpiMeasurements } =
        useKpiMeasurements(campaign);

    const {
        goal: { lowerUsdTarget, upperUsdTarget },
        minimumPayoutPercentage,
    } = useMemo<KpiSpecification>(() => {
        if (!campaign?.specification?.kpi)
            return {
                goal: {
                    metric: KpiMetric.RangePoolTvl,
                    lowerUsdTarget: 0,
                    upperUsdTarget: 0,
                },
            };

        const { goal, minimumPayoutPercentage } = campaign.specification.kpi;

        return { goal, minimumPayoutPercentage };
    }, [campaign]);

    const reachedGoalPercentage = useMemo(() => {
        if (!campaign?.pool.usdTvl) return 0;

        return getReachedGoalPercentage(
            campaign.pool.usdTvl,
            lowerUsdTarget,
            upperUsdTarget,
        );
    }, [campaign, lowerUsdTarget, upperUsdTarget]);

    if (!campaign?.specification?.kpi) return null;

    return (
        <div className={styles.root}>
            <Typography variant="lg" weight="medium" uppercase>
                {t("title")}
            </Typography>
            <div className={styles.card}>
                <div className={styles.wrapper}>
                    <div className={styles.leftContentWrapper}>
                        <TextField
                            boxed
                            variant="xl"
                            label={t("lowerBound")}
                            loading={specificationLoading}
                            value={formatUsdAmount(lowerUsdTarget)}
                        />
                        <TextField
                            boxed
                            variant="xl"
                            label={t("upperBound")}
                            loading={specificationLoading}
                            value={formatUsdAmount(upperUsdTarget)}
                        />
                        <TextField
                            boxed
                            variant="xl"
                            label={t("minimumPayout")}
                            loading={specificationLoading}
                            value={formatPercentage(
                                minimumPayoutPercentage
                                    ? minimumPayoutPercentage * 100
                                    : 0,
                            )}
                        />
                        <TextField
                            boxed
                            variant="xl"
                            label={t("goalReached")}
                            loading={specificationLoading}
                            value={formatPercentage(
                                reachedGoalPercentage * 100,
                            )}
                        />
                    </div>
                    <div className={styles.chartWrapper}>
                        <Typography
                            variant="sm"
                            uppercase
                            light
                            weight="medium"
                        >
                            {t("chart")}
                        </Typography>
                        <div>
                            <KpiSimulationChart
                                loading={specificationLoading}
                                poolUsdTvl={campaign.pool.usdTvl}
                                totalRewardsUsd={
                                    campaign.rewards.amountUsdValue
                                }
                                lowerUsdTarget={lowerUsdTarget}
                                upperUsdTarget={upperUsdTarget}
                                minimumPayoutPercentage={
                                    minimumPayoutPercentage
                                }
                                className={styles.chartContainer}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.distributionChartsWrapper}>
                    <DistributionChart
                        chain={campaign.chainId}
                        loading={loadingKpiMeasurements}
                        kpiMeasurements={kpiMeasurements}
                    />
                    <AverageDistributionChart loading={false} />
                </div>
            </div>
        </div>
    );
}
