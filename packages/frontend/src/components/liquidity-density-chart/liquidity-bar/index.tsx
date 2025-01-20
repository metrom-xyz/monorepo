import { closestTick } from "@/src/utils/liquidity-density";
import type { ScaledLiquidityTick } from "..";

import styles from "./styles.module.css";

interface LiquidityBarProps {
    index?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    price0?: number;
    price1?: number;
    token0To1: boolean;
    from?: number;
    to?: number;
    ticks: ScaledLiquidityTick[];
    idx?: number;
    activeTickIdx: number | null;
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
    token0To1,
    from,
    to,
    ticks,
    idx,
    activeTickIdx,
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
        activeTickIdx === null ||
        x === undefined ||
        y === undefined
    )
        return null;

    const inRange =
        from !== undefined && to !== undefined && idx >= from && idx < to;
    const fill =
        idx === activeTickIdx ? "#6CFF95" : inRange ? "#6CFF9566" : "#E5E7EB";

    let percentage = 0;
    if (
        from !== undefined &&
        to !== undefined &&
        activeTickIdx !== null &&
        currentPrice
    ) {
        const activeTickIndex = ticks.findIndex(
            (tick) => tick.idx === activeTickIdx,
        );
        const chartDataInRange = ticks.filter(
            (tick) => tick.idx >= from && tick.idx < to,
        );
        const closestFrom = closestTick(chartDataInRange, from);
        const closestTo = closestTick(chartDataInRange, to);

        // display the price % change only for the range bounds
        // and hide it if it goes out of chart bounds
        if (
            (closestFrom === idx || closestTo === idx) &&
            index !== 0 &&
            index !== ticks.length - 1
        ) {
            const price = token0To1 ? price0 : price1;

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
