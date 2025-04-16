import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useMemo } from "react";
import type { KpiMeasurement, KpiRewardDistribution } from "@metrom-xyz/sdk";
import dayjs from "dayjs";
import { TooltipContent } from "./tooltip";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { Card, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { getAggregatedKpiMeasurements } from "@/src/utils/kpi";
import classNames from "classnames";
import { NoDistributionsIcon } from "@/src/assets/no-distributions-icon";

import styles from "./styles.module.css";

export interface DistributionChartData {
    from: number;
    to: number;
    distributions: KpiRewardDistribution[];
    distributed: number;
    reimbursed: number;
}

interface DistributionChartProps {
    chain?: SupportedChain;
    kpiMeasurements?: KpiMeasurement[];
    minimumPayoutPercentage?: number;
    loading?: boolean;
}

const TWO_HOURS_SECONDS = 60 * 60 * 2;
const FOUR_HOURS_SECONDS = TWO_HOURS_SECONDS * 2;
const TWELVE_HOURS_SECONDS = FOUR_HOURS_SECONDS * 3;
const ONE_DAY_SECONDS = 60 * 60 * 24;
const TWO_DAYS_SECONDS = ONE_DAY_SECONDS * 2;
const FOURTEEN_DAYS_SECONDS = ONE_DAY_SECONDS * 14;

export function DistributionChart({
    chain,
    kpiMeasurements,
    minimumPayoutPercentage = 0,
    loading,
}: DistributionChartProps) {
    const t = useTranslations("campaignDetails.kpi.charts");

    const chartData: DistributionChartData[] = useMemo(() => {
        if (!kpiMeasurements || kpiMeasurements.length === 0) return [];

        const fullTimeRange =
            kpiMeasurements[kpiMeasurements.length - 1].to -
            kpiMeasurements[0].from;

        let aggregatedMeasurements;
        if (fullTimeRange < ONE_DAY_SECONDS) {
            aggregatedMeasurements = kpiMeasurements;
        } else if (fullTimeRange < TWO_DAYS_SECONDS) {
            aggregatedMeasurements = getAggregatedKpiMeasurements(
                kpiMeasurements,
                TWO_HOURS_SECONDS,
            );
        } else if (fullTimeRange < FOURTEEN_DAYS_SECONDS) {
            aggregatedMeasurements = getAggregatedKpiMeasurements(
                kpiMeasurements,
                FOUR_HOURS_SECONDS,
            );
        } else {
            aggregatedMeasurements = getAggregatedKpiMeasurements(
                kpiMeasurements,
                TWELVE_HOURS_SECONDS,
            );
        }

        return aggregatedMeasurements.map((measurement) => {
            const { percentage } = measurement;

            const normalizedPercentage = Math.max(Math.min(percentage, 1), 0);
            const distributedPercentage =
                minimumPayoutPercentage +
                (1 - minimumPayoutPercentage) * normalizedPercentage;

            return {
                ...measurement,
                distributed: distributedPercentage,
                reimbursed: 1 - distributedPercentage,
            };
        });
    }, [kpiMeasurements, minimumPayoutPercentage]);

    if (loading)
        return (
            <Card className={styles.root}>
                <Typography weight="medium" light uppercase size="sm">
                    {t("distributions")}
                </Typography>
                <div className={classNames(styles.container, styles.loading)}>
                    {Array.from({ length: 25 }).map((_, index) => (
                        <div key={index} className={styles.loadingBar}></div>
                    ))}
                </div>
            </Card>
        );

    if (!kpiMeasurements || kpiMeasurements.length === 0) {
        return (
            <Card className={styles.root}>
                <Typography weight="medium" light uppercase size="sm">
                    {t("distributions")}
                </Typography>
                <div className={classNames(styles.container, styles.empty)}>
                    <NoDistributionsIcon />
                    <Typography uppercase weight="medium" size="sm">
                        {t("noDistribution")}
                    </Typography>
                </div>
            </Card>
        );
    }

    return (
        <Card className={styles.root}>
            <Typography weight="medium" light uppercase size="sm">
                {t("distributions")}
            </Typography>
            <ResponsiveContainer width="100%" className={styles.container}>
                <BarChart data={chartData} style={{ cursor: "pointer" }}>
                    <YAxis ticks={[0, 1]} hide />
                    <XAxis
                        type="category"
                        dataKey="to"
                        height={20}
                        padding={{ left: 0, right: 0 }}
                        tickSize={4}
                        minTickGap={50}
                        axisLine={false}
                        tick={<Tick />}
                    />

                    <Bar
                        dataKey="distributed"
                        stackId="distribution"
                        className={styles.distributedBar}
                    />
                    <Bar
                        dataKey="reimbursed"
                        stackId="distribution"
                        radius={[6, 6, 0, 0]}
                        className={styles.reimbursedBar}
                    />

                    <Tooltip
                        position={{ y: -100 }}
                        isAnimationActive={false}
                        cursor={false}
                        content={<TooltipContent chain={chain} />}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}

interface TickProps {
    payload?: {
        value: number;
    };
    x?: number;
    y?: number;
}

function Tick({ payload, x, y }: TickProps) {
    if (!payload?.value) return null;

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={12}
                fontSize={12}
                textAnchor="middle"
                className={styles.timeTick}
            >
                {dayjs.unix(payload.value).format("DD MMM HH:mm")}
            </text>
        </g>
    );
}
