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
import { TooltipContent } from "./tooltip";
import type { SupportedChain } from "@metrom-xyz/contracts";
import dayjs from "dayjs";
import { memo, useCallback, useMemo } from "react";
import type { StackedBar } from ".";
import type { AxisDomain } from "recharts/types/util/types";

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
    account: string;
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
const Y_AXIS_DOMAIN: AxisDomain = [0, 100];
const BAR_RADIUS: [number, number, number, number] = [6, 6, 0, 0];

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
    const getOnBarClickHandler = useCallback(
        (account: string) => {
            return (data: unknown) => {
                const { timestamp } = data as BarPayload;
                if (!timestamp) return;

                console.log("account", account, timestamp);
                onBarClick({ account, timestamp });
            };
        },
        [onBarClick],
    );

    const tooltipElement = useMemo(
        () => <MemoizedTooltipContent chain={chain} />,
        [chain],
    );

    const renderedBars = useMemo(
        () =>
            bars.map(({ dataKey, account, color, tokenAddress }) => (
                <Bar
                    key={`${tokenAddress}-${account}`}
                    stackId={tokenAddress}
                    isAnimationActive={false}
                    dataKey={dataKey}
                    fill={color}
                    onClick={getOnBarClickHandler(account)}
                />
            )),
        [bars, getOnBarClickHandler],
    );

    return (
        <ResponsiveContainer width="100%">
            <BarChart
                data={distros}
                accessibilityLayer={false}
                stackOffset="expand"
                style={CHART_STYLES}
            >
                <Tooltip
                    isAnimationActive={false}
                    cursor={false}
                    shared={false}
                    content={tooltipElement}
                />
                <YAxis type="number" hide domain={Y_AXIS_DOMAIN} />
                <XAxis
                    type="category"
                    dataKey="timestamp"
                    height={20}
                    padding={X_AXIS_PADDINGS}
                    tickSize={4}
                    interval="preserveStartEnd"
                    tick={<Tick />}
                />
                <BarStack radius={BAR_RADIUS}>{renderedBars}</BarStack>
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
