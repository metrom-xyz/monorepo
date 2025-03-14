import { closestTick } from "@/src/utils/liquidity-density";
import type { ScaledLiquidityTick } from "..";
import classNames from "classnames";
import { formatAmount } from "@/src/utils/format";

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
    fromTick?: number;
    fromPrice?: number;
    toTick?: number;
    toPrice?: number;
    ticks: ScaledLiquidityTick[];
    idx?: number;
    activeTickIdx: number | null;
    currentPrice: number | null;
    tooltipIndex?: number;
    showPriceRange?: boolean;
}

function getTopRoundedPath(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number = 6,
) {
    const r = Math.min(radius, width / 2, height);
    return `
      M${x},${y + height} 
      L${x},${y + r} 
      Q${x},${y} ${x + r},${y} 
      L${x + width - r},${y} 
      Q${x + width},${y} ${x + width},${y + r} 
      L${x + width},${y + height} 
      Z
    `;
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
    fromTick,
    fromPrice,
    toTick,
    toPrice,
    ticks,
    idx,
    activeTickIdx,
    currentPrice,
    tooltipIndex,
    showPriceRange,
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
        fromTick !== undefined &&
        toTick !== undefined &&
        idx >= fromTick &&
        idx < toTick;

    let percentage = 0;
    let closestFrom;
    let closestTo;
    if (
        fromTick !== undefined &&
        toTick !== undefined &&
        activeTickIdx !== null &&
        currentPrice
    ) {
        const activeTickIndex = ticks.findIndex(
            (tick) => tick.idx === activeTickIdx,
        );
        const chartDataInRange = ticks.filter(
            (tick) => tick.idx >= fromTick && tick.idx < toTick,
        );
        closestFrom = closestTick(chartDataInRange, fromTick);
        closestTo = closestTick(chartDataInRange, toTick);

        // display the price % change only for the range bounds
        // and hide it if it goes out of chart bounds
        if (
            (closestFrom === idx || closestTo === idx) &&
            index !== 0 &&
            index !== ticks.length - 1
        ) {
            const price = token0To1 ? price0 : price1;

            percentage =
                (index < activeTickIndex ? -1 : 1) *
                (Math.abs(price - currentPrice) / currentPrice) *
                100;
        }
    }

    let opacity = 1;
    if (tooltipIndex === index) opacity = 0.65;

    return (
        <g>
            <path
                d={getTopRoundedPath(x, y, width, height)}
                fillOpacity={opacity}
                className={classNames(styles.bar, {
                    [styles.activeTick]: idx === activeTickIdx,
                    [styles.inRange]: inRange,
                })}
            />
            {percentage && (
                <>
                    <text
                        x={percentage > 0 ? x : x + 15}
                        y={y - 8}
                        fontSize={12}
                        textAnchor={percentage > 0 ? "start" : "end"}
                        className={styles.label}
                    >
                        {`${percentage.toFixed(2)}%`}
                    </text>
                    {showPriceRange && closestFrom === idx && (
                        <text
                            x={x}
                            y={320}
                            fontSize={12}
                            textAnchor="end"
                            className={styles.label}
                        >
                            {formatAmount({ amount: fromPrice })}
                        </text>
                    )}
                    {showPriceRange && closestTo === idx && (
                        <text
                            x={x}
                            y={320}
                            fontSize={12}
                            textAnchor="start"
                            className={styles.label}
                        >
                            {formatAmount({ amount: toPrice })}
                        </text>
                    )}
                </>
            )}
        </g>
    );
}
