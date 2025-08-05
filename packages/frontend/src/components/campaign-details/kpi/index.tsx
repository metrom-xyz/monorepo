import { Card, InfoTooltip, TextField, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import {
    DistributablesType,
    KpiMetric,
    Status,
    TargetType,
    type DistributablesCampaign,
    type KpiSpecification,
} from "@metrom-xyz/sdk";
import { useMemo } from "react";
import { KpiSimulationChart } from "../../kpi-simulation-chart";
import { useKpiMeasurements } from "@/src/hooks/useKpiMeasurements";
import { DistributionChart } from "./distribution-chart";
import { AverageDistributionChart } from "./average-distribution-chart";
import { KpiAprSummary } from "../../kpi-apr-summary";

import styles from "./styles.module.css";

interface KpiProps {
    campaign?: DistributablesCampaign<DistributablesType.Tokens>;
    loading: boolean;
}

export function Kpi({ campaign, loading }: KpiProps) {
    const t = useTranslations("campaignDetails.kpi");

    const specificationLoading = loading || !campaign;

    const { kpiMeasurements, loading: loadingKpiMeasurements } =
        useKpiMeasurements({ campaign });

    const {
        goal: { lowerUsdTarget, upperUsdTarget },
        measurement,
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

        const { goal, measurement, minimumPayoutPercentage } =
            campaign.specification.kpi;

        return { goal, measurement, minimumPayoutPercentage };
    }, [campaign]);

    if (
        !campaign?.specification?.kpi ||
        !campaign.isTargeting(TargetType.AmmPoolLiquidity)
    )
        return null;

    const reachedGoalPercentage = measurement || 0;

    let poolUsdTvl;
    if (campaign.status === Status.Ended) {
        poolUsdTvl =
            loadingKpiMeasurements || kpiMeasurements.length === 0
                ? undefined
                : kpiMeasurements[kpiMeasurements.length - 1].value;
    } else {
        poolUsdTvl = campaign.target.pool.usdTvl;
    }

    return (
        <div className={styles.root}>
            <div className={styles.titleWrapper}>
                <Typography size="lg" weight="medium" uppercase>
                    {t("title")}
                </Typography>
                {campaign.status !== Status.Ended && (
                    <InfoTooltip placement="top-start">
                        <KpiAprSummary campaign={campaign} />
                    </InfoTooltip>
                )}
            </div>
            <div className={styles.card}>
                <div className={styles.wrapper}>
                    <div className={styles.leftContentWrapper}>
                        <TextField
                            boxed
                            size="xl"
                            label={t("lowerBound")}
                            loading={specificationLoading}
                            value={formatUsdAmount({
                                amount: lowerUsdTarget,
                                cutoff: false,
                            })}
                        />
                        <TextField
                            boxed
                            size="xl"
                            label={t("upperBound")}
                            loading={specificationLoading}
                            value={formatUsdAmount({
                                amount: upperUsdTarget,
                                cutoff: false,
                            })}
                        />
                        <TextField
                            boxed
                            size="xl"
                            label={t("minimumPayout")}
                            loading={specificationLoading}
                            value={formatPercentage({
                                percentage: minimumPayoutPercentage
                                    ? minimumPayoutPercentage * 100
                                    : 0,
                            })}
                        />
                        <TextField
                            boxed
                            size="xl"
                            label={t("averageGoalReached")}
                            loading={specificationLoading}
                            value={
                                campaign.status === Status.Upcoming
                                    ? "-"
                                    : formatPercentage({
                                          percentage:
                                              reachedGoalPercentage * 100,
                                      })
                            }
                        />
                    </div>
                    <Card className={styles.chart}>
                        <Typography size="sm" uppercase light weight="medium">
                            {t("chart")}
                        </Typography>
                        <div className={styles.chartWrapper}>
                            <KpiSimulationChart
                                loading={
                                    specificationLoading ||
                                    loadingKpiMeasurements
                                }
                                usdTvl={poolUsdTvl}
                                campaignEnded={campaign.status === Status.Ended}
                                campaignDurationSeconds={
                                    campaign.to - campaign.from
                                }
                                totalRewardsUsd={
                                    campaign.distributables.amountUsdValue
                                }
                                lowerUsdTarget={lowerUsdTarget}
                                upperUsdTarget={upperUsdTarget}
                                minimumPayoutPercentage={
                                    minimumPayoutPercentage
                                }
                            />
                        </div>
                    </Card>
                </div>
                <div className={styles.distributionChartsWrapper}>
                    <DistributionChart
                        campaign={campaign}
                        loading={loadingKpiMeasurements}
                        minimumPayoutPercentage={minimumPayoutPercentage}
                    />
                    <AverageDistributionChart
                        chain={campaign.chainId}
                        loading={loadingKpiMeasurements}
                        distributables={campaign.distributables}
                        kpiMeasurementPercentage={measurement}
                        minimumPayoutPercentage={
                            campaign.specification.kpi.minimumPayoutPercentage
                        }
                    />
                </div>
            </div>
        </div>
    );
}
