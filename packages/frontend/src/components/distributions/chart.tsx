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
import { memo, useCallback, useMemo } from "react";
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
// const BAR_RADIUS: [number, number, number, number] = [6, 6, 0, 0];

const MemoizedTooltipContent = memo(function MemoizedTooltipContent(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: any,
) {
    return <TooltipContent {...props} />;
});

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

    const tooltipElement = useMemo(
        () => <MemoizedTooltipContent chain={chain} />,
        [chain],
    );

    const renderedBars = useMemo(
        () =>
            bars.map(({ dataKey, account, tokenAddress }) => (
                <Bar
                    key={`${tokenAddress}-${account}`}
                    stackId={tokenAddress}
                    isAnimationActive={false}
                    dataKey={dataKey}
                    fill={getColorFromAddress(
                        account as Address,
                        resolvedTheme as Theme,
                    )}
                    onClick={handleOnBarClick}
                />
            )),
        [bars, resolvedTheme, handleOnBarClick],
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
                    content={tooltipElement}
                />
                <YAxis hide domain={[0, "dataMax"]} />
                <XAxis
                    type="category"
                    dataKey="timestamp"
                    height={20}
                    padding={X_AXIS_PADDINGS}
                    tickSize={4}
                    interval="preserveStartEnd"
                    tick={<Tick />}
                />
                {renderedBars}
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
