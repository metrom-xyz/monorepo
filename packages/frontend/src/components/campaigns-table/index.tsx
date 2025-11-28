import { Pagination, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type CampaignSortOptions } from "@/src/utils/filtering";
import type { TranslationsKeys } from "@/src/types/utils";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { CampaignRow, SkeletonCampaign } from "../campaigns/campaign";
import { Filters, type FilterParams, type RawFilters } from "./filters";
import { useCampaigns } from "@/src/hooks/useCampaigns";
import { APTOS } from "@/src/commons/env";
import { BackendCampaignType, ChainType } from "@metrom-xyz/sdk";
import { LoadingBar } from "../loading-bar";
import { useDebounce, usePrevious } from "react-use";
import { EmptyTable } from "./empty-table";
import {
    useCampaignsFiltersOptions,
    type ChainFilterOption,
} from "@/src/hooks/useCampaignsFiltersOptions";
import { URL_ENABLED_CAMPAIGNS_FILTERS } from "../campaigns";

import styles from "./styles.module.css";

const PAGE_SIZE = 15;

const TABLE_REWARDS_COLUMNS: {
    name: string;
    label: TranslationsKeys<"allCampaigns.header">;
    sort: boolean;
}[] = [
    {
        name: "chain",
        label: "chain",
        sort: false,
    },
    {
        name: "protocol",
        label: "protocol",
        sort: false,
    },
    {
        name: "action",
        label: "action",
        sort: false,
    },
    {
        name: "status",
        label: "status",
        sort: false,
    },
    {
        name: "apr",
        label: "apr",
        sort: true,
    },
    {
        name: "tvl",
        label: "tvl",
        sort: false,
    },
    {
        name: "rewards",
        label: "rewards",
        sort: false,
    },
];

const TABLE_POINTS_COLUMNS: {
    name: string;
    label: TranslationsKeys<"allCampaigns.header">;
    sort: boolean;
}[] = [
    {
        name: "chain",
        label: "chain",
        sort: false,
    },
    {
        name: "protocol",
        label: "protocol",
        sort: false,
    },
    {
        name: "action",
        label: "action",
        sort: false,
    },
    {
        name: "status",
        label: "status",
        sort: false,
    },
    {
        name: "tvl",
        label: "tvl",
        sort: false,
    },
    {
        name: "dailyPer1k",
        label: "dailyPer1k",
        sort: false,
    },
];

interface CampaignsTableProps {
    type: BackendCampaignType;
    disableFilters?: boolean;
    optionalFilters?: Partial<RawFilters>;
    className?: string;
    onClearFilters?: () => void;
}

