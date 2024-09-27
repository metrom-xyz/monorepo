import numeral from "numeral";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface TvlTickProps {
    poolUsdTvl: number;
    lowerUsdTarget: number;
    upperUsdTarget: number;
}

// this component specific to the TVL axis for the simulation chart, and it's
// used to customize the tick label based on the tick index
// (the first being the lower USD target, then current TVL, and the last the upper USD target)
export function TvlTick({
    poolUsdTvl,
    lowerUsdTarget,
    upperUsdTarget,
    ...rest
}: TvlTickProps) {
    const t = useTranslations("simulationChart");

    const { payload, x, y } = rest as any;

    if (!payload || payload.value === 0) return null;

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={12}
                textAnchor="end"
                fontSize={12}
                className={styles.axis}
            >
                {numeral(payload.value).format("($0,0a)")}
            </text>
            {/* TODO: handle issue where the ticks are too close to eachothers */}
            <text
                x={0}
                y={0}
                dy={24}
                textAnchor="end"
                fontSize={12}
                className={styles.axis}
            >
                {payload.value === poolUsdTvl && t("currentTvl")}
                {payload.value === lowerUsdTarget && t("lowerBound")}
                {payload.value === upperUsdTarget && t("upperBound")}
            </text>
        </g>
    );
}