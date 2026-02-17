import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, Typography } from "@metrom-xyz/ui";
import { Pie, PieChart, Tooltip } from "recharts";
import type { Address } from "viem";
import { shuffle } from "@/src/utils/common";
import type { Leaderboard, Rank } from "@/src/types/campaign";
import classNames from "classnames";
import { RankTooltip } from "./tooltip";
import { EmptyState } from "../../empty-state";
import { PieCell } from "./pie-cell";

import styles from "./styles.module.css";

export interface RepartitionChartProps {
    loading: boolean;
    leaderboard?: Leaderboard;
    connectedAccountRank?: Rank;
    messages?: {
        title?: string;
    };
}

export interface RepartitionChartData {
    name?: Address;
    position?: number;
    color?: string;
    value: number;
}

const CELLS_LIMIT = 5;
const CELLS_COLORS = shuffle([
    "#f87171", // red-400
    "#fb923c", // orange-400
    "#facc15", // amber-400
    "#fbbf24", // yellow-400
    "#a3e635", // lime-400
    "#4ade80", // green-400
    "#34d399", // emerald-400
    "#2dd4bf", // teal-400
    "#22d3ee", // cyan-400
    "#38bdf8", // sky-400
    "#60a5fa", // blue-400
    "#818cf8", // indigo-400
    "#a78bfa", // violet-400
    "#c084fc", // purple-400
    "#e879f9", // fuchsia-400
    "#f472b6", // pink-400
    "#fb7185", // rose-400
]);

export function RepartitionChart({
    loading,
    leaderboard,
    connectedAccountRank,
    messages,
}: RepartitionChartProps) {
    const t = useTranslations("campaignDetails.leaderboard");

    const [activeIndex, setActiveIndex] = useState(0);

    const chartData = useMemo(() => {
        if (!leaderboard) return undefined;

        const leaderboardEntries = Object.entries(leaderboard.sortedRanks);

        const topRepartitions: RepartitionChartData[] = leaderboardEntries
            .slice(0, CELLS_LIMIT)
            .map(([account, distribution], i) => ({
                name: account as Address,
                position: i + 1,
                value: distribution.weight,
            }));

        const otherRepartitions =
            100 -
            leaderboardEntries.reduce((acc, entry) => acc + entry[1].weight, 0);

        if (connectedAccountRank && connectedAccountRank.position > CELLS_LIMIT)
            topRepartitions.push({
                name: connectedAccountRank.account,
                position: connectedAccountRank.position,
                value: connectedAccountRank.weight,
            });

        const sorted = topRepartitions.sort((a, b) => b.value - a.value);

        if (otherRepartitions > 0)
            topRepartitions.push({
                value: otherRepartitions,
            });

        return sorted.map((rank, index) => ({
            ...rank,
            color: CELLS_COLORS[index],
        }));
    }, [leaderboard, connectedAccountRank]);

    useEffect(() => {
        if (!chartData) return;

        if (connectedAccountRank) {
            const index = chartData.findIndex(
                (data) => data.name === connectedAccountRank.account,
            );
            setActiveIndex(index);
        }
    }, [chartData, connectedAccountRank]);

    return (
        <Card className={styles.root}>
            <Typography uppercase weight="medium" variant="tertiary" size="sm">
                {messages?.title ? messages.title : t("repartition")}
            </Typography>
            <div className={styles.container}>
                <div
                    className={classNames(styles.chartWrapper, {
                        [styles.loading]: !chartData || loading,
                    })}
                >
                    {chartData && !loading && (
                        <PieChart
                            height={250}
                            width={250}
                            accessibilityLayer={false}
                        >
                            <Pie
                                dataKey="value"
                                animationEasing="ease-in-out"
                                animationDuration={400}
                                cornerRadius={6}
                                data={chartData}
                                innerRadius={70}
                                outerRadius={113}
                                startAngle={90}
                                endAngle={450}
                                minAngle={5}
                                shape={PieCell}
                            />
                            <Tooltip
                                active
                                defaultIndex={activeIndex}
                                content={<RankTooltip />}
                            />
                        </PieChart>
                    )}
                </div>
            </div>
        </Card>
    );
}

export function EmptyRepartitionChart() {
    const t = useTranslations("campaignDetails.leaderboard");

    return (
        <Card className={styles.root}>
            <div className={styles.container}>
                <div className={styles.noDistribution}>
                    <EmptyState
                        title={t("empty.title")}
                        subtitle={t("empty.subtitle")}
                    />
                </div>
            </div>
        </Card>
    );
}
