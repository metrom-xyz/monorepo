import { useMemo } from "react";
import { formatUsdAmount } from "@/src/utils/format";
import { isChartAxisTickActive } from "@/src/utils/kpi";

import styles from "./styles.module.css";

interface TvlTickProps {
    poolTvlScale?: number;
    lowerBoundScale?: number;
    upperBoundScale?: number;
    payload?: {
        value?: number;
    };
    x?: number;
    y?: number;
}

const TICK_PROXIMITY_THRESHOLD = 64;

// this component specific to the TVL axis for the simulation chart, and it's
// used to customize the tick label
export function TvlTick({
    poolTvlScale,
    lowerBoundScale,
    upperBoundScale,
    payload,
    y,
    x,
}: TvlTickProps) {
    const textAnchor = useMemo(() => {
        if (
            x === undefined ||
            poolTvlScale === undefined ||
            lowerBoundScale === undefined ||
            upperBoundScale === undefined
        )
            return "middle";

        const poolTvl = isChartAxisTickActive(x, poolTvlScale);
        const lowerBound = isChartAxisTickActive(x, lowerBoundScale);
        const upperBound = isChartAxisTickActive(x, upperBoundScale);

        const closeToLowerBound =
            Math.abs(x - lowerBoundScale) <= TICK_PROXIMITY_THRESHOLD;
        const closeToUpperBound =
            Math.abs(x - upperBoundScale) <= TICK_PROXIMITY_THRESHOLD;
        const closeBounds =
            upperBoundScale - lowerBoundScale <= TICK_PROXIMITY_THRESHOLD;

        if (closeBounds) {
            if (lowerBound) return "end";
            if (upperBound) return "start";
        }

        if (closeToLowerBound) {
            if (poolTvl) return x <= lowerBoundScale ? "end" : "start";
            if (lowerBound) return x <= poolTvlScale ? "end" : "start";
        }

        if (closeToUpperBound) {
            if (poolTvl) return x >= upperBoundScale ? "start" : "end";
            if (upperBound) return x >= poolTvlScale ? "start" : "end";
        }

        return "middle";
    }, [lowerBoundScale, poolTvlScale, upperBoundScale, x]);

    if (!payload || payload.value === undefined) return null;

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={12}
                textAnchor={textAnchor}
                fontSize={12}
                className={styles.axis}
            >
                {formatUsdAmount(payload.value)}
            </text>
        </g>
    );
}
