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
import { getPrice, type LiquidityDensity, type Pool } from "@metrom-xyz/sdk";
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
    pool?: Pool;
    liquidityDensity?: LiquidityDensity;
    from?: number;
    to?: number;
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
    liquidityDensity,
    from,
    to,
    header,
    className,
}: LiquidityDensityProps) {
    const t = useTranslations("liquidityDensityChart");
    const [poolTickIndex, setPoolTickIndex] = useState<number>(-1);
    const [tooltipIndex, setTooltipIndex] = useState<number>();
    const [zoomLevel, setZoomLevel] = useState<number>(MAX_ZOOM_LEVEL / 2);

    const chartData: LiquidityDensityChartData[] = useMemo(() => {
        if (!liquidityDensity || !pool) return [];
        return liquidityDensity.ticks
            .map((tick) => ({
                ...tick,
                liquidity: Number(formatUnits(tick.liquidity, 18)),
            }))
            .reverse();
    }, [liquidityDensity, pool]);

    const activeChartData = useMemo(() => {
        return zoom(chartData, poolTickIndex, zoomLevel, ZOOM_FACTOR);
    }, [chartData, poolTickIndex, zoomLevel]);

    const currentPrice = useMemo(() => {
        if (!liquidityDensity || !pool) return null;
        return getPrice(liquidityDensity.activeIdx, pool);
    }, [liquidityDensity, pool]);

    useEffect(() => {
        const index = chartData.findIndex(
            (data) => data.idx === liquidityDensity?.activeIdx,
        );
        setPoolTickIndex(index);
    }, [chartData, liquidityDensity?.activeIdx]);

    function handleOnMouseMove(state: CategoricalChartState) {
        if (state.isTooltipActive) setTooltipIndex(state.activeTooltipIndex);
        else setTooltipIndex(undefined);
    }

    function handleOnMouseLeave() {
        setTooltipIndex(undefined);
    }

    const handleZoomOut = useCallback(() => {
        setZoomLevel((prev) => Math.max(prev - 1, MIN_ZOOM_LEVEL));
    }, []);

    const handleZoomIn = useCallback(() => {
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

    if (!liquidityDensity || liquidityDensity.ticks.length === 0)
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
                            onClick={handleZoomOut}
                            className={{ root: styles.zoomButton }}
                        />
                        <div className={styles.divider}></div>
                        <Button
                            variant="secondary"
                            size="xs"
                            icon={ZoomInIcon}
                            disabled={zoomLevel === MAX_ZOOM_LEVEL}
                            onClick={handleZoomIn}
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
                    <XAxis reversed hide dataKey="price0" />

                    <Bar
                        dataKey="liquidity"
                        maxBarSize={50}
                        minPointSize={10}
                        isAnimationActive={false}
                        shape={
                            <LiquidityBar
                                from={from}
                                to={to}
                                activeIdx={liquidityDensity.activeIdx}
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
