"use client";

import { Card, Typography } from "@metrom-xyz/ui";
import { useCallback, useMemo, useRef, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import type { Hex } from "viem";
import { VariableSizeList } from "react-window";
import { BreakdownRow, BreakdownRowSkeleton } from "./breakdown-row";
import { useTranslations } from "next-intl";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useCampaign } from "@/src/hooks/useCampaign";
import { Header, SkeletonHeader } from "../campaign-details/header";
import { CampaignDuration } from "../campaign-duration";
import { Filters } from "./filters";
import { NoDistributionsIcon } from "@/src/assets/no-distributions-icon";
import classNames from "classnames";
import type { ProcessedDistribution } from "@/src/types/distributions";
import { Chart, type BarPayload } from "./chart";

import styles from "./styles.module.css";

interface DistributionsProps {
    chain: SupportedChain;
    campaignId: Hex;
}

export interface DistributionChartData extends ProcessedDistribution {}

export interface StackedBar {
    dataKey: string;
    account: string;
    token: string;
}

const ACCOUNT_ROW_SIZE = 28;
const ACCOUNT_ROW_PADDINGS = 152;

export function Distributions({ chain, campaignId }: DistributionsProps) {
    const t = useTranslations("campaignDistributions");

    const [loading, setLoading] = useState(false);
    const [active, setActiveDistribution] = useState<number>();
    const [distros, setDistros] = useState<ProcessedDistribution[]>([]);

    const breakdownListRef = useRef(null);

    const { campaign, loading: loadingCampaign } = useCampaign({
        chainId: chain,
        id: campaignId,
    });

    const bars = useMemo(() => {
        const existing: Record<string, boolean> = {};
        const bars: StackedBar[] = [];

        for (const dist of distros) {
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
    }, [distros]);

    const handleBarOnClick = useCallback(
        (value: BarPayload) => {
            if (!breakdownListRef.current) return;

            const index = distros.findIndex(
                ({ timestamp }) => timestamp === value.payload.timestamp,
            );

            setActiveDistribution(index < 0 ? undefined : index);
            (breakdownListRef.current as any).scrollToItem(index, "start");
        },
        [distros, breakdownListRef],
    );

    // Get the size of the variable size list item based on the number of
    // accounts in that particular distribution.
    const getAccountRowSize = useCallback(
        (index: number) => {
            if (distros.length === 0) return 0;
            let maxAccounts = 0;

            for (const [, weights] of Object.entries(distros[index].weights)) {
                if (Object.keys(weights).length > maxAccounts)
                    maxAccounts = Object.keys(weights).length;
            }

            return maxAccounts * ACCOUNT_ROW_SIZE + ACCOUNT_ROW_PADDINGS;
        },
        [distros],
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
                chain={chain}
                campaignId={campaignId}
                onLoading={setLoading}
                onFetched={setDistros}
            />
            <div className={styles.dataWrapper}>
                <div className={styles.section}>
                    <Typography size="lg" weight="medium" uppercase>
                        {t("distributionsOverview")}
                    </Typography>
                    <Card
                        className={classNames(styles.chartWrapper, {
                            [styles.loading]: loading,
                        })}
                    >
                        {loading ? (
                            Array.from({ length: 35 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={styles.loadingBar}
                                ></div>
                            ))
                        ) : distros.length > 0 ? (
                            <Chart
                                chain={chain}
                                distros={distros}
                                bars={bars}
                                onBarClick={handleBarOnClick}
                            />
                        ) : (
                            <div className={styles.empty}>
                                <NoDistributionsIcon />
                                <Typography uppercase weight="medium" size="sm">
                                    {t("empty")}
                                </Typography>
                            </div>
                        )}
                    </Card>
                </div>
                <div className={styles.section}>
                    <Typography size="lg" weight="medium" uppercase>
                        {t("distributionsBreakdown")}
                    </Typography>
                    <Card
                        className={classNames(styles.breakdownListWrapper, {
                            [styles.loading]: loading,
                        })}
                    >
                        {loading ? (
                            <BreakdownRowSkeleton />
                        ) : distros.length > 0 ? (
                            <AutoSizer>
                                {({ height, width }) => {
                                    return (
                                        <VariableSizeList
                                            ref={breakdownListRef}
                                            height={height}
                                            width={width}
                                            itemCount={distros.length}
                                            itemData={distros}
                                            itemSize={getAccountRowSize}
                                            className={styles.breakdownsList}
                                        >
                                            {({ index, style, data }) => {
                                                const previous:
                                                    | ProcessedDistribution
                                                    | undefined =
                                                    data[index - 1];
                                                const current: ProcessedDistribution =
                                                    data[index];

                                                return (
                                                    <BreakdownRow
                                                        style={style}
                                                        index={index}
                                                        active={
                                                            active === index
                                                        }
                                                        chainId={chain}
                                                        previousDistro={
                                                            previous
                                                        }
                                                        distro={current}
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
                        ) : (
                            <div className={styles.empty}>
                                <NoDistributionsIcon />
                                <Typography uppercase weight="medium" size="sm">
                                    {t("empty")}
                                </Typography>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
