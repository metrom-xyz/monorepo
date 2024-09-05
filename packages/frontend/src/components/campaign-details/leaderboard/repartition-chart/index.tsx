import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { DistributionBreakdown } from "@/src/hooks/useDistributionBreakdown";
import { Typography } from "@/src/ui/typography";
import numeral from "numeral";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import type { Address } from "viem";
import { getAddressColor } from "@/src/utils/address";
import { useTransition, animated } from "@react-spring/web";

import styles from "./styles.module.css";
import { formatPercentage } from "@/src/utils/format";

interface RepartitionChartProps {
    loading: boolean;
    distributionBreakdown?: DistributionBreakdown;
}

interface ChartData {
    name?: Address;
    position?: number;
    value: number;
}

export function RepartitionChart({
    loading,
    distributionBreakdown,
}: RepartitionChartProps) {
    const t = useTranslations("campaignDetails.leaderboard");

    const chartData: ChartData[] | undefined = useMemo(() => {
        if (!distributionBreakdown) return undefined;

        const distributionBreakdownEntries = Object.entries(
            distributionBreakdown.sortedDistributionsByAccount,
        );

        const topRepartitions = distributionBreakdownEntries
            .slice(0, 5)
            .map(([account, distribution], i) => ({
                name: account as Address,
                position: i + 1,
                value: distribution.percentage,
            }));

        const otherRepartitions = distributionBreakdownEntries
            .slice(6, distributionBreakdownEntries.length)
            .reduce(
                (accumulator, [_account, distribution]) =>
                    (accumulator += distribution.percentage),
                0,
            );

        return [...topRepartitions, { value: otherRepartitions }];
    }, [distributionBreakdown]);

    return (
        <div className={styles.root}>
            <Typography uppercase weight="medium" light variant="sm">
                {t("repartition")}
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
                            innerRadius={70}
                            outerRadius={120}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        entry.name
                                            ? getAddressColor(entry.name)
                                            : "#9CA3AF"
                                    }
                                    strokeWidth={4}
                                    className={styles.cell}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<RankTooltip />} />
                    </PieChart>
                )}
            </div>
        </div>
    );
}

function RankTooltip({ active, payload }: any) {
    const t = useTranslations("campaignDetails.leaderboard");

    const transition = useTransition(active, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 200 },
    });

    if (!payload || !payload.length) return null;

    const name = payload[0].name;

    return transition(
        (style, active) =>
            !!active && (
                <animated.div style={style} className={styles.tooltipWrapper}>
                    <Typography
                        weight="bold"
                        variant="xl"
                        style={{
                            color: name ? getAddressColor(name) : "#9CA3AF",
                        }}
                    >
                        #{payload[0].payload.position || t("others")}
                    </Typography>
                    <Typography weight="bold" variant="xl2">
                        {formatPercentage(payload[0].value)}%
                    </Typography>
                </animated.div>
            ),
    );
}
