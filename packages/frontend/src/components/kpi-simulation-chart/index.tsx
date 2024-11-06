import {
    Area,
    CartesianGrid,
    ComposedChart,
    ReferenceArea,
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
import { getDistributableRewardsPercentage } from "@/src/utils/kpi";
import classNames from "classnames";
import { formatUsdAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

export interface DistributedAreaDataPoint {
    usdTvl: number;
    currentlyDistributing: number;
    currentlyNotDistributing: number;
}

interface KpiSimulationChartProps {
    kpiMeasurement?: number;
    minimumPayoutPercentage?: number;
    lowerUsdTarget?: number;
    upperUsdTarget?: number;
    totalRewardsUsd: number;
    poolUsdTvl?: number | null;
    error?: boolean;
    loading?: boolean;
    className?: string;
}

const POINTS_COUNT = 1000;
export const CHART_MARGINS = { top: 30, right: 4, bottom: 4, left: 2 };

export function KpiSimulationChart({
    kpiMeasurement,
    minimumPayoutPercentage = 0,
    lowerUsdTarget,
    upperUsdTarget,
    totalRewardsUsd,
    poolUsdTvl,
    error,
    loading,
    className,
}: KpiSimulationChartProps) {
    const t = useTranslations("simulationChart");

    const currentPayoutUsd =
        poolUsdTvl && lowerUsdTarget && upperUsdTarget
            ? totalRewardsUsd *
              getDistributableRewardsPercentage(
                  poolUsdTvl,
                  lowerUsdTarget,
                  upperUsdTarget,
                  minimumPayoutPercentage,
                  kpiMeasurement,
              )
            : 0;

    const sortedSignificantUsdTvls = useMemo(() => {
        if (
            lowerUsdTarget === undefined ||
            upperUsdTarget === undefined ||
            poolUsdTvl === null ||
            poolUsdTvl === undefined
        )
            return [];

        const tvls = [poolUsdTvl, lowerUsdTarget, upperUsdTarget];
        tvls.sort((a, b) => a - b);
        const fullRange = tvls[2] - tvls[0];
        const padding = fullRange * 0.2;

        return [tvls[0] - padding, ...tvls, tvls[2] + padding];
    }, [lowerUsdTarget, poolUsdTvl, upperUsdTarget]);

    const areaChartData: DistributedAreaDataPoint[] = useMemo(() => {
        if (
            upperUsdTarget === undefined ||
            lowerUsdTarget === undefined ||
            poolUsdTvl === null ||
            poolUsdTvl === undefined ||
            sortedSignificantUsdTvls.length === 0
        )
            return [];

        const lowerUsdTvl = sortedSignificantUsdTvls[0];
        const upperUsdTvl = sortedSignificantUsdTvls[4];
        const usdTvlRange = upperUsdTvl - lowerUsdTvl;
        const domainStep = usdTvlRange / POINTS_COUNT;

        const points: DistributedAreaDataPoint[] = [];
        for (
            let usdTvl = lowerUsdTvl;
            usdTvl <= upperUsdTvl;
            usdTvl += domainStep
        ) {
            const distributedRewards =
                totalRewardsUsd *
                getDistributableRewardsPercentage(
                    usdTvl,
                    lowerUsdTarget,
                    upperUsdTarget,
                    minimumPayoutPercentage,
                );

            points.push({
                usdTvl,
                currentlyDistributing:
                    usdTvl <= poolUsdTvl ? distributedRewards : 0,
                currentlyNotDistributing:
                    usdTvl > poolUsdTvl ? distributedRewards : 0,
            });
        }

        return points;
    }, [
        lowerUsdTarget,
        minimumPayoutPercentage,
        poolUsdTvl,
        sortedSignificantUsdTvls,
        totalRewardsUsd,
        upperUsdTarget,
    ]);

    if (
        upperUsdTarget === undefined ||
        lowerUsdTarget === undefined ||
        poolUsdTvl === null ||
        poolUsdTvl === undefined
    )
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
        <ResponsiveContainer
            width="100%"
            height="100%"
            minHeight={270}
            className={classNames("container", styles.container)}
        >
            <ComposedChart
                data={areaChartData}
                margin={CHART_MARGINS}
                style={{ cursor: "pointer" }}
            >
                <XAxis
                    type="number"
                    format="number"
                    dataKey="usdTvl"
                    tick={
                        <TvlTick
                            poolUsdTvl={poolUsdTvl}
                            lowerUsdTarget={lowerUsdTarget}
                            upperUsdTarget={upperUsdTarget}
                        />
                    }
                    ticks={sortedSignificantUsdTvls.slice(1, 4)}
                    tickFormatter={(value) => formatUsdAmount(value)}
                    domain={[
                        sortedSignificantUsdTvls[0],
                        sortedSignificantUsdTvls[4],
                    ]}
                />
                <YAxis
                    type="number"
                    format="number"
                    axisLine={false}
                    tickLine={false}
                    mirror
                    tick={<RewardTick />}
                    domain={[0, "dataMax"]}
                    ticks={[currentPayoutUsd, totalRewardsUsd]}
                />

                <Area
                    type="monotone"
                    dataKey="currentlyDistributing"
                    fill="#6CFF95"
                    stroke="none"
                    fillOpacity={1}
                    animationEasing="ease-in-out"
                    animationDuration={200}
                    isAnimationActive={true}
                    activeDot={false}
                />

                <Area
                    type="monotone"
                    dataKey="currentlyNotDistributing"
                    fill="#d1d5db"
                    stroke="none"
                    fillOpacity={1}
                    animationEasing="ease-in-out"
                    animationDuration={200}
                    isAnimationActive={true}
                    activeDot={false}
                />

                <ReferenceLine
                    strokeDasharray={"3 3"}
                    ifOverflow="visible"
                    isFront
                    stroke="#000"
                    segment={[
                        {
                            x: poolUsdTvl,
                            y: 0,
                        },
                        {
                            x: poolUsdTvl,
                            y: totalRewardsUsd,
                        },
                    ]}
                />

                <ReferenceLine
                    strokeDasharray={"3 3"}
                    ifOverflow="visible"
                    isFront
                    stroke="#000"
                    segment={[
                        {
                            x: lowerUsdTarget,
                            y: 0,
                        },
                        {
                            x: lowerUsdTarget,
                            y: totalRewardsUsd,
                        },
                    ]}
                />

                <ReferenceLine
                    strokeDasharray={"3 3"}
                    ifOverflow="visible"
                    isFront
                    stroke="#000"
                    segment={[
                        {
                            x: upperUsdTarget,
                            y: 0,
                        },
                        {
                            x: upperUsdTarget,
                            y: totalRewardsUsd,
                        },
                    ]}
                />

                {currentPayoutUsd > 0 && (
                    <>
                        <ReferenceLine
                            strokeDasharray={"3 3"}
                            ifOverflow="visible"
                            isFront
                            stroke="#000"
                            segment={[
                                { x: 0, y: currentPayoutUsd },
                                { x: poolUsdTvl, y: currentPayoutUsd },
                            ]}
                        />
                        <ReferenceDot
                            x={poolUsdTvl}
                            y={currentPayoutUsd}
                            r={4}
                            fill="#6CFF95"
                            stroke="#000"
                            strokeWidth={1}
                        />
                    </>
                )}

                <Tooltip
                    isAnimationActive={false}
                    content={
                        <TooltipContent
                            lowerUsdTarget={lowerUsdTarget}
                            upperUsdTarget={upperUsdTarget}
                            totalRewardsUsd={totalRewardsUsd}
                            minimumPayouPercentage={minimumPayoutPercentage}
                        />
                    }
                    cursor={<TooltipCursor totalRewardsUsd={totalRewardsUsd} />}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
}
