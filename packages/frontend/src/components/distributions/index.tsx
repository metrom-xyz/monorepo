"use client";

import {
    Card,
    ErrorText,
    InfoTooltip,
    Tab,
    Tabs,
    TextInput,
    Typography,
} from "@metrom-xyz/ui";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
} from "react";
import { type Address, type Hex } from "viem";
import { useTranslations } from "next-intl";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useCampaign } from "@/src/hooks/useCampaign";
import { Header, SkeletonHeader } from "../campaign-details/header";
import { Filters } from "./filters";
import classNames from "classnames";
import type {
    DistributedErc20Token,
    ProcessedDistribution,
    UsdAccountWeights,
    Weight,
} from "@/src/types/distributions";
import { Chart, type BarPayload } from "./chart";
import {
    type ChainType,
    type UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { formatDateTime } from "@/src/utils/format";
import { BreakdownRow, BreakdownRowSkeleton } from "./breakdown-row";
import { List } from "react-window";
import { SearchIcon } from "@/src/assets/search-icon";
import dayjs from "dayjs";
import { BoldText } from "../bold-text";
import { EmptyState } from "../empty-state";
import { CalendarSearchIcon } from "@/src/assets/calendar-search-icon";
import { getColorFromAddress } from "@/src/utils/address";
import { SearchOffIcon } from "@/src/assets/search-off-icon";
import { Insights, InsightsSkeleton } from "./insights";
import { InfoMessage } from "../info-message";

import styles from "./styles.module.css";

interface DistributionsProps {
    chain: SupportedChain;
    chainType: ChainType;
    campaignId: Hex;
}

export type DistributionChartData = ProcessedDistribution;

export interface StackedBar {
    dataKey: string;
    color: string;
    account: string;
    tokenAddress: string;
    weight: Weight;
}

export interface ActiveDistributionWeights {
    account: string;
    rank: number;
    tokens: Record<string, DistributedErc20Token>;
    usdSummary: UsdAccountWeights;
    tokensSummary: Record<string, UsdPricedErc20TokenAmount>;
    weights: Record<string, Weight>;
}

const TAB_WIDTH = 172;
const TOP_ACCOUNTS_COUNT = 10;

export function Distributions({
    chain,
    chainType,
    campaignId,
}: DistributionsProps) {
    const t = useTranslations("campaignDistributions");

    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>();
    const [activeAccount, setActiveAccount] = useState<string>();
    const [distros, setDistros] = useState<ProcessedDistribution[]>([]);
    const [addressFilter, setAddressFilter] = useState<string>("");

    const timestampTabsRef = useRef<HTMLDivElement | null>(null);

    const { campaign, loading: loadingCampaign } = useCampaign({
        chainId: chain,
        chainType,
        id: campaignId,
    });

    useEffect(() => {
        if (distros.length === 0) return;
        setActiveIndex(0);
        setActiveAccount(undefined);
    }, [distros]);

    useEffect(() => {
        if (activeIndex === undefined || !timestampTabsRef.current) return;

        const scrollPosition = activeIndex * TAB_WIDTH;
        timestampTabsRef.current.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
        });
    }, [activeIndex, timestampTabsRef]);

    const topDistros = useMemo(() => {
        const topDistros: ProcessedDistribution[] = [];

        distros.forEach((distro) => {
            const sortedFlatWeights = Object.entries(distro.weights)
                .map(([account, weights]) => {
                    // we use the weight of the first token, since the % it's same for each token rewarded
                    const firstTokenAddress = Object.keys(weights)[0];
                    return { account, ...weights[firstTokenAddress] };
                })
                .sort(
                    (a, b) => b.percentage.formatted - a.percentage.formatted,
                );

            const relevantWeights: Record<string, Record<string, Weight>> = {};
            sortedFlatWeights.map((flatWeight, index) => {
                if (index < TOP_ACCOUNTS_COUNT)
                    relevantWeights[flatWeight.account] =
                        distro.weights[flatWeight.account];
            });

            topDistros.push({ ...distro, weights: relevantWeights });
        });

        return topDistros;
    }, [distros]);

    const bars = useMemo(() => {
        const existing: Record<string, boolean> = {};
        const bars: StackedBar[] = [];

        for (const distro of topDistros) {
            for (const [account, weights] of Object.entries(distro.weights)) {
                for (const [tokenAddress, weight] of Object.entries(weights)) {
                    const key = `${account}.${tokenAddress}`;
                    if (existing[key]) continue;

                    bars.push({
                        dataKey: `weights.${account}.${tokenAddress}.percentage.formatted`,
                        color: getColorFromAddress(account as Address),
                        account,
                        tokenAddress,
                        weight,
                    });
                    existing[key] = true;
                }
            }
        }
        return bars.sort((a, b) => a.account.localeCompare(b.account));
    }, [topDistros]);

    const activeDistroWeights: ActiveDistributionWeights[] = useMemo(() => {
        if (
            distros.length === 0 ||
            activeIndex === undefined ||
            !distros[activeIndex]
        )
            return [];

        return Object.entries(distros[activeIndex].weights)
            .map(([account, weights]) => {
                return {
                    account,
                    tokens: distros[activeIndex].tokens,
                    usdSummary: distros[activeIndex].usdSummary[account],
                    tokensSummary: distros[activeIndex].tokensSummary[account],
                    weights,
                };
            })
            .sort((a, b) => b.usdSummary.percentage - a.usdSummary.percentage)
            .map((distroWeights, index) => ({
                ...distroWeights,
                rank: index,
            }))
            .filter(({ account }) => {
                if (addressFilter)
                    return (
                        account === addressFilter ||
                        account.includes(addressFilter)
                    );
                return true;
            });
    }, [activeIndex, distros, addressFilter]);

    const notFirstDistro = useMemo(() => {
        if (
            !campaign?.from ||
            activeIndex === undefined ||
            distros.length < 2 ||
            !distros[activeIndex]
        )
            return false;

        const distroTimeHours = dayjs
            .unix(distros[1].timestamp)
            .diff(dayjs.unix(distros[0].timestamp), "hours");

        return (
            dayjs
                .unix(distros[activeIndex].timestamp)
                .diff(dayjs.unix(campaign.from), "hours") > distroTimeHours &&
            activeIndex === 0
        );
    }, [campaign?.from, activeIndex, distros]);

    // there are cases where distributions are skipped
    const aggregatedDistros = useMemo(() => {
        if (
            activeIndex === undefined ||
            distros.length < 2 ||
            !distros[activeIndex]
        )
            return 0;
        if (!distros[activeIndex - 1]) return 0;

        const distroTimeHours = dayjs
            .unix(distros[1].timestamp)
            .diff(dayjs.unix(distros[0].timestamp), "hours");

        if (distroTimeHours === 0) return 0;

        const aggregatedDistros =
            dayjs
                .unix(distros[activeIndex].timestamp)
                .diff(dayjs.unix(distros[activeIndex - 1].timestamp), "hours") /
            distroTimeHours;

        return Math.floor(aggregatedDistros);
    }, [activeIndex, distros]);

    const breakdownListRowProps = useMemo(
        () => ({
            activeAccount,
            activeDistroWeights,
            chainId: chain,
            chainType,
        }),
        [activeAccount, activeDistroWeights, chain, chainType],
    );

    const handleBarOnClick = useCallback(
        (value: BarPayload) => {
            if (!timestampTabsRef.current) return;

            const index = distros.findIndex(
                ({ timestamp }) => timestamp === value.timestamp,
            );

            if (index < 0) return;

            setActiveIndex(index);
            setActiveAccount(value.account);
        },
        [distros],
    );

    function handleAddressFilterOnChange(event: ChangeEvent<HTMLInputElement>) {
        const address = event.target.value;
        setAddressFilter(address);
    }

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                {loadingCampaign || !campaign ? (
                    <SkeletonHeader />
                ) : (
                    <Header campaign={campaign} />
                )}
            </div>
            {loadingCampaign || !campaign ? (
                <InsightsSkeleton />
            ) : (
                <Insights campaign={campaign} />
            )}
            <Filters
                campaign={campaign}
                loading={loadingCampaign || !campaign}
                onLoading={setLoading}
                onFetched={setDistros}
            />
            <div className={styles.dataWrapper}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <Typography weight="medium" uppercase>
                            {t("distributionsOverview")}
                        </Typography>
                        <InfoTooltip>
                            <InfoMessage
                                size="sm"
                                weight="regular"
                                spaced
                                text={t.rich("distributionsOverviewInfoText", {
                                    count: TOP_ACCOUNTS_COUNT,
                                    bold: (chunks) => (
                                        <BoldText>{chunks}</BoldText>
                                    ),
                                })}
                            />
                        </InfoTooltip>
                    </div>
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
                                distros={topDistros}
                                bars={bars}
                                onBarClick={handleBarOnClick}
                            />
                        ) : (
                            <EmptyState
                                icon={CalendarSearchIcon}
                                title={t("emptyDefault.title")}
                                subtitle={t("emptyDefault.subtitle")}
                            />
                        )}
                    </Card>
                </div>
                <div className={styles.section}>
                    <div className={styles.distributionsBreakdownHeader}>
                        <div className={styles.sectionHeader}>
                            <Typography weight="medium" uppercase>
                                {t("distributionsBreakdown")}
                            </Typography>
                            <InfoTooltip>
                                <InfoMessage
                                    size="sm"
                                    weight="regular"
                                    spaced
                                    text={t.rich(
                                        "distributionsBreakdownInfoText",
                                        {
                                            bold: (chunks) => (
                                                <BoldText>{chunks}</BoldText>
                                            ),
                                        },
                                    )}
                                />
                            </InfoTooltip>
                        </div>
                        <TextInput
                            icon={SearchIcon}
                            placeholder={t("filterAddress")}
                            value={addressFilter}
                            disabled={distros.length === 0}
                            onChange={handleAddressFilterOnChange}
                            className={styles.searchAddressInput}
                        />
                    </div>
                    <div>
                        <div
                            ref={timestampTabsRef}
                            className={styles.timestampBars}
                        >
                            <Tabs value={activeIndex} onChange={setActiveIndex}>
                                {distros.map(({ timestamp }, index) => (
                                    <Tab
                                        key={timestamp}
                                        value={index}
                                        className={styles.timestampBar}
                                    >
                                        <Typography
                                            size="sm"
                                            weight="medium"
                                            uppercase
                                        >
                                            {formatDateTime(timestamp)}
                                        </Typography>
                                    </Tab>
                                ))}
                            </Tabs>
                        </div>
                        <Card
                            className={classNames(styles.breakdownListWrapper, {
                                [styles.loading]: loading,
                                [styles.noBorderRadius]: distros.length > 0,
                            })}
                        >
                            {notFirstDistro && (
                                <div className={styles.warningMessage}>
                                    <ErrorText size="xs" level="warning">
                                        {t(
                                            "warningMessages.notFirstDistribution",
                                            {
                                                from: formatDateTime(
                                                    campaign?.from,
                                                ),
                                            },
                                        )}
                                    </ErrorText>
                                </div>
                            )}
                            {aggregatedDistros > 1 && (
                                <div className={styles.warningMessage}>
                                    <ErrorText size="xs" level="warning">
                                        {t(
                                            "warningMessages.multiDistribution",
                                            { amount: aggregatedDistros },
                                        )}
                                    </ErrorText>
                                </div>
                            )}
                            <div className={styles.breakdownListHeader}>
                                <Typography
                                    weight="medium"
                                    variant="tertiary"
                                    size="sm"
                                    uppercase
                                >
                                    {t("rank")}
                                </Typography>
                                <Typography
                                    weight="medium"
                                    variant="tertiary"
                                    size="sm"
                                    uppercase
                                >
                                    {t("weight")}
                                </Typography>
                                <Typography
                                    weight="medium"
                                    variant="tertiary"
                                    size="sm"
                                    uppercase
                                >
                                    {t("account")}
                                </Typography>
                                <Typography
                                    weight="medium"
                                    variant="tertiary"
                                    size="sm"
                                    uppercase
                                >
                                    {t("inThisDistro")}
                                </Typography>
                                <Typography
                                    weight="medium"
                                    variant="tertiary"
                                    size="sm"
                                    uppercase
                                >
                                    {t("total")}
                                </Typography>
                            </div>
                            {loading ? (
                                Array.from({ length: 8 }).map((_, index) => (
                                    <BreakdownRowSkeleton key={index} />
                                ))
                            ) : Object.keys(activeDistroWeights).length > 0 ? (
                                <List
                                    rowCount={activeDistroWeights.length}
                                    rowHeight={70}
                                    rowProps={breakdownListRowProps}
                                    rowComponent={BreakdownRow}
                                    className={styles.breakdownList}
                                />
                            ) : (
                                <div className={styles.empty}>
                                    {distros.length > 0 &&
                                    Object.keys(activeDistroWeights).length ===
                                        0 ? (
                                        <EmptyState
                                            icon={SearchOffIcon}
                                            title={t("emptyFilteredList.title")}
                                            subtitle={t(
                                                "emptyFilteredList.subtitle",
                                            )}
                                        />
                                    ) : (
                                        <EmptyState
                                            icon={CalendarSearchIcon}
                                            title={t("emptyDefault.title")}
                                            subtitle={t(
                                                "emptyDefault.subtitle",
                                            )}
                                        />
                                    )}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
