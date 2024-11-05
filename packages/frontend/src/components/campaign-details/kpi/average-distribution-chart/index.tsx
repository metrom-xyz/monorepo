import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { DistributionBreakdown } from "@/src/hooks/useDistributionBreakdown";
import { Typography } from "@metrom-xyz/ui";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import type { Address } from "viem";
import { useTransition, animated } from "@react-spring/web";
import { formatPercentage } from "@/src/utils/format";

import styles from "./styles.module.css";

interface AverageDistributionChartProps {
    loading: boolean;
}

interface ChartData {
    type: "reimbursed" | "distributed";
    color?: string;
    value: number;
}

export function AverageDistributionChart({
    loading,
}: AverageDistributionChartProps) {
    const t = useTranslations("campaignDetails.kpi.charts");

    const [activeIndex, setActiveIndex] = useState(0);

    // TODO: add average distribution data
    const chartData = useMemo(() => {
        const data: ChartData[] = [
            {
                type: "reimbursed",
                value: 30,
                color: "#9CA3AF",
            },
            {
                type: "distributed",
                value: 70,
                color: "#6CFF95",
            },
        ];
        return data;
    }, []);

    // TODO: return null if data is empty
    // TODO: add loading state?

    return (
        <div className={styles.root}>
            <Typography uppercase weight="medium" light variant="sm">
                {t("averageDistribution")}
            </Typography>
            <div className={styles.chartWrapper}>
                {!chartData || loading ? (
                    <div className={styles.chartWrapperLoading}></div>
                ) : (
                    <PieChart height={240} width={240}>
                        <Pie
                            dataKey="value"
                            animationEasing="ease-in-out"
                            animationDuration={500}
                            data={chartData}
                            activeIndex={activeIndex}
                            innerRadius={70}
                            outerRadius={120}
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
                            defaultIndex={activeIndex}
                            content={<RankTooltip />}
                        />
                    </PieChart>
                )}
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
