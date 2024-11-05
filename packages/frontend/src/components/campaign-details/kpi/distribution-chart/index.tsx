import {
    Bar,
    ComposedChart,
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
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

export interface DistributionChartData {
    from: number;
    to: number;
    distributions: KpiRewardDistribution[];
    distributed: number;
    reimbursed: number;
    empty?: number;
}

interface DistributionChartProps {
    chain?: SupportedChain;
    kpiMeasurements?: KpiMeasurement[];
    loading?: boolean;
}

const WEEK_HOURS = 24 * 7;

export function DistributionChart({
    chain,
    kpiMeasurements,
    loading,
}: DistributionChartProps) {
    const t = useTranslations("campaignDetails.kpi.charts");

    const chartData = useMemo(() => {
        if (!kpiMeasurements || kpiMeasurements.length === 0) return [];

        const data: DistributionChartData[] = kpiMeasurements.map(
            (measurement) => {
                const { from, to, distributions, percentage } = measurement;

                const distributedPercentage = percentage;
                const reimbursedPercentage = 1 - percentage;

                return {
                    from,
                    to,
                    distributions,
                    distributed: distributedPercentage,
                    reimbursed: reimbursedPercentage,
                };
            },
        );

        // TODO: not too sure about this
        // add placeholder data to fill a day of distributions,
        // ensuring the chart doesn’t appear too empty
        const emptyHours = WEEK_HOURS - data.length;
        for (let hour = 0; hour < emptyHours; hour++) {
            data.push({
                from: dayjs
                    .unix(data[data.length - 1].from)
                    .add(1, "hours")
                    .unix(),
                to: 0,
                distributed: 0,
                reimbursed: 0,
                empty: 1,
                distributions: [],
            });
        }

        // add hours before the measurements
        // const emptyHours = DAY_HOURS - data.length;
        // for (let hour = 0; hour < emptyHours; hour++) {
        //     data.unshift({
        //         from: dayjs.unix(data[0].from).subtract(1, "hours").unix(),
        //         to: 0,
        //         distributed: 0,
        //         reimbursed: 0,
        //         empty: 1,
        //         distributions: [],
        //     });
        // }

        return data;
    }, [kpiMeasurements]);

    // TODO: add loading state?
    if (loading || !kpiMeasurements || kpiMeasurements.length === 0)
        return null;

    return (
        <div className={styles.root}>
            <Typography weight="medium" light uppercase variant="sm">
                {t("distributions")}
            </Typography>
            <ResponsiveContainer width="100%" className={styles.container}>
                <ComposedChart
                    data={chartData}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    style={{ cursor: "pointer" }}
                >
                    <Bar
                        dataKey="distributed"
                        stackId="distribution"
                        fill="#6CFF95"
                        barSize={50}
                    />
                    <Bar
                        dataKey="reimbursed"
                        stackId="distribution"
                        fill="#9CA3AF"
                        barSize={50}
                    />
                    <Bar
                        dataKey="empty"
                        stackId="distribution"
                        fill="#FFF"
                        barSize={50}
                    />

                    <YAxis ticks={[0, 1]} hide />

                    <XAxis
                        type="category"
                        dataKey="from"
                        height={20}
                        padding={{ left: 0, right: 0 }}
                        tickSize={4}
                        minTickGap={50}
                        axisLine={false}
                        // TODO: add typography
                        tickFormatter={(timestamp: number) =>
                            dayjs.unix(timestamp).format("DD MMM")
                        }
                    />

                    <Tooltip
                        position={{ y: -100 }}
                        isAnimationActive={false}
                        cursor={false}
                        content={<TooltipContent chain={chain} />}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
