import { closestTick } from "@/src/utils/liquidity-density";
import type { LiquidityDensityChartData } from "..";

import styles from "./styles.module.css";

interface LiquidityBarProps {
    index?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    price0?: number;
    price1?: number;
    flipPrice?: boolean;
    from?: number;
    to?: number;
    chartData: LiquidityDensityChartData[];
    idx?: number;
    activeTick: number | null;
    currentPrice: number | null;
    tooltipIndex?: number;
}

export function LiquidityBar({
    index,
    x,
    y,
    width,
    height,
    price0,
    price1,
    flipPrice,
    from,
    to,
    chartData,
    idx,
    activeTick,
    currentPrice,
    tooltipIndex,
}: LiquidityBarProps) {
    if (
        !idx ||
        index === undefined ||
        width === undefined ||
        height === undefined ||
        price0 === undefined ||
        price1 === undefined ||
        activeTick === null ||
        x === undefined ||
        y === undefined
    )
        return null;

    const inRange =
        from !== undefined && to !== undefined && idx >= from && idx < to;
    const fill =
        Math.abs(idx) === Math.abs(activeTick)
            ? "#6CFF95"
            : inRange
              ? "#6CFF9566"
              : "#E5E7EB";

    let percentage = 0;
    if (
        from !== undefined &&
        to !== undefined &&
        activeTick !== null &&
        currentPrice
    ) {
        const activeTickIndex = chartData.findIndex(
            (data) => Math.abs(data.idx) === Math.abs(activeTick),
        );
        const chartDataInRange = chartData.filter(
            (data) => data.idx >= from && data.idx < to,
        );
        const closestFrom = closestTick(chartDataInRange, from);
        const closestTo = closestTick(chartDataInRange, to);

        // display the price % change only for the range bounds
        // and hide it if it goes out of chart bounds
        if (
            (closestFrom === idx || closestTo === idx) &&
            index !== 0 &&
            index !== chartData.length - 1
        ) {
            const price = flipPrice ? price1 : price0;

            percentage =
                (index < activeTickIndex ? 1 : -1) *
                (Math.abs(price - currentPrice) / currentPrice) *
                100;
        }
    }

    let opacity = 1;
    if (tooltipIndex === index) opacity = 0.65;

    return (
        <g>
            <rect
                x={x}
                y={y}
                fill={fill}
                fillOpacity={opacity}
                width={width}
                height={height}
                rx={4}
            />
            {percentage && (
                <text
                    x={percentage > 0 ? x : x + 15}
                    y={y - 8}
                    fontSize={12}
                    textAnchor={percentage > 0 ? "start" : "end"}
                    className={styles.label}
                >
                    {`${percentage.toFixed(2)}%`}
                </text>
            )}
        </g>
    );
}
