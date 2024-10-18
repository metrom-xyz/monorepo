import {
    Area,
    CartesianGrid,
    ComposedChart,
    Label,
    ReferenceDot,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ErrorText, Typography } from "@metrom-xyz/ui";
import { TvlTick } from "./axis-ticks/tvl";
import { RewardTick } from "./axis-ticks/reward";
import { TooltipContent, TooltipCursor } from "./tooltip";
import {
    getDistributableRewardsPercentage,
    getReachedGoalPercentage,
} from "@/src/utils/kpi";

import styles from "./styles.module.css";
import classNames from "classnames";

export interface ChartData {
    usdTvl: number;
    reward: number;
    goalReachedPercentage: number;
}

interface SimulationChartProps {
    minimumPayoutPercentage?: number;
    lowerUsdTarget?: number;
    upperUsdTarget?: number;
    totalRewardsUsd: number;
    poolUsdTvl: number;
    error?: boolean;
    loading?: boolean;
    className?: string;
}

const POINTS_COUNT = 1000;
const BASE_HEIGHT = 270;
export const CHART_MARGINS = { top: 42, right: 16, bottom: 30, left: 16 };

export function KpiSimulationChart({
    minimumPayoutPercentage = 0,
    lowerUsdTarget,
    upperUsdTarget,
    totalRewardsUsd,
    poolUsdTvl,
    error,
    loading,
    className,
}: SimulationChartProps) {
    const t = useTranslations("simulationChart");

    // rewards USD payout based on the current pool tvl
    const currentPayout = useMemo(() => {
        if (upperUsdTarget === undefined || lowerUsdTarget === undefined)
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
        if (upperUsdTarget === undefined || lowerUsdTarget === undefined)
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

        return points.map((usdTvl) => {
            const goalReachedPercentage = getReachedGoalPercentage(
                usdTvl,
                lowerUsdTarget,
                upperUsdTarget,
            );

            const distributableRewardsPercentage =
                getDistributableRewardsPercentage(
                    usdTvl,
                    lowerUsdTarget,
                    upperUsdTarget,
                    minimumPayoutPercentage,
                );

            const reward = totalRewardsUsd * distributableRewardsPercentage;

            return {
                usdTvl,
                reward,
                goalReachedPercentage,
            };
        });
    }, [
        lowerUsdTarget,
        minimumPayoutPercentage,
        totalRewardsUsd,
        upperUsdTarget,
    ]);

    const tvlTicks = useMemo(() => {
        if (
            poolUsdTvl === null ||
            poolUsdTvl === undefined ||
            lowerUsdTarget === undefined ||
            upperUsdTarget === undefined
        )
            return [];

        return [poolUsdTvl, lowerUsdTarget, upperUsdTarget];
    }, [lowerUsdTarget, poolUsdTvl, upperUsdTarget]);

    if (upperUsdTarget === undefined || lowerUsdTarget === undefined)
        return (
            <div className={classNames("root", styles.root, className)}>
                <div
                    className={classNames(
                        "emptyContainer",
                        styles.emptyContainer,
                    )}
                >
                    {error ? (
                        <ErrorText
                            variant="xs"
                            weight="medium"
                            className={styles.errorText}
                        >
                            {t("errors.missingData")}
                        </ErrorText>
                    ) : (
                        <Typography
                            uppercase
                            variant="sm"
                            light
                            weight="medium"
                        >
                            {t("emptyData")}
                        </Typography>
                    )}
                </div>
            </div>
        );

    if (error) {
        return (
            <div className={classNames("root", styles.root, className)}>
                <div
                    className={classNames(
                        "emptyContainer",
                        styles.emptyContainer,
                    )}
                >
                    <ErrorText
                        variant="xs"
                        weight="medium"
                        className={styles.errorText}
                    >
                        {t("errors.wrongData")}
                    </ErrorText>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={classNames("root", styles.root, className)}>
                <div
                    className={classNames(
                        "emptyContainer",
                        styles.emptyContainer,
                        styles.loading,
                    )}
                ></div>
            </div>
        );
    }

    return (
        <div className={classNames("root", styles.root, className)}>
            <ResponsiveContainer
                width="100%"
                className={classNames("container", styles.container)}
            >
                <ComposedChart
                    data={chartData}
                    margin={CHART_MARGINS}
                    style={{ cursor: "pointer" }}
                >
                    <CartesianGrid
                        fill="#F3F4F6"
                        stroke="white"
                        strokeWidth={2}
                        vertical={false}
                        horizontal={true}
                        horizontalCoordinatesGenerator={({ height }) =>
                            height > BASE_HEIGHT
                                ? [42, 126, 210, 294]
                                : [42, 84, 126, 168]
                        }
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
                                    point.usdTvl >
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
                        dataKey="usdTvl"
                        tickSize={4}
                        tick={
                            <TvlTick
                                poolUsdTvl={poolUsdTvl}
                                lowerUsdTarget={lowerUsdTarget}
                                upperUsdTarget={upperUsdTarget}
                            />
                        }
                        domain={["dataMin", "dataMax"]}
                        ticks={tvlTicks.sort((a, b) => a - b)}
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

                    <ReferenceDot
                        x={
                            minimumPayoutPercentage > 0
                                ? 0
                                : Math.min(...tvlTicks)
                        }
                        y={totalRewardsUsd * minimumPayoutPercentage}
                        r={4}
                        fill="#6CFF95"
                        stroke="white"
                        strokeWidth={1}
                        isFront
                    />

                    <ReferenceDot
                        x={Math.max(...tvlTicks)}
                        y={totalRewardsUsd}
                        r={4}
                        fill="#000"
                        stroke="white"
                        strokeWidth={1}
                        isFront
                    />

                    <ReferenceDot
                        x={0}
                        y={currentPayout}
                        r={3}
                        fill="#6CFF95"
                        stroke="none"
                        isFront
                    />

                    {currentPayout > 0 && (
                        <>
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
                            <ReferenceDot
                                x={poolUsdTvl}
                                y={currentPayout}
                                r={4}
                                fill="#6CFF95"
                                stroke="white"
                                strokeWidth={1}
                            />
                        </>
                    )}

                    <Tooltip
                        isAnimationActive={false}
                        content={<TooltipContent />}
                        cursor={
                            <TooltipCursor totalRewardsUsd={totalRewardsUsd} />
                        }
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
