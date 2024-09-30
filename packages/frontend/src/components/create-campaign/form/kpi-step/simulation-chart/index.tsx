import {
    Area,
    CartesianGrid,
    ComposedChart,
    Label,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import { TvlTick } from "./axis-ticks/tvl";
import { RewardTick } from "./axis-ticks/reward";
import { TooltipContent, TooltipCursor } from "./tooltip";
import {
    getDistributableRewardsPercentage,
    getReachedGoalPercentage,
} from "@/src/utils/kpi";

import styles from "./styles.module.css";
import { useDebounce } from "react-use";

export interface ChartData {
    tvl: number;
    reward: number;
    goalReachedPercentage: number;
}

interface SimulationChartProps {
    minimumPayoutPercentage?: number;
    lowerUsdTarget?: number;
    upperUsdTarget?: number;
    totalRewardsUsd?: number;
    poolUsdTvl?: number | null;
}

const POINTS_COUNT = 1000;

export function SimulationChart({
    minimumPayoutPercentage: minPayoutPercentage = 0,
    lowerUsdTarget: lowerBound,
    upperUsdTarget: upperBound,
    totalRewardsUsd,
    poolUsdTvl,
}: SimulationChartProps) {
    const t = useTranslations("simulationChart");

    const [lowerUsdTarget, setLowerUsdTarget] = useState(lowerBound);
    const [upperUsdTarget, setUpperUsdTarget] = useState(upperBound);
    const [minimumPayoutPercentage, setMinimumPayoutPercentage] =
        useState(minPayoutPercentage);

    useDebounce(
        () => {
            setLowerUsdTarget(lowerBound);
        },
        500,
        [lowerBound],
    );
    useDebounce(
        () => {
            setUpperUsdTarget(upperBound);
        },
        500,
        [upperBound],
    );
    useDebounce(
        () => {
            setMinimumPayoutPercentage(minPayoutPercentage / 100);
        },
        500,
        [minPayoutPercentage],
    );

    // rewards USD payout based on the current pool tvl
    const currentPayout = useMemo(() => {
        if (
            upperUsdTarget === undefined ||
            lowerUsdTarget === undefined ||
            !poolUsdTvl ||
            !totalRewardsUsd
        )
            return 0;

        if (lowerUsdTarget > poolUsdTvl) return 0;

        const distributableRewardsPercentage =
            getDistributableRewardsPercentage(
                poolUsdTvl,
                lowerUsdTarget,
                upperUsdTarget,
                minimumPayoutPercentage,
            );

        return totalRewardsUsd * distributableRewardsPercentage;
    }, [
        lowerUsdTarget,
        minimumPayoutPercentage,
        poolUsdTvl,
        totalRewardsUsd,
        upperUsdTarget,
    ]);

    const chartData: ChartData[] = useMemo(() => {
        if (
            upperUsdTarget === undefined ||
            lowerUsdTarget === undefined ||
            !totalRewardsUsd ||
            !poolUsdTvl
        )
            return [];

        const points = Array.from(
            { length: POINTS_COUNT },
            (_, i) =>
                lowerUsdTarget +
                (i * (upperUsdTarget - lowerUsdTarget)) / (POINTS_COUNT - 1),
        );

        // if there is a minimum payout add 0 to the points to make the
        // green area for the minimum rewards to fill the whole chart
        if (minimumPayoutPercentage) points.unshift(0);

        return points.map((tvl) => {
            const goalReachedPercentage = getReachedGoalPercentage(
                tvl,
                lowerUsdTarget,
                upperUsdTarget,
            );

            const distributableRewardsPercentage =
                getDistributableRewardsPercentage(
                    tvl,
                    lowerUsdTarget,
                    upperUsdTarget,
                    minimumPayoutPercentage,
                );

            const reward = totalRewardsUsd * distributableRewardsPercentage;

            return {
                tvl,
                reward,
                goalReachedPercentage,
            };
        });
    }, [
        lowerUsdTarget,
        minimumPayoutPercentage,
        poolUsdTvl,
        totalRewardsUsd,
        upperUsdTarget,
    ]);

    if (
        upperUsdTarget === undefined ||
        lowerUsdTarget === undefined ||
        !totalRewardsUsd ||
        !poolUsdTvl
    )
        return (
            <div className={styles.root}>
                <div className={styles.emptyContainer}>
                    <Typography uppercase variant="sm" light weight="medium">
                        {t("missingData")}
                    </Typography>
                </div>
            </div>
        );

    return (
        <div className={styles.root}>
            <ResponsiveContainer
                width="100%"
                height={270}
                className={styles.container}
            >
                <ComposedChart
                    data={chartData}
                    margin={{ top: 42, right: 16, bottom: 30, left: 16 }}
                    style={{ cursor: "pointer" }}
                >
                    <CartesianGrid
                        fill="#F7F7F8"
                        vertical={false}
                        horizontal={false}
                    />

                    {/* area for the values before the current TVL */}
                    <Area
                        type="monotone"
                        dataKey="reward"
                        fill="#6CFF95"
                        stroke="none"
                        fillOpacity={1}
                        animationEasing="ease-in-out"
                        animationDuration={200}
                        isAnimationActive={true}
                        activeDot={false}
                    />

                    {/* area for the values after the lower USD target or the current pool TVL */}
                    <Area
                        type="monotone"
                        data={chartData.map((point) => {
                            return {
                                ...point,
                                reward:
                                    point.tvl >
                                    Math.max(poolUsdTvl, lowerUsdTarget)
                                        ? point.reward
                                        : 0,
                            };
                        })}
                        dataKey="reward"
                        fill="white"
                        stroke="white"
                        strokeWidth={2}
                        fillOpacity={1}
                        animationEasing="ease-in-out"
                        animationDuration={200}
                        isAnimationActive={true}
                        activeDot={false}
                    />

                    <XAxis
                        type="number"
                        format="number"
                        dataKey="tvl"
                        tickSize={4}
                        allowDataOverflow
                        tick={
                            <TvlTick
                                lowerUsdTarget={lowerUsdTarget}
                                poolUsdTvl={poolUsdTvl}
                                upperUsdTarget={upperUsdTarget}
                            />
                        }
                        domain={[0, "dataMax"]}
                        interval={0}
                        ticks={[
                            poolUsdTvl,
                            lowerUsdTarget,
                            upperUsdTarget,
                        ].sort((a, b) => a - b)}
                    >
                        <Label
                            value={t("labels.tvl")}
                            dy={28}
                            offset={0}
                            position="insideRight"
                            className={styles.axisLabel}
                        />
                    </XAxis>

                    <YAxis
                        type="number"
                        format="number"
                        dataKey="reward"
                        axisLine={false}
                        tickLine={false}
                        mirror
                        allowDataOverflow
                        tick={<RewardTick />}
                        domain={[0, "dataMax"]}
                        ticks={[currentPayout, totalRewardsUsd]}
                    >
                        <Label
                            value={t("labels.reward")}
                            dy={-20}
                            dx={-6}
                            offset={0}
                            position="top"
                            className={styles.axisLabel}
                        />
                    </YAxis>

                    {currentPayout > 0 && (
                        <ReferenceLine
                            strokeDasharray={"3 3"}
                            ifOverflow="visible"
                            isFront
                            stroke="#6CFF95"
                            segment={[
                                { x: 0, y: currentPayout },
                                { x: poolUsdTvl, y: currentPayout },
                            ]}
                        />
                    )}

                    <Tooltip
                        isAnimationActive={false}
                        content={<TooltipContent />}
                        cursor={<TooltipCursor />}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
