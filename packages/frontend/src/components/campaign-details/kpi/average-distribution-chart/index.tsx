import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, Typography } from "@metrom-xyz/ui";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { formatPercentage } from "@/src/utils/format";
import classNames from "classnames";

import styles from "./styles.module.css";

interface AverageDistributionChartProps {
    loading?: boolean;
    kpiMeasurementPercentage?: number;
    minimumPayoutPercentage?: number;
}

interface ChartData {
    type: "reimbursed" | "distributed";
    color?: string;
    value: number;
}

export function AverageDistributionChart({
    loading,
    kpiMeasurementPercentage,
    minimumPayoutPercentage = 0,
}: AverageDistributionChartProps) {
    const t = useTranslations("campaignDetails.kpi.charts");

    const chartData = useMemo(() => {
        if (!kpiMeasurementPercentage) return undefined;

        const normalizedKpiMeasurementPercentage = Math.max(
            Math.min(kpiMeasurementPercentage, 1),
            0,
        );
        const distributedPercentage =
            (minimumPayoutPercentage +
                (1 - minimumPayoutPercentage) *
                    normalizedKpiMeasurementPercentage) *
            100;
        const reimbursedPercentage = 100 - distributedPercentage;

        const data: ChartData[] = [];
        if (distributedPercentage > 0) {
            data.push({
                type: "distributed",
                value: distributedPercentage,
            });
        }

        if (reimbursedPercentage > 0) {
            data.push({
                type: "reimbursed",
                value: reimbursedPercentage,
            });
        }

        return data;
    }, [kpiMeasurementPercentage, minimumPayoutPercentage]);

    return (
        <Card className={styles.root}>
            <Typography uppercase weight="medium" light size="sm">
                {t("averageDistribution")}
            </Typography>
            <div
                className={classNames(styles.chartWrapper, {
                    [styles.loading]: !chartData || loading,
                })}
            >
                {chartData && !loading && (
                    <PieChart height={250} width={250}>
                        <Pie
                            dataKey="value"
                            animationEasing="ease-in-out"
                            animationDuration={500}
                            cornerRadius={6}
                            data={chartData}
                            innerRadius={70}
                            outerRadius={120}
                            startAngle={90}
                            endAngle={450}
                            minAngle={5}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    strokeWidth={5}
                                    className={classNames(styles.cell, {
                                        [styles[entry.type]]: true,
                                    })}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            active
                            defaultIndex={0}
                            content={<RankTooltip />}
                        />
                    </PieChart>
                )}
            </div>
        </Card>
    );
}

function RankTooltip({ payload }: any) {
    const t = useTranslations("campaignDetails.kpi.charts");

    if (!payload || !payload.length) return null;

    const color = payload[0].payload.color;

    return (
        <div className={styles.tooltipWrapper}>
            <Typography
                weight="bold"
                uppercase
                style={{
                    color,
                }}
            >
                {t(payload[0].payload.type)}
            </Typography>
            <Typography weight="bold" size="xl2">
                {formatPercentage({ percentage: payload[0].value })}
            </Typography>
        </div>
    );
}
