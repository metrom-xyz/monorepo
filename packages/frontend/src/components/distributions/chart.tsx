import type { ProcessedDistribution } from "@/src/types/distributions";
import {
    Bar,
    BarChart,
    BarStack,
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
import type { StackedBar } from ".";
import { useTheme } from "next-themes";
import type { Theme } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

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
const BAR_RADIUS: [number, number, number, number] = [6, 6, 0, 0];

const Chart = memo(function Chart({
    chain,
    distros,
    bars,
    onBarClick,
}: ChartProps) {
    const { resolvedTheme } = useTheme();

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
                {bars.map(({ dataKey, account, tokenAddress }) => (
                    <BarStack
                        key={`${tokenAddress}-${account}`}
                        stackId={tokenAddress}
                        radius={BAR_RADIUS}
                    >
                        <Bar
                            dataKey={dataKey}
                            fill={getColorFromAddress(
                                account as Address,
                                resolvedTheme as Theme,
                            )}
                            onClick={handleOnBarClick}
                        />
                    </BarStack>
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
