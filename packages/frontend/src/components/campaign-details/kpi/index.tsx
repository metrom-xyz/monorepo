import { Accordion, InfoTooltip, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    DistributablesType,
    KpiMetric,
    Status,
    type KpiSpecification,
} from "@metrom-xyz/sdk";
import { useMemo } from "react";
import { KpiSimulationChart } from "../../kpi-simulation-chart";
import { useKpiMeasurements } from "@/src/hooks/useKpiMeasurements";
import { DistributionChart } from "./distribution-chart";
import { AverageDistributionChart } from "./average-distribution-chart";
import { KpiAprSummary } from "../../kpi-apr-summary";
import type {
    Campaign,
    DistributablesNamedCampaign,
} from "@/src/types/campaign/common";
import { useWindowSize } from "react-use";

import styles from "./styles.module.css";

interface KpiProps {
    campaign?: DistributablesNamedCampaign<DistributablesType.Tokens>;
    loading: boolean;
}

export function Kpi({ campaign, loading }: KpiProps) {
    const t = useTranslations("campaignDetails.kpi");

    const { width } = useWindowSize();
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

    if (!campaign?.specification?.kpi) return null;

    const specificationLoading = loading || !campaign;
    // const reachedGoalPercentage = measurement || 0;

    let usdTvl: number | undefined;
    if (campaign.status === Status.Expired)
        usdTvl =
            loadingKpiMeasurements || kpiMeasurements.length === 0
                ? undefined
                : kpiMeasurements[kpiMeasurements.length - 1].value;
    else usdTvl = (campaign as Campaign).usdTvl;

    return (
        <div className={styles.root}>
            <div className={styles.titleWrapper}>
                <Typography size="lg" weight="medium" uppercase>
                    {t("title")}
                </Typography>
                {campaign.status !== Status.Expired && (
                    <InfoTooltip className={styles.infoTooltip}>
                        <KpiAprSummary campaign={campaign as Campaign} />
                    </InfoTooltip>
                )}
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
                                targetValueName: campaign.targetValueName,
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
                                targetValueName={campaign.targetValueName}
                                targetUsdValue={usdTvl}
                                campaignEnded={
                                    campaign.status === Status.Expired
                                }
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
                    </div>
                </div>
            </Accordion>
        </div>
    );
}
