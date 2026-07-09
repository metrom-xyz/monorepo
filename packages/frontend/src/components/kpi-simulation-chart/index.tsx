import {
    Area,
    ComposedChart,
    Line,
    ReferenceDot,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    type ReferenceLineSegment,
    type TooltipContentProps,
} from "recharts";
import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Skeleton, type TypographySize } from "@metrom-xyz/ui";
import { TvlTick } from "./axis-ticks/tvl";
import { RewardTick } from "./axis-ticks/reward";
import { TooltipContent, TooltipCursor } from "./tooltip";
import { TargetReferenceLines } from "./reference-lines";
import { getDistributableRewardsPercentage } from "@/src/utils/kpi";
import classNames from "classnames";
import { formatUsdAmount } from "@/src/utils/format";
import { SECONDS_IN_YEAR } from "@/src/commons";
import { DiagramIcon } from "@/src/assets/diagra-icon";
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
    const originalRange = originalMax - originalMin;
    if (originalRange === 0) return newMin;

    return (
        ((value - originalMin) / originalRange) * (newMax - newMin) + newMin
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

export const CHART_MARGINS = { top: 34, right: 4, bottom: 4, left: 2 };
const POINTS_COUNT = 200;
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
        const minPadding = targetValues[2] * 0.25;
        const basicPadding = fullRange > 0 ? fullRange * 0.28 : minPadding;
        const lowerBoundPadding =
            targetValues[0] === 0
                ? fullRange > 0
                    ? fullRange * 0.25
                    : minPadding
                : basicPadding;

        return [
            targetValues[0] - lowerBoundPadding,
            ...targetValues,
            targetValues[2] + basicPadding,
        ];
    }, [lowerUsdTarget, targetUsdValue, upperUsdTarget]);

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

        if (domainStep === 0) return [];

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

        aprPercentages.sort((a, b) => a - b);
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

    // dedupe the ticks to avoid duplicated react keys in recharts when some
    // of the values match (e.g. current payout equal to the total rewards)
    const yAxisTicks = useMemo(() => {
        const ticks =
            minPayoutUsd > 0
                ? [minPayoutUsd, currentPayoutUsd, totalRewardsUsd]
                : [currentPayoutUsd, totalRewardsUsd];
        return Array.from(new Set(ticks)).sort((a, b) => a - b);
    }, [currentPayoutUsd, minPayoutUsd, totalRewardsUsd]);

    const xAxisTicks = useMemo(
        () => Array.from(new Set(sortedSignificantTargetUsdValues.slice(1, 4))),
        [sortedSignificantTargetUsdValues],
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
        (props: TooltipContentProps) => (
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
                        <EmptyState
                            title={t("errors.missingData")}
                            icon={DiagramIcon}
                        />
                    ) : (
                        <EmptyState title={t("emptyData")} icon={DiagramIcon} />
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
                    <EmptyState
                        title={t("errors.wrongData")}
                        icon={DiagramIcon}
                    />
                </div>
            </div>
        );
    }

    return (
        <ResponsiveContainer
            width="100%"
            height="100%"
            minHeight={270}
            className={classNames("container", styles.container, className)}
        >
            <ComposedChart
                data={chartData}
                margin={CHART_MARGINS}
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
                    dataKey="targetUsdValue"
                    interval={0}
                    tick={
                        <TvlTick
                            complex={complex}
                            targetUsdValue={targetUsdValue}
                            lowerUsdTarget={lowerUsdTarget}
                            upperUsdTarget={upperUsdTarget}
                        />
                    }
                    ticks={xAxisTicks}
                    tickFormatter={tickFormatter}
                    domain={xAxisDomain}
                    className={styles.xAxis}
                />
                <YAxis
                    type="number"
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

                <TargetReferenceLines
                    targetValueName={targetValueName}
                    targetUsdValue={targetUsdValue}
                    lowerUsdTarget={lowerUsdTarget}
                    upperUsdTarget={upperUsdTarget}
                    totalRewardsUsd={totalRewardsUsd}
                    campaignEnded={campaignEnded}
                    complex={complex}
                />

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
                        cursor={<TooltipCursor />}
                    />
                )}
            </ComposedChart>
        </ResponsiveContainer>
    );
}
