import { Button, ErrorText, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { CategoricalChartState } from "recharts/types/chart/types";
import {
    tickToScaledPrice,
    type AmmPool,
    type InitializedTicks,
} from "@metrom-xyz/sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TooltipContent } from "./tooltip";
import { formatUnits } from "viem";
import classNames from "classnames";
import { LiquidityBar } from "./liquidity-bar";
import { zoom } from "@/src/utils/liquidity-density";
import { ZoomOutIcon } from "@/src/assets/zoom-out-icon";
import { ZoomInIcon } from "@/src/assets/zoom-in-icon";

import styles from "./styles.module.css";

interface LiquidityDensityProps {
    error?: boolean;
    loading?: boolean;
    pool?: AmmPool;
    ticks?: InitializedTicks;
    from?: number;
    to?: number;
    flipPrice?: boolean;
    header?: boolean;
    className?: string;
}

export interface LiquidityDensityChartData {
    idx: number;
    liquidity: number;
    price0: number;
    price1: number;
}

const ZOOM_FACTOR = 50;
const MAX_ZOOM_LEVEL = 5;
const MIN_ZOOM_LEVEL = 1;

export function LiquidityDensityChart({
    error,
    loading,
    pool,
    ticks,
    from,
    to,
    flipPrice,
    header,
    className,
}: LiquidityDensityProps) {
    const t = useTranslations("liquidityDensityChart");
    const [activeTickIndex, setActiveTickIndex] = useState<number>(-1);
    const [tooltipIndex, setTooltipIndex] = useState<number>();
    const [zoomLevel, setZoomLevel] = useState<number>(MAX_ZOOM_LEVEL / 2);

    const chartData: LiquidityDensityChartData[] = useMemo(() => {
        if (!ticks || !pool) return [];
        const list = ticks.list.map((tick) => ({
            ...tick,
            // FIXME: flip the ticks?
            // idx: flipPrice ? -tick.idx : tick.idx,
            liquidity: Number(formatUnits(tick.liquidity, 18)),
        }));

        // FIXME: ok to reverse?
        if (flipPrice) return list;
        return list.reverse();
    }, [ticks, pool, flipPrice]);

    const activeTick = useMemo(() => {
        if (!ticks) return null;
        return ticks.activeIdx;
    }, [ticks]);

    const activeChartData = useMemo(() => {
        return zoom(chartData, activeTickIndex, zoomLevel, ZOOM_FACTOR);
    }, [chartData, activeTickIndex, zoomLevel]);

    const currentPrice = useMemo(() => {
        if (!pool || activeTick === null) return null;
        const price = tickToScaledPrice(activeTick, pool);
        if (flipPrice) return 1 / price;
        return price;
    }, [pool, activeTick, flipPrice]);

    useEffect(() => {
        if (activeTick === null) return;
        const index = chartData.findIndex(
            (data) => Math.abs(data.idx) === Math.abs(activeTick),
        );
        setActiveTickIndex(index);
    }, [chartData, activeTick, activeChartData]);

    function handleOnMouseMove(state: CategoricalChartState) {
        if (state.isTooltipActive) setTooltipIndex(state.activeTooltipIndex);
        else setTooltipIndex(undefined);
    }

    function handleOnMouseLeave() {
        setTooltipIndex(undefined);
    }

    const handleOnZoomOut = useCallback(() => {
        setZoomLevel((prev) => Math.max(prev - 1, MIN_ZOOM_LEVEL));
    }, []);

    const handleOnZoomIn = useCallback(() => {
        setZoomLevel((prev) => Math.min(prev + 1, MAX_ZOOM_LEVEL));
    }, []);

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

    if (!ticks || ticks.list.length === 0)
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
                        <Typography uppercase size="sm" light weight="medium">
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
        <div className={classNames("root", styles.root, className)}>
            {header && (
                <div className={styles.header}>
                    <div className={styles.zoomButtons}>
                        <Button
                            variant="secondary"
                            size="xs"
                            icon={ZoomOutIcon}
                            disabled={zoomLevel === MIN_ZOOM_LEVEL}
                            onClick={handleOnZoomOut}
                            className={{ root: styles.zoomButton }}
                        />
                        <div className={styles.divider}></div>
                        <Button
                            variant="secondary"
                            size="xs"
                            icon={ZoomInIcon}
                            disabled={zoomLevel === MAX_ZOOM_LEVEL}
                            onClick={handleOnZoomIn}
                            className={{ root: styles.zoomButton }}
                        />
                    </div>
                </div>
            )}
            <ResponsiveContainer
                width="100%"
                className={classNames("container", styles.container, className)}
            >
                <BarChart
                    data={activeChartData}
                    onMouseMove={handleOnMouseMove}
                    onMouseLeave={handleOnMouseLeave}
                    margin={{ top: 24 }}
                    style={{ cursor: "pointer" }}
                >
                    <YAxis hide domain={[0, "dataMax"]} />
                    <XAxis
                        reversed
                        hide
                        dataKey={flipPrice ? "price1" : "price0"}
                    />

                    <Bar
                        dataKey="liquidity"
                        maxBarSize={50}
                        minPointSize={10}
                        isAnimationActive={false}
                        shape={
                            <LiquidityBar
                                flipPrice={flipPrice}
                                from={from}
                                to={to}
                                activeTick={activeTick}
                                chartData={activeChartData}
                                currentPrice={currentPrice}
                                tooltipIndex={tooltipIndex}
                            />
                        }
                    >
                        {chartData?.map((_, index) => {
                            return (
                                <Cell key={`cell-${index}`} cursor="pointer" />
                            );
                        })}
                    </Bar>

                    <Tooltip
                        isAnimationActive={false}
                        cursor={false}
                        content={<TooltipContent pool={pool} />}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
