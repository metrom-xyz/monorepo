import type { ProcessedDistribution } from "@/src/types/distributions";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { Address } from "viem";
import { TooltipContent } from "./tooltip";
import { getColorFromAddress } from "@/src/utils/address";
import type { SupportedChain } from "@metrom-xyz/contracts";
import dayjs from "dayjs";
import { memo } from "react";

import styles from "./styles.module.css";

export interface StackedBar {
    dataKey: string;
    account: string;
    token: string;
}

interface TickProps {
    payload?: {
        value: number;
    };
    x?: number;
    y?: number;
}

export interface BarPayload {
    // add more props if needed
    payload: {
        timestamp: number;
    };
}

interface ChartProps {
    chain: SupportedChain;
    distros: ProcessedDistribution[];
    bars: StackedBar[];
    onBarClick: (value: BarPayload) => void;
}

const Chart = memo(function Chart({
    chain,
    distros,
    bars,
    onBarClick,
}: ChartProps) {
    return (
        <ResponsiveContainer width="100%">
            <BarChart data={distros} barSize={25} style={{ cursor: "pointer" }}>
                <Tooltip
                    isAnimationActive={false}
                    cursor={false}
                    shared={false}
                    content={<TooltipContent chain={chain} />}
                />
                <YAxis hide />
                <XAxis
                    type="category"
                    dataKey="timestamp"
                    height={20}
                    padding={{ left: 0, right: 0 }}
                    tickSize={4}
                    interval="preserveStartEnd"
                    tick={<Tick />}
                />
                {bars.map(({ dataKey, account, token }) => (
                    <Bar
                        key={`${token}-${account}`}
                        dataKey={dataKey}
                        stackId={token}
                        isAnimationActive={false}
                        fill={getColorFromAddress(account as Address)}
                        onClick={onBarClick}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
});

function Tick({ payload, x, y }: TickProps) {
    if (!payload?.value) return null;

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={12}
                fontSize={12}
                textAnchor="middle"
                className={styles.timeTick}
            >
                {dayjs.unix(payload.value).format("DD MMM HH:mm")}
            </text>
        </g>
    );
}

export { Chart };
