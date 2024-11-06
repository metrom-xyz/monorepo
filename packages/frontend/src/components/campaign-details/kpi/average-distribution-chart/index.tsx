import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { useTransition, animated } from "@react-spring/web";
import { formatPercentage } from "@/src/utils/format";

import styles from "./styles.module.css";

interface AverageDistributionChartProps {
    kpiMeasurementPercentage: number;
    minimumPayoutPercentage?: number;
}

interface ChartData {
    type: "reimbursed" | "distributed";
    color?: string;
    value: number;
}

export function AverageDistributionChart({
    kpiMeasurementPercentage,
    minimumPayoutPercentage = 0,
}: AverageDistributionChartProps) {
    const t = useTranslations("campaignDetails.kpi.charts");

    const chartData = useMemo(() => {
        const distributedPercentage =
            (minimumPayoutPercentage +
                (1 - minimumPayoutPercentage) * kpiMeasurementPercentage) *
            100;
        const data: ChartData[] = [
            {
                type: "distributed",
                value: distributedPercentage,
                color: "#6CFF95",
            },
            {
                type: "reimbursed",
                value: 100 - distributedPercentage,
                color: "#d1d5db",
            },
        ];
        return data;
    }, [kpiMeasurementPercentage, minimumPayoutPercentage]);

    return (
        <div className={styles.root}>
            <Typography uppercase weight="medium" light variant="sm">
                {t("averageDistribution")}
            </Typography>
            <div className={styles.chartWrapper}>
                <PieChart height={240} width={240}>
                    <Pie
                        dataKey="value"
                        animationEasing="ease-in-out"
                        animationDuration={500}
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
                                fill={entry.color}
                                strokeWidth={4}
                                className={styles.cell}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        active
                        defaultIndex={0}
                        content={<RankTooltip />}
                    />
                </PieChart>
            </div>
        </div>
    );
}

function RankTooltip({ active, payload }: any) {
    const t = useTranslations("campaignDetails.kpi.charts");

    const transition = useTransition(active, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 200 },
    });

    if (!payload || !payload.length) return null;

    const color = payload[0].payload.color;

    return transition(
        (style, active) =>
            !!active && (
                <animated.div style={style} className={styles.tooltipWrapper}>
                    <Typography
                        weight="bold"
                        uppercase
                        style={{
                            color,
                        }}
                    >
                        {t(payload[0].payload.type)}
                    </Typography>
                    <Typography weight="bold" variant="xl2">
                        {formatPercentage(payload[0].value)}
                    </Typography>
                </animated.div>
            ),
    );
}
