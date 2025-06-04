"use client";

import {
    useDistributions,
    type ProcessedDistribution,
} from "@/src/hooks/useDistributions";
import {
    Button,
    Card,
    DateTimePicker,
    Popover,
    TextInput,
    Typography,
} from "@metrom-xyz/ui";
import type { Dayjs } from "dayjs";
import {
    useCallback,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { TooltipContent } from "./tooltip";
import type { Address } from "viem";
import { useChainId } from "wagmi";
import { VariableSizeList } from "react-window";
import { BreakdownRow } from "./breakdown-row";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { getColorFromAddress } from "@/src/utils/address";
import { formatDateTime } from "@/src/utils/format";
import { useClickAway } from "react-use";

import styles from "./styles.module.css";

export interface DistributionChartData extends ProcessedDistribution {}

interface StackedBar {
    dataKey: string;
    account: string;
    token: string;
}

const ACCOUNT_ROW_SIZE = 36;

export function Distributions() {
    const t = useTranslations("campaignDistributions");

    const [campaignId, setCampaignId] = useState<Address>();
    const [from, setFrom] = useState<Dayjs | undefined>();
    const [to, setTo] = useState<Dayjs | undefined>();
    const [fromPopover, setFromPopover] = useState(false);
    const [toPopover, setToPopover] = useState(false);
    const [activeDistribution, setActiveDistribution] = useState<number>();

    // TODO: move inputs to dedicated component
    // TODO: add errors/validations
    // TODO: issue with duplicated timetamps - holesky - 0x23397e99c6085c653205111f3a6ef406abe24abf210ba25e05c53eac43d07a8a - 29 may
    // TODO: filter out 0 weight from breakdown
    const breakdownListRef = useRef(null);
    const [fromAnchor, setFromAnchor] = useState<
        HTMLDivElement | SVGElement | null
    >(null);
    const fromRef = useRef<HTMLDivElement>(null);
    const [toAncor, setToAnchor] = useState<HTMLDivElement | SVGElement | null>(
        null,
    );
    const toRef = useRef<HTMLDivElement>(null);

    const chainId = useChainId();
    const { distributions, loading } = useDistributions({
        campaignId,
        from,
        to,
        enabled: !!campaignId && !!from && !!to,
    });

    const stackedBars = useMemo(() => {
        const existing: Record<string, boolean> = {};
        const bars: StackedBar[] = [];

        for (const dist of distributions) {
            for (const [token, accounts] of Object.entries(dist.weights)) {
                for (const account of Object.keys(accounts)) {
                    const key = `${token}.${account}`;
                    if (existing[key]) continue;

                    bars.push({
                        dataKey: `weights.${token}.${account}.percentage.formatted`,
                        account,
                        token,
                    });
                    existing[key] = true;
                }
            }
        }

        return bars.sort(
            (a, b) => a.account.localeCompare(b.account, "en") * 1,
        );
    }, [distributions]);

    useClickAway(fromRef, getPopoverHandler("from", false));
    useClickAway(toRef, getPopoverHandler("to", false));

    function handleCampaignIdOnChange(event: ChangeEvent<HTMLInputElement>) {
        setCampaignId(event.target.value as Address);
    }

    function getPopoverHandler(type: "from" | "to", open: boolean) {
        return () => {
            if (type === "from") {
                setFromPopover(open);
            } else {
                setToPopover(open);
            }
        };
    }

    // TODO: add type
    const handleStackedBarOnClick = useCallback(
        (event: any) => {
            if (!breakdownListRef.current) return;

            const index = distributions.findIndex(
                ({ timestamp }) => timestamp === event.payload.timestamp,
            );

            setActiveDistribution(index < 0 ? undefined : index);
            (breakdownListRef.current as any).scrollToItem(index, "start");
        },
        [distributions, breakdownListRef],
    );

    // Get the size of the variable size list item based on the number of
    // accounts in that particular distribution.
    const getAccountRowSize = useCallback(
        (index: number) => {
            if (distributions.length === 0) return 0;
            let maxAccounts = 0;

            for (const [, weights] of Object.entries(
                distributions[index].weights,
            )) {
                if (Object.keys(weights).length > maxAccounts)
                    maxAccounts = Object.keys(weights).length;
            }

            return maxAccounts * ACCOUNT_ROW_SIZE;
        },
        [distributions],
    );

    return (
        <div className={styles.root}>
            <Card className={styles.inputsCard}>
                <TextInput
                    label={t("inputs.from")}
                    ref={setFromAnchor}
                    value={formatDateTime(from)}
                    onClick={getPopoverHandler("from", true)}
                    readOnly
                />
                <TextInput
                    label={t("inputs.to")}
                    disabled={!from}
                    ref={setToAnchor}
                    value={formatDateTime(to)}
                    onClick={getPopoverHandler("to", true)}
                    readOnly
                />
                <TextInput
                    label={t("inputs.campaignId")}
                    disabled={!from || !to}
                    value={campaignId}
                    onChange={handleCampaignIdOnChange}
                    className={styles.campaignIdInput}
                />
                <Popover
                    ref={fromRef}
                    anchor={fromAnchor}
                    open={fromPopover}
                    className={styles.datePickerPopover}
                >
                    <DateTimePicker
                        value={from}
                        range={{ from, to }}
                        onChange={setFrom}
                    />
                </Popover>
                <Popover
                    ref={toRef}
                    anchor={toAncor}
                    open={toPopover}
                    className={styles.datePickerPopover}
                >
                    <DateTimePicker
                        value={to}
                        range={{ from, to }}
                        onChange={setTo}
                    />
                </Popover>
            </Card>
            {loading ? (
                <div>Loading...</div>
            ) : distributions.length > 0 ? (
                <div className={styles.dataWrapper}>
                    <div className={styles.section}>
                        <Typography size="lg" weight="medium" uppercase>
                            {t("distributionsOverview")}
                        </Typography>
                        <Card className={styles.chartWrapper}>
                            <ResponsiveContainer
                                width="100%"
                                className={styles.container}
                            >
                                <BarChart
                                    data={distributions}
                                    style={{ cursor: "pointer" }}
                                    barGap={1}
                                    barSize={20}
                                    barCategoryGap={5}
                                >
                                    <Tooltip
                                        isAnimationActive={false}
                                        cursor={false}
                                        shared={false}
                                        content={
                                            <TooltipContent chain={chainId} />
                                        }
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

                                    {stackedBars.map(
                                        ({ dataKey, account, token }) => (
                                            <Bar
                                                key={`${token}-${account}`}
                                                dataKey={dataKey}
                                                stackId={token}
                                                fill={getColorFromAddress(
                                                    account as Address,
                                                )}
                                                isAnimationActive={false}
                                                onClick={
                                                    handleStackedBarOnClick
                                                }
                                            />
                                        ),
                                    )}
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                    <div className={styles.section}>
                        <Typography size="lg" weight="medium" uppercase>
                            {t("distributionsBreakdown")}
                        </Typography>
                        <Card className={styles.breakdownListWrapper}>
                            <AutoSizer>
                                {({ height, width }) => {
                                    return (
                                        <VariableSizeList
                                            ref={breakdownListRef}
                                            height={height}
                                            width={width}
                                            itemCount={distributions.length}
                                            itemData={distributions}
                                            itemSize={getAccountRowSize}
                                            className={styles.breakdownsList}
                                        >
                                            {({ index, style, data }) => {
                                                const distribution: ProcessedDistribution =
                                                    data[index];

                                                return (
                                                    <BreakdownRow
                                                        style={style}
                                                        active={
                                                            activeDistribution ===
                                                            index
                                                        }
                                                        chainId={chainId}
                                                        distribution={
                                                            distribution
                                                        }
                                                    />
                                                );
                                            }}
                                        </VariableSizeList>
                                    );
                                }}
                            </AutoSizer>
                        </Card>
                    </div>
                </div>
            ) : (
                <div>No data</div>
            )}
        </div>
    );
}

interface TickProps {
    payload?: {
        value: number;
    };
    x?: number;
    y?: number;
}

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
