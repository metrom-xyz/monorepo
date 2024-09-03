import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { AggregatedEnrichedDistributionData } from "@/src/hooks/useWatchDistributionData";
import { Typography } from "@/src/ui/typography";
import numeral from "numeral";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import type { Address } from "viem";
import { getAddressColor } from "@/src/utils/address";
import { useTransition, animated } from "@react-spring/web";

import styles from "./styles.module.css";

interface RepartitionChartProps {
    loading: boolean;
    repartitionData?: AggregatedEnrichedDistributionData[];
}

interface ChartData {
    name?: Address;
    position?: number;
    value: number;
}

export function RepartitionChart({
    loading,
    repartitionData,
}: RepartitionChartProps) {
    const t = useTranslations("campaignDetails.leaderboard");

    const repartitionChartData: ChartData[] | undefined = useMemo(() => {
        if (!repartitionData) return undefined;

        const topRepartitions = repartitionData.slice(0, 5).map((data) => ({
            name: data.account,
            position: data.position,
            value: data.rank,
        }));

        const otherRepartitions = repartitionData
            .slice(6, repartitionData.length)
            .reduce((acc, data) => (acc += data.rank), 0);

        return [...topRepartitions, { value: otherRepartitions }];
    }, [repartitionData]);

    return (
        <div className={styles.root}>
            <Typography uppercase weight="medium" light variant="sm">
                {t("repartition")}
            </Typography>
            <div className={styles.chartWrapper}>
                {!repartitionChartData || loading ? (
                    <div className={styles.chartWrapperLoading}></div>
                ) : (
                    <PieChart height={240} width={240}>
                        <Pie
                            dataKey="value"
                            animationEasing="ease-in-out"
                            animationDuration={500}
                            data={repartitionChartData}
                            innerRadius={70}
                            outerRadius={120}
                        >
                            {repartitionChartData.map((entry, index) => (
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
                        {numeral(payload[0].value).format("0.[0]")}%
                    </Typography>
                </animated.div>
            ),
    );
}
