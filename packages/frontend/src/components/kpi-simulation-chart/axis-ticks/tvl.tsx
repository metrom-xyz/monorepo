import { useTranslations } from "next-intl";
import { formatUsdAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface TvlTickProps {
    poolUsdTvl: number;
    lowerUsdTarget: number;
    upperUsdTarget: number;
    payload?: {
        value?: number;
    };
    x?: number;
    y?: number;
    index?: number;
}

// this component specific to the TVL axis for the simulation chart, and it's
// used to customize the tick label based on the tick index
// (the first being the lower USD target, then current TVL, and the last the upper USD target)
export function TvlTick({
    poolUsdTvl,
    lowerUsdTarget,
    upperUsdTarget,
    payload,
    y,
    x,
    index,
}: TvlTickProps) {
    const t = useTranslations("simulationChart");

    if (!payload || payload.value === 0) return null;

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={12}
                textAnchor={index === 2 ? "end" : "start"}
                fontSize={12}
                className={styles.axis}
            >
                {formatUsdAmount(payload.value)}
            </text>
            {/* TODO: handle issue where the ticks are too close to each others */}
            <text
                x={0}
                y={0}
                dy={24}
                textAnchor={index === 2 ? "end" : "start"}
                fontSize={12}
                className={styles.axis}
            >
                {payload.value === poolUsdTvl && t("pool")}
                {payload.value === lowerUsdTarget && t("lowerBound")}
                {payload.value === upperUsdTarget && t("upperBound")}
            </text>
        </g>
    );
}
