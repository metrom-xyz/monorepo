import { Accordion, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    DistributablesType,
    KpiMetric,
    SpecificationDistributionType,
    Status,
    type KpiDistributionSpecification,
} from "@metrom-xyz/sdk";
import { useMemo } from "react";
import { KpiSimulationChart } from "../../../../kpi-simulation-chart";
import { useKpiMeasurements } from "@/src/hooks/useKpiMeasurements";
import { DistributionChart } from "./distribution-chart";
import { AverageDistributionChart } from "./average-distribution-chart";
import { KpiAprSummary } from "../../../../kpi-apr-summary";
import type {
    AggregatedCampaignItem,
    DistributablesNamedCampaign,
} from "@/src/types/campaign";
import { useWindowSize } from "react-use";

import styles from "./styles.module.css";

interface KpiProps {
    item?: DistributablesNamedCampaign<
        DistributablesType.Tokens,
        AggregatedCampaignItem
    >;
}

export function Kpi({ item }: KpiProps) {
    const t = useTranslations("campaignDetails.kpi");

    const { width } = useWindowSize();
    const { kpiMeasurements, loading: loadingKpiMeasurements } =
        useKpiMeasurements({ campaign: item });

    const {
        goal: { lowerUsdTarget, upperUsdTarget },
        measurement,
        minimumPayoutPercentage,
    } = useMemo<KpiDistributionSpecification>(() => {
        if (
            item?.specification?.distribution?.type !==
            SpecificationDistributionType.Kpi
        )
            return {
                type: SpecificationDistributionType.Kpi,
                goal: {
                    metric: KpiMetric.RangePoolTvl,
                    lowerUsdTarget: 0,
                    upperUsdTarget: 0,
                },
            };

        const { goal, measurement, minimumPayoutPercentage } =
            item.specification.distribution;

        return { goal, measurement, minimumPayoutPercentage };
    }, [item]);

    if (!item?.specification?.distribution) return null;

    const specificationLoading = !item;
    // const reachedGoalPercentage = measurement || 0;

    let usdTvl: number | undefined;
    if (item.status === Status.Expired)
        usdTvl =
            loadingKpiMeasurements || kpiMeasurements.length === 0
                ? undefined
                : kpiMeasurements[kpiMeasurements.length - 1].value;
    else usdTvl = item.usdTvl;

    return (
        <div className={styles.root}>
            {item.status !== Status.Expired && <KpiAprSummary item={item} />}
            <div className={styles.distributionChartsWrapper}>
                <DistributionChart
                    item={item}
                    loading={loadingKpiMeasurements}
                    minimumPayoutPercentage={minimumPayoutPercentage}
                />
                <AverageDistributionChart
                    chain={item.chainId}
                    loading={loadingKpiMeasurements}
                    distributables={item.distributables}
                    kpiMeasurementPercentage={measurement}
                    minimumPayoutPercentage={
                        item.specification.distribution.minimumPayoutPercentage
                    }
                />
            </div>
            <Accordion title={t("details")} className={styles.detailsAccordion}>
                <div className={styles.wrapper}>
                    <div className={styles.chart}>
                        <Typography
                            size="sm"
                            uppercase
                            variant="tertiary"
                            weight="medium"
                        >
                            {t("chart", {
                                targetValueName: item.targetValueName,
                            })}
                        </Typography>
                        <div className={styles.chartWrapper}>
                            <KpiSimulationChart
                                complex={width > 640}
                                tooltipSize="sm"
                                loading={
                                    specificationLoading ||
                                    loadingKpiMeasurements
                                }
                                targetValueName={item.targetValueName}
                                targetUsdValue={usdTvl}
                                campaignEnded={item.status === Status.Expired}
                                campaignDurationSeconds={item.to - item.from}
                                totalRewardsUsd={
                                    item.distributables.amountUsdValue
                                }
                                lowerUsdTarget={lowerUsdTarget}
                                upperUsdTarget={upperUsdTarget}
                                minimumPayoutPercentage={
                                    minimumPayoutPercentage
                                }
                            />
                        </div>
                    </div>
                </div>
            </Accordion>
        </div>
    );
}
