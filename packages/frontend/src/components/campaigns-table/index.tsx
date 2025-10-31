import { Button, Pagination, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type CampaignSortOptions } from "@/src/utils/filtering";
import type { TranslationsKeys } from "@/src/types/utils";
import { useTranslations } from "next-intl";
import { useRouter as useLocalizedRouter } from "@/i18n/routing";
import { CampaignRow, SkeletonCampaign } from "../campaigns/campaign";
import { Filters, type FilterParams, type RawFilters } from "./filters";
import { useCampaigns } from "@/src/hooks/useCampaigns";
import { APTOS } from "@/src/commons/env";
import { BackendCampaignType, ChainType } from "@metrom-xyz/sdk";
import { LoadingBar } from "../loading-bar";
import { useDebounce } from "react-use";

import styles from "./styles.module.css";

const PAGE_SIZE = 10;
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
    onCountChange?: (count: number) => void;
    onLoadingChange?: (fetching: boolean) => void;
}

export function CampaignsTable({
    type,
    disableFilters,
    optionalFilters,
    onCountChange,
    onLoadingChange,
}: CampaignsTableProps) {
    const t = useTranslations("allCampaigns");
    const localizedRouter = useLocalizedRouter();

    const [sortField, setSortField] = useState<CampaignSortOptions>();
    const [order, setOrder] = useState<number | undefined>();
    const [pageNumber, setPageNumber] = useState(1);
    const [rawFilters, setRawFilters] = useState<RawFilters>({
        chains: [],
        protocols: [],
        statuses: [],
        ...optionalFilters,
    });
    const [debouncedRawFilters, setDebouncedRawFilters] = useState<RawFilters>({
        chains: [],
        protocols: [],
        statuses: [],
        ...optionalFilters,
    });

    useEffect(() => {
        setPageNumber(1);
        setRawFilters({
            chains: [],
            protocols: [],
            statuses: [],
        });
        setPageNumber(1);
        setSortField(undefined);
        setOrder(undefined);
    }, [type]);

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

    useEffect(() => {
        if (!onLoadingChange) return;
        onLoadingChange(loading);
    }, [loading, onLoadingChange]);

    useEffect(() => {
        if (!onCountChange) return;
        onCountChange(totalCampaigns);
    }, [totalCampaigns, onCountChange]);

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

    function handleClearFilters() {
        setRawFilters({
            chains: [],
            protocols: [],
            statuses: [],
        });
        setPageNumber(1);
        setSortField(undefined);
        setOrder(undefined);
    }

    function handleFiltersOnChange(filters: Partial<RawFilters>) {
        setPageNumber(1);
        setRawFilters((prev) => ({ ...prev, ...filters }));
    }

    const handleCreateCampaign = useCallback(() => {
        localizedRouter.push("/campaigns/create");
    }, [localizedRouter]);

    const columns =
        type === BackendCampaignType.Rewards
            ? TABLE_REWARDS_COLUMNS
            : TABLE_POINTS_COLUMNS;

    return (
        <div
            className={classNames(styles.root, {
                [styles.topLeftSquared]: type === BackendCampaignType.Rewards,
            })}
        >
            {!disableFilters && (
                <Filters
                    sortField={sortField}
                    order={order}
                    filters={rawFilters}
                    onClearFilters={handleClearFilters}
                    onFiltersChange={handleFiltersOnChange}
                />
            )}
            <div className={styles.tableWrapper}>
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
                            <div className={styles.empty}>
                                <Typography uppercase weight="medium">
                                    {t("empty.title")}
                                </Typography>
                                <Typography size="lg" weight="medium">
                                    {t("empty.description")}
                                </Typography>
                                <Button
                                    size="sm"
                                    onClick={handleCreateCampaign}
                                >
                                    {t("empty.create")}
                                </Button>
                            </div>
                        ) : (
                            campaigns?.map((campaign) => {
                                return (
                                    <CampaignRow
                                        key={campaign.id}
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
                    onNext={handleNextPage}
                    onPrevious={handlePreviousPage}
                    onPage={handlePage}
                />
            </div>
        </div>
    );
}
