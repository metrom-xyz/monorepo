import {
    Area,
    ComposedChart,
    Label,
    Line,
    ReferenceDot,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
    ErrorText,
    Skeleton,
    Typography,
    type TypographySize,
} from "@metrom-xyz/ui";
import { TvlTick } from "./axis-ticks/tvl";
import { RewardTick } from "./axis-ticks/reward";
import { TooltipContent, TooltipCursor } from "./tooltip";
import {
    getChartAxisScale,
    getDistributableRewardsPercentage,
} from "@/src/utils/kpi";
import classNames from "classnames";
import { formatUsdAmount } from "@/src/utils/format";
import { useMeasure } from "react-use";
import { SECONDS_IN_YEAR } from "@/src/commons";
import { ChartIcon } from "@/src/assets/chart-icon";

import styles from "./styles.module.css";

function clampValue(
    value: number,
    originalMin: number,
    originalMax: number,
    newMin: number,
    newMax: number,
): number {
    return (
        ((value - originalMin) / (originalMax - originalMin)) *
            (newMax - newMin) +
        newMin
    );
}

export interface DistributedAreaDataPoint {
    usdTvl: number;
    currentlyDistributing: number;
    currentlyNotDistributing: number;
    aprPercentage: number;
    aprLinePoint?: number;
}

interface KpiSimulationChartProps {
    minimumPayoutPercentage?: number;
    lowerUsdTarget?: number;
    upperUsdTarget?: number;
    totalRewardsUsd: number;
    poolUsdTvl?: number | null;
    campaignDurationSeconds: number;
    campaignEnded?: boolean;
    error?: boolean;
    loading?: boolean;
    tooltipSize?: TypographySize;
    tooltip?: boolean;
    className?: string;
}

const REFERENCE_LINE_PROXIMITY_THRESHOLD = 16;
const REFERENCE_LINE_LABEL_DX = 8;
const POINTS_COUNT = 1000;
export const CHART_MARGINS = { top: 30, right: 4, bottom: 4, left: 2 };

