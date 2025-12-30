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
    type ReferenceLineSegment,
} from "recharts";
import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ErrorText, Skeleton, type TypographySize } from "@metrom-xyz/ui";
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
import type { AxisDomain } from "recharts/types/util/types";
import { EmptyState } from "../empty-state";

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
    targetUsdValue: number;
    currentlyDistributing: number;
    currentlyNotDistributing: number;
    aprPercentage: number;
    aprLinePoint?: number;
}

interface KpiSimulationChartProps {
    targetValueName: string;
    minimumPayoutPercentage?: number;
    lowerUsdTarget?: number;
    upperUsdTarget?: number;
    totalRewardsUsd: number;
    targetUsdValue?: number | null;
    campaignDurationSeconds: number;
    campaignEnded?: boolean;
    error?: boolean;
    loading?: boolean;
    tooltipSize?: TypographySize;
    tooltip?: boolean;
    complex?: boolean;
    className?: string;
}

export const MAX_AREA_HEIGHT = 364;
export const CHART_MARGINS = { top: 34, right: 4, bottom: 4, left: 2 };
const REFERENCE_LINE_PROXIMITY_THRESHOLD = 16;
const REFERENCE_LINE_LABEL_DX = 10;
const POINTS_COUNT = 1000;
const CHART_STYLES = { cursor: "pointer" };
const Y_AXIS_DOMAIN: AxisDomain = [0, "dataMax"];

