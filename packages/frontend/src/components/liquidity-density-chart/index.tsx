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
    type LiquidityDensity,
} from "@metrom-xyz/sdk";
import { useCallback, useMemo, useState } from "react";
import { TooltipContent } from "./tooltip";
import classNames from "classnames";
import { LiquidityBar } from "./liquidity-bar";
import { zoom } from "@/src/utils/liquidity-density";
import { ZoomOutIcon } from "@/src/assets/zoom-out-icon";
import { ZoomInIcon } from "@/src/assets/zoom-in-icon";
import { formatUnits } from "viem";

import styles from "./styles.module.css";

interface LiquidityDensityProps {
    error?: boolean;
    loading?: boolean;
    pool?: AmmPool;
    density?: LiquidityDensity;
    from?: number;
    to?: number;
    token0To1: boolean;
    header?: boolean;
    className?: string;
}

export interface ScaledLiquidityTick {
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
    density,
    from,
    to,
    token0To1,
    header,
    className,
}: LiquidityDensityProps) {
    const t = useTranslations("liquidityDensityChart");
    const [tooltipIndex, setTooltipIndex] = useState<number>();
    const [zoomLevel, setZoomLevel] = useState<number>(MAX_ZOOM_LEVEL / 2);

    const { ticks, activeTickIdx } = useMemo(() => {
        if (!density) return { ticks: [], activeTickIdx: null };

        const ticks: ScaledLiquidityTick[] = density.ticks.map((tick) => ({
            ...tick,
            idx: token0To1 ? tick.idx : -tick.idx,
            liquidity: Number(formatUnits(tick.liquidity, 18)),
        }));

        if (!token0To1) ticks.reverse();

        return {
            ticks,
            activeTickIdx: token0To1 ? density.activeIdx : -density.activeIdx,
        };
    }, [density, token0To1]);

    const visibleTicks = useMemo(() => {
        return activeTickIdx === null
            ? []
            : zoom(ticks, activeTickIdx, zoomLevel, ZOOM_FACTOR);
    }, [ticks, activeTickIdx, zoomLevel]);

    const currentPrice = useMemo(() => {
        if (!pool || activeTickIdx === null) return null;
        const price = tickToScaledPrice(activeTickIdx, pool, token0To1);
        if (token0To1) return 1 / price;
        return price;
    }, [pool, activeTickIdx, token0To1]);

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

    if (!density || density.ticks.length === 0)
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
                    data={visibleTicks}
                    onMouseMove={handleOnMouseMove}
                    onMouseLeave={handleOnMouseLeave}
                    margin={{ top: 24 }}
                    style={{ cursor: "pointer" }}
                >
                    <YAxis hide domain={[0, "dataMax"]} />
                    <XAxis hide dataKey={token0To1 ? "price0" : "price1"} />

                    <Bar
                        dataKey="liquidity"
                        maxBarSize={50}
                        minPointSize={10}
                        isAnimationActive={!header}
                        shape={
                            <LiquidityBar
                                token0To1={token0To1}
                                from={from}
                                to={to}
                                activeTickIdx={activeTickIdx}
                                ticks={visibleTicks}
                                currentPrice={currentPrice}
                                tooltipIndex={tooltipIndex}
                            />
                        }
                    >
                        {ticks?.map((_, index) => {
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
