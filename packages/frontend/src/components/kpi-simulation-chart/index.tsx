import {
    Area,
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
import { ErrorText, Typography, type TypographyVariant } from "@metrom-xyz/ui";
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

import styles from "./styles.module.css";

export interface DistributedAreaDataPoint {
    usdTvl: number;
    currentlyDistributing: number;
    currentlyNotDistributing: number;
}

interface KpiSimulationChartProps {
    minimumPayoutPercentage?: number;
    lowerUsdTarget?: number;
    upperUsdTarget?: number;
    totalRewardsUsd: number;
    poolUsdTvl?: number | null;
    campaignEnded?: boolean;
    error?: boolean;
    loading?: boolean;
    tooltipSize?: TypographyVariant;
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
    campaignEnded,
    error,
    loading,
    tooltipSize,
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
            ref={chartRef}
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
                            size={tooltipSize}
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
