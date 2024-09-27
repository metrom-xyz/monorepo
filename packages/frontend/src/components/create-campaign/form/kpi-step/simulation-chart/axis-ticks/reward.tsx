import numeral from "numeral";

import styles from "./styles.module.css";

interface RewardTickProps {}

export function RewardTick({ ...rest }: RewardTickProps) {
    const { payload, x, y } = rest as any;

    if (!payload || payload.value === 0) return null;

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={-10} y={-2} dy={0} fontSize={12} className={styles.axis}>
                {numeral(payload.value).format("($0,0a)")}
            </text>
        </g>
    );
}
