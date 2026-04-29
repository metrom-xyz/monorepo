import { Accordion, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    DistributablesType,
    KpiMetric,
    SpecificationDistributionType,
    Status,
    type KpiDistributionSpecification,
    type Specification,
} from "@metrom-xyz/sdk";
import { useMemo } from "react";
import { KpiSimulationChart } from "../../../../kpi-simulation-chart";
import { useKpiMeasurements } from "@/src/hooks/useKpiMeasurements";
import { DistributionChart } from "./distribution-chart";
import { AverageDistributionChart } from "./average-distribution-chart";
import { KpiAprSummary } from "../../../../kpi-apr-summary";
import type {
    CampaignItem,
    DistributablesNamedCampaign,
} from "@/src/types/campaign/common";
import { useWindowSize } from "react-use";

import styles from "./styles.module.css";

interface KpiProps {
    campaignItem?: DistributablesNamedCampaign<
        DistributablesType.Tokens,
        CampaignItem & {
            specification: Specification & {
                distribution: KpiDistributionSpecification;
            };
        }
    >;
}

export function Kpi({ campaignItem }: KpiProps) {
    const t = useTranslations("campaignDetails.kpi");

    const { width } = useWindowSize();
    const { kpiMeasurements, loading: loadingKpiMeasurements } =
        useKpiMeasurements({ campaign: campaignItem });

    const {
        goal: { lowerUsdTarget, upperUsdTarget },
        measurement,
        minimumPayoutPercentage,
    } = useMemo<KpiDistributionSpecification>(() => {
        if (
            campaignItem?.specification?.distribution?.type !==
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
            campaignItem.specification.distribution;

        return {
            type: SpecificationDistributionType.Kpi,
            goal,
            measurement,
            minimumPayoutPercentage,
        };
    }, [campaignItem]);

    if (!campaignItem?.specification?.distribution) return null;

    const specificationLoading = !campaignItem;
    // const reachedGoalPercentage = measurement || 0;

    let usdTvl: number | undefined;
    if (campaignItem.status === Status.Expired)
        usdTvl =
            loadingKpiMeasurements || kpiMeasurements.length === 0
                ? undefined
                : kpiMeasurements[kpiMeasurements.length - 1].value;
    else usdTvl = campaignItem.usdTvl;

    const { chainId, status, from, to, targetValueName, distributables } =
        campaignItem;

    return (
        <div className={styles.root}>
            {campaignItem.status !== Status.Expired && (
                <KpiAprSummary campaignItem={campaignItem} />
            )}
            <div className={styles.distributionChartsWrapper}>
                <DistributionChart
                    item={campaignItem}
                    loading={loadingKpiMeasurements}
                    minimumPayoutPercentage={minimumPayoutPercentage}
                />
                <AverageDistributionChart
                    chain={chainId}
                    loading={loadingKpiMeasurements}
                    distributables={distributables}
                    kpiMeasurementPercentage={measurement}
                    minimumPayoutPercentage={
                        campaignItem.specification.distribution
                            .minimumPayoutPercentage
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
                                targetValueName,
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
                                targetValueName={targetValueName}
                                targetUsdValue={usdTvl}
                                campaignEnded={status === Status.Expired}
                                campaignDurationSeconds={to - from}
                                totalRewardsUsd={distributables.amountUsdValue}
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
