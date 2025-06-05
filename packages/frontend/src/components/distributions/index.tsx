"use client";

import {
    useDistributions,
    type ProcessedDistribution,
} from "@/src/hooks/useDistributions";
import { Card, Typography } from "@metrom-xyz/ui";
import type { Dayjs } from "dayjs";
import { useCallback, useMemo, useRef, useState } from "react";
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
import type { Address, Hex } from "viem";
import { VariableSizeList } from "react-window";
import { BreakdownRow } from "./breakdown-row";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { getColorFromAddress } from "@/src/utils/address";
import { LoadingText } from "./loading-test";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useCampaign } from "@/src/hooks/useCampaign";
import { Header, SkeletonHeader } from "../campaign-details/header";
import { CampaignDuration } from "../campaign-duration";
import { Filters } from "./filters";

import styles from "./styles.module.css";

interface DistributionsProps {
    chain: SupportedChain;
    campaignId: Hex;
}

export interface DistributionChartData extends ProcessedDistribution {}

interface StackedBar {
    dataKey: string;
    account: string;
    token: string;
}

const ACCOUNT_ROW_SIZE = 38;
const MIN_BREAKDOWN_ROW_SIZE = 280;

export function Distributions({ chain, campaignId }: DistributionsProps) {
    const t = useTranslations("campaignDistributions");

    const [from, setFrom] = useState<Dayjs | undefined>();
    const [to, setTo] = useState<Dayjs | undefined>();
    const [active, setActiveDistribution] = useState<number>();

    // TODO: add errors/validations
    // TODO: issue with duplicated timetamps - holesky - 0x23397e99c6085c653205111f3a6ef406abe24abf210ba25e05c53eac43d07a8a - 29 may
    // TODO: filter out 0 weight from breakdown
    const breakdownListRef = useRef(null);

    const { distributions, loading, processing, fetchDistributions } =
        useDistributions({
            chainId: chain,
            campaignId,
            from: from?.unix(),
            to: to?.unix(),
        });

    const { campaign, loading: loadingCampaign } = useCampaign({
        chainId: chain,
        id: campaignId,
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

            return Math.max(
                MIN_BREAKDOWN_ROW_SIZE,
                maxAccounts * ACCOUNT_ROW_SIZE,
            );
        },
        [distributions],
    );

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                {loadingCampaign || !campaign ? (
                    <SkeletonHeader />
                ) : (
                    <Header campaign={campaign} />
                )}
                <CampaignDuration from={campaign?.from} to={campaign?.to} />
            </div>
            <Filters
                from={from}
                to={to}
                loading={loading || processing}
                onFromChange={setFrom}
                onTohange={setTo}
                onFetch={fetchDistributions}
            />
            {loading || processing ? (
                <LoadingText loading={loading} processing={processing} />
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
                                    barSize={25}
                                    style={{ cursor: "pointer" }}
                                >
                                    <Tooltip
                                        isAnimationActive={false}
                                        cursor={false}
                                        shared={false}
                                        content={
                                            <TooltipContent chain={chain} />
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
                                                        index={index}
                                                        active={
                                                            active === index
                                                        }
                                                        chainId={chain}
                                                        distribution={
                                                            distribution
                                                        }
                                                        campaignFrom={
                                                            campaign?.from
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
