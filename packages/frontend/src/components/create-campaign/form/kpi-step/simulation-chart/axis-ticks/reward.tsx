import numeral from "numeral";

import styles from "./styles.module.css";

interface RewardTickProps {
    payload?: {
        value?: number;
    };
    x?: number;
    y?: number;
}

export function RewardTick({ payload, x, y }: RewardTickProps) {
    if (!payload || payload.value === 0) return null;

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={-10} y={-2} dy={0} fontSize={12} className={styles.axis}>
                {numeral(payload.value).format("($0,0a)")}
            </text>
        </g>
    );
}