export function KpiSimulationChart({
    minimumPayoutPercentage = 0,
    lowerUsdTarget,
    upperUsdTarget,
    totalRewardsUsd,
    poolUsdTvl,
    campaignDurationSeconds,
    campaignEnded,
    error,
    loading,
    tooltipSize,
    tooltip = true,
    className,
}: KpiSimulationChartProps) {
    const t = useTranslations("simulationChart");
    const [chartRef, { width }] = useMeasure<HTMLDivElement>();

    const currentPayoutUsd =
        poolUsdTvl &&
        lowerUsdTarget !== undefined &&
        upperUsdTarget !== undefined
            ? totalRewardsUsd *
              getDistributableRewardsPercentage(
                  poolUsdTvl,
                  lowerUsdTarget,
                  upperUsdTarget,
                  minimumPayoutPercentage,
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

    const { poolTvlScale, lowerBoundScale, upperBoundScale } = useMemo(() => {
        if (
            poolUsdTvl === null ||
            poolUsdTvl === undefined ||
            lowerUsdTarget === undefined ||
            upperUsdTarget === undefined
        )
            return {};

        const chartWidth = width - CHART_MARGINS.left - CHART_MARGINS.right;
        const tvls = [poolUsdTvl, lowerUsdTarget, upperUsdTarget];
        const [poolTvlScale, lowerBoundScale, upperBoundScale] = tvls.map(
            (tvl) =>
                getChartAxisScale(
                    tvl,
                    sortedSignificantUsdTvls[0],
                    sortedSignificantUsdTvls[
                        sortedSignificantUsdTvls.length - 1
                    ],
                    0,
                    chartWidth,
                ) + CHART_MARGINS.left,
        );

        return { poolTvlScale, lowerBoundScale, upperBoundScale };
    }, [
        lowerUsdTarget,
        poolUsdTvl,
        sortedSignificantUsdTvls,
        upperUsdTarget,
        width,
    ]);

    const { poolTvlDx, lowerBoundDx, upperBoundDx } = useMemo(() => {
        if (
            poolTvlScale === undefined ||
            lowerBoundScale === undefined ||
            upperBoundScale == undefined
        )
            return {
                poolTvlDx: REFERENCE_LINE_LABEL_DX,
                lowerBoundDx: REFERENCE_LINE_LABEL_DX,
                upperBoundDx: REFERENCE_LINE_LABEL_DX,
            };

        const closeToLowerBound =
            Math.abs(poolTvlScale - lowerBoundScale) <=
            REFERENCE_LINE_PROXIMITY_THRESHOLD;
        const closeToUpperBound =
            Math.abs(poolTvlScale - upperBoundScale) <=
            REFERENCE_LINE_PROXIMITY_THRESHOLD;
        const closeBounds =
            upperBoundScale - lowerBoundScale <=
            REFERENCE_LINE_PROXIMITY_THRESHOLD;

        if (closeBounds) {
            return {
                poolTvlDx: REFERENCE_LINE_LABEL_DX,
                lowerBoundDx: -REFERENCE_LINE_LABEL_DX,
                upperBoundDx: REFERENCE_LINE_LABEL_DX,
            };
        }

        if (closeToLowerBound) {
            if (poolTvlScale <= lowerBoundScale)
                return {
                    poolTvlDx: -REFERENCE_LINE_LABEL_DX,
                    lowerBoundDx: REFERENCE_LINE_LABEL_DX,
                    upperBoundDx: REFERENCE_LINE_LABEL_DX,
                };

            return {
                poolTvlDx: REFERENCE_LINE_LABEL_DX,
                lowerBoundDx: -REFERENCE_LINE_LABEL_DX,
                upperBoundDx: REFERENCE_LINE_LABEL_DX,
            };
        }

        if (closeToUpperBound) {
            if (poolTvlScale >= upperBoundScale)
                return {
                    poolTvlDx: REFERENCE_LINE_LABEL_DX,
                    lowerBoundDx: REFERENCE_LINE_LABEL_DX,
                    upperBoundDx: -REFERENCE_LINE_LABEL_DX,
                };

            return {
                poolTvlDx: -REFERENCE_LINE_LABEL_DX,
                lowerBoundDx: REFERENCE_LINE_LABEL_DX,
                upperBoundDx: REFERENCE_LINE_LABEL_DX,
            };
        }

        return {
            poolTvlDx: REFERENCE_LINE_LABEL_DX,
            lowerBoundDx: REFERENCE_LINE_LABEL_DX,
            upperBoundDx: REFERENCE_LINE_LABEL_DX,
        };
    }, [lowerBoundScale, poolTvlScale, upperBoundScale]);

    const chartData: DistributedAreaDataPoint[] = useMemo(() => {
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

        const chartData: DistributedAreaDataPoint[] = [];

        let minAprPercentage = Number.POSITIVE_INFINITY;
        let maxAprPercentage = 0;

        const aprPercentages = [];
        for (
            let usdTvl = lowerUsdTvl;
            usdTvl <= upperUsdTvl;
            usdTvl += domainStep
        ) {
            if (usdTvl <= 0) continue;

            const distributaleRewardsPercentage =
                getDistributableRewardsPercentage(
                    usdTvl,
                    lowerUsdTarget,
                    upperUsdTarget,
                    minimumPayoutPercentage,
                );
            const distributedRewardsUsd =
                totalRewardsUsd * distributaleRewardsPercentage;

            const rewardsRatio = distributedRewardsUsd / usdTvl;
            const yearMultiplier = SECONDS_IN_YEAR / campaignDurationSeconds;
            const aprPercentage = rewardsRatio * yearMultiplier * 100;

            aprPercentages.push(aprPercentage);

            if (aprPercentage > maxAprPercentage)
                maxAprPercentage = aprPercentage;
            if (aprPercentage < minAprPercentage)
                minAprPercentage = aprPercentage;

            chartData.push({
                usdTvl,
                currentlyDistributing:
                    usdTvl <= poolUsdTvl ? distributedRewardsUsd : 0,
                currentlyNotDistributing:
                    usdTvl > poolUsdTvl ? distributedRewardsUsd : 0,
                aprPercentage,
            });
        }

        if (chartData.length === 0) return chartData;

        aprPercentages.sort();
        const midAprIndex = Math.floor(aprPercentages.length / 2);
        const medianApr =
            aprPercentages.length % 2 === 0
                ? (aprPercentages[midAprIndex - 1] +
                      aprPercentages[midAprIndex]) /
                  2
                : aprPercentages[midAprIndex];

        const cappedAprPercentage = medianApr * 4;
        maxAprPercentage = Math.min(maxAprPercentage, cappedAprPercentage);

        for (const point of chartData) {
            if (point.aprPercentage > cappedAprPercentage) continue;

            point.aprLinePoint = clampValue(
                point.aprPercentage,
                minAprPercentage,
                maxAprPercentage,
                0,
                totalRewardsUsd,
            );
        }

        return chartData;
    }, [
        lowerUsdTarget,
        minimumPayoutPercentage,
        poolUsdTvl,
        sortedSignificantUsdTvls,
        totalRewardsUsd,
        upperUsdTarget,
        campaignDurationSeconds,
    ]);

    if (loading) {
        return (
            <div className={classNames("root", styles.root, className)}>
                <div
                    className={classNames(
                        "loadingContainer",
                        styles.loadingContainer,
                    )}
                >
                    <div className={styles.skeletonArea}>
                        <div className={styles.skeletonReferenceLine}></div>
                        <div className={styles.skeletonReferenceLine}></div>
                        <div className={styles.skeletonReferenceLine}></div>
                    </div>
                    <div className={styles.skeletonXAxis}>
                        <Skeleton size="xs" width={40} />
                        <Skeleton size="xs" width={40} />
                        <Skeleton size="xs" width={40} />
                    </div>
                </div>
            </div>
        );
    }

    if (
        upperUsdTarget === undefined ||
        lowerUsdTarget === undefined ||
        poolUsdTvl === null ||
        poolUsdTvl === undefined
    ) {
        console.log({ upperUsdTarget, lowerUsdTarget, poolUsdTvl });
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
                            size="xs"
                            weight="medium"
                            className={styles.errorText}
                        >
                            {t("errors.missingData")}
                        </ErrorText>
                    ) : (
                        <>
                            <ChartIcon />
                            <Typography uppercase size="sm" weight="medium">
                                {t("emptyData")}
                            </Typography>
                        </>
                    )}
                </div>
            </div>
        );
    }

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
                        size="xs"
                        weight="medium"
                        className={styles.errorText}
                    >
                        {t("errors.wrongData")}
                    </ErrorText>
                </div>
            </div>
        );
    }

    return (
        <ResponsiveContainer
            ref={chartRef}
            width="100%"
            height="100%"
            minHeight={270}
            className={classNames("container", styles.container, className)}
        >
            <ComposedChart
                data={chartData}
                margin={CHART_MARGINS}
                style={{ cursor: "pointer" }}
            >
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
                    className={styles.distributingArea}
                />

                <Area
                    type="monotone"
                    dataKey="currentlyNotDistributing"
                    stroke="none"
                    fillOpacity={1}
                    animationEasing="ease-in-out"
                    animationDuration={200}
                    isAnimationActive={true}
                    activeDot={false}
                    className={styles.notDistributingArea}
                />

                <Line
                    type="monotone"
                    dataKey="aprLinePoint"
                    fillOpacity={1}
                    animationEasing="ease-in-out"
                    animationDuration={200}
                    isAnimationActive={true}
                    activeDot={false}
                    dot={false}
                    className={styles.aprLine}
                />

                <XAxis
                    type="number"
                    format="number"
                    dataKey="usdTvl"
                    interval={0}
                    tick={
                        <TvlTick
                            poolTvlScale={poolTvlScale}
                            lowerBoundScale={lowerBoundScale}
                            upperBoundScale={upperBoundScale}
                        />
                    }
                    ticks={sortedSignificantUsdTvls.slice(1, 4)}
                    tickFormatter={(value) =>
                        formatUsdAmount({ amount: value })
                    }
                    domain={[
                        sortedSignificantUsdTvls[0],
                        sortedSignificantUsdTvls[4],
                    ]}
                    className={styles.xAxis}
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

                <ReferenceLine
                    strokeDasharray={"3 3"}
                    ifOverflow="visible"
                    isFront
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
                    className={styles.referenceLine}
                >
                    <Label
                        value={
                            campaignEnded
                                ? t("tvl.campaignEnded")
                                : t("tvl.campaignActive")
                        }
                        dx={poolTvlDx}
                        angle={90}
                        className={styles.axisLabel}
                    />
                </ReferenceLine>

                <ReferenceLine
                    strokeDasharray={"3 3"}
                    ifOverflow="visible"
                    isFront
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
                    className={styles.referenceLine}
                >
                    <Label
                        value={t("lowerBound")}
                        dx={lowerBoundDx}
                        angle={270}
                        className={styles.axisLabel}
                    />
                </ReferenceLine>

                <ReferenceLine
                    strokeDasharray={"3 3"}
                    ifOverflow="visible"
                    isFront
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
                    className={styles.referenceLine}
                >
                    <Label
                        value={t("upperBound")}
                        dx={upperBoundDx}
                        angle={90}
                        className={styles.axisLabel}
                    />
                </ReferenceLine>

                {currentPayoutUsd > 0 && (
                    <>
                        <ReferenceLine
                            strokeDasharray={"3 3"}
                            ifOverflow="visible"
                            isFront
                            segment={[
                                { x: 0, y: currentPayoutUsd },
                                { x: poolUsdTvl, y: currentPayoutUsd },
                            ]}
                            className={styles.referenceLine}
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

                {tooltip && (
                    <Tooltip
                        isAnimationActive={false}
                        content={
                            <TooltipContent
                                size={tooltipSize}
                                lowerUsdTarget={lowerUsdTarget}
                                upperUsdTarget={upperUsdTarget}
                                totalRewardsUsd={totalRewardsUsd}
                                minimumPayouPercentage={minimumPayoutPercentage}
                            />
                        }
                        cursor={
                            <TooltipCursor totalRewardsUsd={totalRewardsUsd} />
                        }
                    />
                )}
            </ComposedChart>
        </ResponsiveContainer>
    );
}