export function KpiSimulationChart({
    targetValueName,
    minimumPayoutPercentage = 0,
    lowerUsdTarget,
    upperUsdTarget,
    totalRewardsUsd,
    targetUsdValue,
    campaignDurationSeconds,
    campaignEnded,
    error,
    loading,
    tooltipSize,
    complex = false,
    tooltip = true,
    className,
}: KpiSimulationChartProps) {
    const t = useTranslations("simulationChart");
    const [chartRef, { width }] = useMeasure<HTMLDivElement>();

    const currentPayoutUsd =
        targetUsdValue &&
        lowerUsdTarget !== undefined &&
        upperUsdTarget !== undefined
            ? totalRewardsUsd *
              getDistributableRewardsPercentage(
                  targetUsdValue,
                  lowerUsdTarget,
                  upperUsdTarget,
                  minimumPayoutPercentage,
              )
            : 0;

    const minPayoutUsd = totalRewardsUsd * minimumPayoutPercentage;

    const sortedSignificantTargetUsdValues = useMemo(() => {
        if (
            lowerUsdTarget === undefined ||
            upperUsdTarget === undefined ||
            targetUsdValue === null ||
            targetUsdValue === undefined
        )
            return [];

        const targetValues = [targetUsdValue, lowerUsdTarget, upperUsdTarget];
        targetValues.sort((a, b) => a - b);
        const fullRange = targetValues[2] - targetValues[0];
        const basicPadding = fullRange * 0.28;
        const paddingForLowerZeroLowerBound = fullRange * 0.25;
        const lowerBoundPadding =
            targetValues[0] === 0
                ? paddingForLowerZeroLowerBound
                : basicPadding;

        return [
            targetValues[0] - lowerBoundPadding,
            ...targetValues,
            targetValues[2] + basicPadding,
        ];
    }, [lowerUsdTarget, targetUsdValue, upperUsdTarget]);

    const { poolTvlScale, lowerBoundScale, upperBoundScale } = useMemo(() => {
        if (
            targetUsdValue === null ||
            targetUsdValue === undefined ||
            lowerUsdTarget === undefined ||
            upperUsdTarget === undefined
        )
            return {};

        const chartWidth = width - CHART_MARGINS.left - CHART_MARGINS.right;
        const tvls = [targetUsdValue, lowerUsdTarget, upperUsdTarget];
        const [poolTvlScale, lowerBoundScale, upperBoundScale] = tvls.map(
            (tvl) =>
                getChartAxisScale(
                    tvl,
                    sortedSignificantTargetUsdValues[0],
                    sortedSignificantTargetUsdValues[
                        sortedSignificantTargetUsdValues.length - 1
                    ],
                    0,
                    chartWidth,
                ) + CHART_MARGINS.left,
        );

        return { poolTvlScale, lowerBoundScale, upperBoundScale };
    }, [
        lowerUsdTarget,
        targetUsdValue,
        sortedSignificantTargetUsdValues,
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
            targetUsdValue === null ||
            targetUsdValue === undefined ||
            sortedSignificantTargetUsdValues.length === 0
        )
            return [];

        const lowertTargetUsdValue = sortedSignificantTargetUsdValues[0];
        const upperTargetUsdValue = sortedSignificantTargetUsdValues[4];
        const targetUsdValueRange = upperTargetUsdValue - lowertTargetUsdValue;
        const domainStep = targetUsdValueRange / POINTS_COUNT;

        const chartData: DistributedAreaDataPoint[] = [];

        let minAprPercentage = Number.POSITIVE_INFINITY;
        let maxAprPercentage = 0;

        const aprPercentages = [];
        for (
            let usdStep = lowertTargetUsdValue;
            usdStep <= upperTargetUsdValue;
            usdStep += domainStep
        ) {
            if (usdStep <= 0) continue;

            const distributaleRewardsPercentage =
                getDistributableRewardsPercentage(
                    usdStep,
                    lowerUsdTarget,
                    upperUsdTarget,
                    minimumPayoutPercentage,
                );
            const distributedRewardsUsd =
                totalRewardsUsd * distributaleRewardsPercentage;

            const rewardsRatio = distributedRewardsUsd / usdStep;
            const yearMultiplier = SECONDS_IN_YEAR / campaignDurationSeconds;
            const aprPercentage = rewardsRatio * yearMultiplier * 100;

            aprPercentages.push(aprPercentage);

            if (aprPercentage > maxAprPercentage)
                maxAprPercentage = aprPercentage;
            if (aprPercentage < minAprPercentage)
                minAprPercentage = aprPercentage;

            chartData.push({
                targetUsdValue: usdStep,
                currentlyDistributing:
                    usdStep <= targetUsdValue ? distributedRewardsUsd : 0,
                currentlyNotDistributing:
                    usdStep > targetUsdValue ? distributedRewardsUsd : 0,
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
        targetUsdValue,
        sortedSignificantTargetUsdValues,
        totalRewardsUsd,
        upperUsdTarget,
        campaignDurationSeconds,
    ]);

    const xAxisDomain = useMemo(
        () => [
            sortedSignificantTargetUsdValues[0],
            sortedSignificantTargetUsdValues[4],
        ],
        [sortedSignificantTargetUsdValues],
    );

    const yAxisTicks = useMemo(() => {
        if (minPayoutUsd > 0)
            return [minPayoutUsd, currentPayoutUsd, totalRewardsUsd].sort(
                (a, b) => a - b,
            );
        return [currentPayoutUsd, totalRewardsUsd];
    }, [currentPayoutUsd, minPayoutUsd, totalRewardsUsd]);

    const targetValueReferenceLineSegment: ReferenceLineSegment =
        useMemo(() => {
            return [
                {
                    x: targetUsdValue || 0,
                    y: 0,
                },
                {
                    x: targetUsdValue || 0,
                    y: totalRewardsUsd,
                },
            ];
        }, [targetUsdValue, totalRewardsUsd]);

    const lowerBoundReferenceLineSegment: ReferenceLineSegment = useMemo(
        () => [
            {
                x: lowerUsdTarget,
                y: 0,
            },
            {
                x: lowerUsdTarget,
                y: totalRewardsUsd,
            },
        ],
        [lowerUsdTarget, totalRewardsUsd],
    );

    const uppderBoundReferenceLineSegment: ReferenceLineSegment = useMemo(
        () => [
            {
                x: upperUsdTarget,
                y: 0,
            },
            {
                x: upperUsdTarget,
                y: totalRewardsUsd,
            },
        ],
        [totalRewardsUsd, upperUsdTarget],
    );

    const currentPayoutReferenceLineSegment: ReferenceLineSegment = useMemo(
        () => [
            { x: 0, y: currentPayoutUsd },
            { x: targetUsdValue || 0, y: currentPayoutUsd },
        ],
        [currentPayoutUsd, targetUsdValue],
    );

    const tickFormatter = useCallback((value: unknown) => {
        return formatUsdAmount({ amount: value as number });
    }, []);

    const TooltipContentMemoized = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (props: any) => (
            <TooltipContent
                {...props}
                size={tooltipSize}
                targetValueName={targetValueName}
                lowerUsdTarget={lowerUsdTarget || 0}
                upperUsdTarget={upperUsdTarget || 0}
                totalRewardsUsd={totalRewardsUsd}
                minimumPayouPercentage={minimumPayoutPercentage}
            />
        ),
        [
            lowerUsdTarget,
            minimumPayoutPercentage,
            targetValueName,
            tooltipSize,
            totalRewardsUsd,
            upperUsdTarget,
        ],
    );

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
        targetUsdValue === null ||
        targetUsdValue === undefined
    ) {
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
                        <EmptyState title={t("emptyData")} icon={ChartIcon} />
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
                accessibilityLayer={false}
                style={CHART_STYLES}
            >
                <Area
                    type="monotone"
                    dataKey="currentlyDistributing"
                    fill="#6CFF95"
                    stroke="none"
                    fillOpacity={1}
                    animationEasing="ease-in-out"
                    animationDuration={400}
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
                    animationDuration={400}
                    isAnimationActive={true}
                    activeDot={false}
                    className={styles.notDistributingArea}
                />

                <Line
                    type="monotone"
                    dataKey="aprLinePoint"
                    fillOpacity={1}
                    animationEasing="ease-in-out"
                    animationDuration={400}
                    isAnimationActive={true}
                    activeDot={false}
                    dot={false}
                    className={styles.aprLine}
                />

                <XAxis
                    type="number"
                    format="number"
                    dataKey="targetUsdValue"
                    interval={0}
                    tick={
                        <TvlTick
                            complex={complex}
                            targetUsdValue={targetUsdValue}
                            lowerUsdTarget={lowerUsdTarget}
                            upperUsdTarget={upperUsdTarget}
                            poolTvlScale={poolTvlScale}
                            lowerBoundScale={lowerBoundScale}
                            upperBoundScale={upperBoundScale}
                        />
                    }
                    ticks={sortedSignificantTargetUsdValues.slice(1, 4)}
                    tickFormatter={tickFormatter}
                    domain={xAxisDomain}
                    className={styles.xAxis}
                />
                <YAxis
                    type="number"
                    format="number"
                    axisLine={false}
                    tickLine={false}
                    mirror
                    tick={
                        <RewardTick
                            complex={complex}
                            minPayoutPercentage={minimumPayoutPercentage}
                            minPayoutUsd={minPayoutUsd}
                            currentPayoutUsd={currentPayoutUsd}
                            totalRewardsUsd={totalRewardsUsd}
                        />
                    }
                    domain={Y_AXIS_DOMAIN}
                    ticks={yAxisTicks}
                />

                <ReferenceLine
                    strokeDasharray={"4 4"}
                    ifOverflow="visible"
                    segment={targetValueReferenceLineSegment}
                    className={classNames(styles.referenceLine, styles.green)}
                >
                    {!complex && (
                        <Label
                            value={
                                campaignEnded
                                    ? t("targetValue.campaignEnded", {
                                          targetValueName,
                                      })
                                    : t("targetValue.campaignActive", {
                                          targetValueName,
                                      })
                            }
                            dx={poolTvlDx}
                            angle={90}
                            className={classNames(styles.axisLabel, {
                                [styles.complex]: complex,
                            })}
                        />
                    )}
                </ReferenceLine>

                <ReferenceLine
                    strokeDasharray={"4 4"}
                    ifOverflow="visible"
                    segment={lowerBoundReferenceLineSegment}
                    className={styles.referenceLine}
                >
                    {!complex && (
                        <Label
                            value={t("lowerBound")}
                            dx={lowerBoundDx}
                            angle={270}
                            className={classNames(styles.axisLabel, {
                                [styles.complex]: complex,
                            })}
                        />
                    )}
                </ReferenceLine>

                <ReferenceLine
                    strokeDasharray={"4 4"}
                    ifOverflow="visible"
                    segment={uppderBoundReferenceLineSegment}
                    className={styles.referenceLine}
                >
                    {!complex && (
                        <Label
                            value={t("upperBound")}
                            dx={upperBoundDx}
                            angle={90}
                            className={styles.axisLabel}
                        />
                    )}
                </ReferenceLine>

                {currentPayoutUsd > 0 && (
                    <>
                        <ReferenceLine
                            strokeDasharray={"4 4"}
                            ifOverflow="visible"
                            segment={currentPayoutReferenceLineSegment}
                            className={classNames(
                                styles.referenceLine,
                                styles.green,
                            )}
                        />
                        <ReferenceDot
                            x={targetUsdValue}
                            y={currentPayoutUsd}
                            r={5}
                            strokeWidth={2}
                            className={styles.referenceDot}
                        />
                    </>
                )}

                {tooltip && (
                    <Tooltip
                        isAnimationActive={false}
                        content={TooltipContentMemoized}
                        cursor={
                            <TooltipCursor totalRewardsUsd={totalRewardsUsd} />
                        }
                    />
                )}
            </ComposedChart>
        </ResponsiveContainer>
    );
}
