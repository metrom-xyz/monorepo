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
import { memo, useCallback } from "react";

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
    timestamp: number;
}

interface ChartProps {
    chain: SupportedChain;
    distros: ProcessedDistribution[];
    bars: StackedBar[];
    onBarClick: (data: BarPayload) => void;
}

const CHART_STYLES = { cursor: "pointer" };
const X_AXIS_PADDINGS = { left: 0, right: 0 };

const Chart = memo(function Chart({
    chain,
    distros,
    bars,
    onBarClick,
}: ChartProps) {
    const handleOnBarClick = useCallback(
        (data: unknown) => {
            const { timestamp } = data as BarPayload;
            if (!timestamp) return;

            onBarClick(data as BarPayload);
        },
        [onBarClick],
    );

    const TooltipContentMemoized = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (props: any) => <TooltipContent {...props} chain={chain} />,
        [chain],
    );

    return (
        <ResponsiveContainer width="100%">
            <BarChart
                data={distros}
                barSize={25}
                accessibilityLayer={false}
                style={CHART_STYLES}
            >
                <Tooltip
                    isAnimationActive={false}
                    cursor={false}
                    shared={false}
                    content={TooltipContentMemoized}
                />
                <YAxis hide />
                <XAxis
                    type="category"
                    dataKey="timestamp"
                    height={20}
                    padding={X_AXIS_PADDINGS}
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
                        onClick={handleOnBarClick}
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