export function CampaignsTable({
    type,
    disableFilters,
    optionalFilters,
    className,
    onClearFilters,
}: CampaignsTableProps) {
    const t = useTranslations("allCampaigns");
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const filterOptions = useCampaignsFiltersOptions();
    const prevType = usePrevious(type);

    const [sortField, setSortField] = useState<CampaignSortOptions>();
    const [order, setOrder] = useState<number | undefined>();
    const [pageNumber, setPageNumber] = useState(1);

    const initialFilters = useMemo(() => {
        const queryFilters: Record<string, string> = {};
        URL_ENABLED_CAMPAIGNS_FILTERS.forEach((filter) => {
            const value = searchParams.get(filter);
            if (!value) return;
            queryFilters[filter] = value;
        });

        const filters: RawFilters = {
            chains: [],
            protocols: [],
            statuses: [],
            ...optionalFilters,
        };

        Object.entries(queryFilters).forEach(([key, value]) => {
            if (key === "statuses")
                filters.statuses = filterOptions.statusOptions.filter(
                    (option) => value.split(",").includes(option.value),
                );
            if (key === "protocols")
                filters.protocols = filterOptions.protocolOptions.filter(
                    (option) => value.split(",").includes(option.value),
                );
            if (key === "chains")
                filters.chains = filterOptions.chainOptions.filter((option) =>
                    value.split(",").includes(option.query),
                );
        });

        return filters;
    }, [
        searchParams,
        filterOptions.chainOptions,
        filterOptions.protocolOptions,
        filterOptions.statusOptions,
        optionalFilters,
    ]);

    const handleClearFilters = useCallback(() => {
        if (optionalFilters && disableFilters) return;

        setRawFilters({
            chains: [],
            protocols: [],
            statuses: [],
        });
        setDebouncedRawFilters({
            chains: [],
            protocols: [],
            statuses: [],
        });
        setPageNumber(1);
        setSortField(undefined);
        setOrder(undefined);

        if (onClearFilters) onClearFilters();
    }, [disableFilters, optionalFilters, onClearFilters]);

    const [rawFilters, setRawFilters] = useState<RawFilters>(initialFilters);
    const [debouncedRawFilters, setDebouncedRawFilters] =
        useState<RawFilters>(initialFilters);

    useEffect(() => {
        // Avoid clearing the filters the first time, otherwise the query params
        // get removed.
        if ((!prevType && type) || prevType === type) return;
        handleClearFilters();
    }, [handleClearFilters, prevType, type]);

    useDebounce(
        () => {
            setDebouncedRawFilters(rawFilters);
        },
        300,
        [rawFilters],
    );

    const { chainTypes, chainIds, protocols, statuses }: FilterParams =
        useMemo(() => {
            const { statuses, protocols, chains } = debouncedRawFilters;

            const chainTypes: ChainType[] = [];
            const chainIds: string[] = [];
            chains.forEach((chain) => {
                const [chainType, chainId] = chain.value.split("_");
                if (!chainTypes.includes(chainType as ChainType))
                    chainTypes.push(chainType as ChainType);
                if (!chainIds.includes(chainId)) chainIds.push(chainId);
            });

            return {
                chainIds: chainIds.map(Number),
                protocols: protocols.map(({ value }) => value),
                statuses: statuses.map(({ value }) => value),
                chainTypes: APTOS
                    ? [ChainType.Aptos]
                    : chainTypes
                      ? chainTypes
                      : undefined,
            };
        }, [debouncedRawFilters]);

    const { loading, fetching, placeholderData, campaigns, totalCampaigns } =
        useCampaigns({
            page: pageNumber,
            pageSize: PAGE_SIZE,
            type,
            chainTypes,
            chainIds,
            protocols,
            statuses,
            orderBy: sortField,
            asc: order === 1 ? true : order === -1 ? false : undefined,
        });

    const getSortChangeHandler = useCallback(
        (column: CampaignSortOptions) => {
            return () => {
                if (placeholderData && fetching) return;
                setSortField(column);
                setOrder(column === sortField && order === 1 ? -1 : 1);
            };
        },
        [placeholderData, fetching, sortField, order],
    );

    function handlePreviousPage() {
        setPageNumber((page) => page - 1);
    }

    function handleNextPage() {
        setPageNumber((page) => page + 1);
    }

    function handlePage(page: number) {
        setPageNumber(page);
    }

    function handleFiltersOnChange(filters: Partial<RawFilters>) {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(filters).forEach(([key, value]) => {
            if (URL_ENABLED_CAMPAIGNS_FILTERS.includes(key)) {
                if (value.length === 0) params.delete(key);
                else if ("query" in value[0])
                    params.set(
                        key,
                        (value as ChainFilterOption[])
                            .map((chain) => chain.query)
                            .join(","),
                    );
                else params.set(key, value.map(({ value }) => value).join(","));
            }
        });

        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });

        setPageNumber(1);
        setRawFilters((prev) => ({ ...prev, ...filters }));
    }

    const columns =
        type === BackendCampaignType.Rewards
            ? TABLE_REWARDS_COLUMNS
            : TABLE_POINTS_COLUMNS;

    return (
        <div
            className={classNames(styles.root, className, {
                [styles.topLeftSquared]: type === BackendCampaignType.Rewards,
            })}
        >
            <div className={styles.tableWrapper}>
                {!disableFilters && (
                    <Filters
                        {...filterOptions}
                        sortField={sortField}
                        order={order}
                        filters={rawFilters}
                        totalCampaigns={totalCampaigns}
                        loading={loading}
                        onClearFilters={handleClearFilters}
                        onFiltersChange={handleFiltersOnChange}
                    />
                )}
                <div
                    className={classNames(styles.table, {
                        [styles[type]]: true,
                    })}
                >
                    <div className={styles.header}>
                        {columns.map(({ name, label, sort }, index) => (
                            <div
                                key={index}
                                onClick={
                                    sort
                                        ? getSortChangeHandler(
                                              name as CampaignSortOptions,
                                          )
                                        : undefined
                                }
                                className={classNames(styles.column, {
                                    [styles.disabled]:
                                        placeholderData && fetching,
                                    [styles.sort]: sort,
                                })}
                            >
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    variant="tertiary"
                                    uppercase
                                >
                                    {t(`header.${label}`)}
                                </Typography>
                                {sort && (
                                    <ArrowRightIcon
                                        className={classNames(styles.sortIcon, {
                                            [styles.asc]:
                                                sortField === name &&
                                                order === 1,
                                        })}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={styles.body}>
                        <LoadingBar
                            loading={placeholderData && fetching}
                            className={styles.loadingBar}
                        />
                        {loading ? (
                            <>
                                <SkeletonCampaign type={type} />
                                <SkeletonCampaign type={type} />
                                <SkeletonCampaign type={type} />
                                <SkeletonCampaign type={type} />
                                <SkeletonCampaign type={type} />
                                <SkeletonCampaign type={type} />
                                <SkeletonCampaign type={type} />
                                <SkeletonCampaign type={type} />
                                <SkeletonCampaign type={type} />
                                <SkeletonCampaign type={type} />
                            </>
                        ) : !campaigns || campaigns.length === 0 ? (
                            <EmptyTable />
                        ) : (
                            campaigns?.map((campaign) => {
                                return (
                                    <CampaignRow
                                        key={`${campaign.chainType}-${campaign.chainId}-${campaign.id}`}
                                        type={type}
                                        campaign={campaign}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.paginationWrapper}>
                <Pagination
                    page={pageNumber}
                    loading={loading || (placeholderData && fetching)}
                    totalPages={Math.ceil(totalCampaigns / PAGE_SIZE)}
                    messages={{
                        previous: t("pagination.prev"),
                        next: t("pagination.next"),
                    }}
                    onNext={handleNextPage}
                    onPrevious={handlePreviousPage}
                    onPage={handlePage}
                />
            </div>
        </div>
    );
}
