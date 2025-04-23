"use client";

import {
    Typography,
    TextInput,
    Pagination,
    Select,
    Button,
    type SelectOption,
} from "@metrom-xyz/ui";
import { useCampaigns } from "@/src/hooks/useCampaigns";
import { CampaignRow, SkeletonCampaign } from "./campaign";
import { useTranslations } from "next-intl";
import { usePagination } from "@/src/hooks/usePagination";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type FunctionComponent,
} from "react";
import { SearchIcon } from "@/src/assets/search-icon";
import { useDebounce } from "react-use";
import {
    filterCampaigns,
    sortCampaigns,
    type CampaignSortOptions,
} from "@/src/utils/filtering";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useRouter as useLocalizedRouter } from "@/i18n/routing";
import { SupportedChain } from "@metrom-xyz/contracts";
import { useChains } from "wagmi";
import classNames from "classnames";
import { CHAIN_DATA } from "@/src/commons";
import { Lv2PointsCampaignBanner } from "./lv2-points-campaigns-banner";
import {
    FilterableStatus,
    type SVGIcon,
    type TranslationsKeys,
} from "@/src/types/common";
import { useSupportedProtocols } from "@/src/hooks/useSupportedProtocols";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

import styles from "./styles.module.css";

const PAGE_SIZE = 10;
const CHAIN_ALL = 0;
const TABLE_COLUMNS: {
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
        sort: true,
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
        name: "rewards",
        label: "rewards",
        sort: true,
    },
];

const statusSelectRenderOption = (option: {
    label: string;
    color?: string;
    value: FilterableStatus;
}) => {
    return (
        <div className={styles.customOptionContainer}>
            {option.value !== FilterableStatus.All && (
                <span className={classNames(styles.dot, option.color)} />
            )}
            <Typography weight="medium">{option.label}</Typography>
        </div>
    );
};

const chainSelectRenderOption = (option: { label: string; value: number }) => {
    const ChainIcon =
        option.value !== 0
            ? CHAIN_DATA[option.value as SupportedChain]?.icon
            : null;
    return (
        <div className={styles.customOptionContainer}>
            {ChainIcon && <ChainIcon className={styles.icon} />}
            <Typography className={styles.selectOptionText} weight="medium">
                {option.label}
            </Typography>
        </div>
    );
};

const protocolSelectRenderOption = (option: {
    label: string;
    icon?: FunctionComponent<SVGIcon>;
    value: string;
}) => {
    return (
        <div className={styles.customOptionContainer}>
            {option.icon && <option.icon className={styles.icon} />}
            <Typography className={styles.selectOptionText} weight="medium">
                {option.label}
            </Typography>
        </div>
    );
};

export function Campaigns() {
    const t = useTranslations("allCampaigns");
    const chains = useChains();
    const protocols = useSupportedProtocols();
    const router = useRouter();
    const localizedRouter = useLocalizedRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState("");
    const [protocol, setProtocol] = useState("");
    const [status, setStatus] = useState<FilterableStatus>(
        FilterableStatus.All,
    );
    const [sortField, setSortField] = useState<CampaignSortOptions>();
    const [order, setOrder] = useState<number | undefined>();
    const [chain, setChain] = useState(CHAIN_ALL);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [pageNumber, setPageNumber] = useState(1);

    const filtersActive = useMemo(
        () =>
            !!search ||
            !!protocol ||
            status !== FilterableStatus.All ||
            !!sortField ||
            !!order ||
            !!chain,
        [search, protocol, status, sortField, order, chain],
    );

    const statusOptions = useMemo(() => {
        return [
            {
                label: t("filters.status.all"),
                value: FilterableStatus.All,
            },
            {
                label: t("filters.status.live"),
                value: FilterableStatus.Live,
                color: "bg-green-500",
            },
            {
                label: t("filters.status.upcoming"),
                value: FilterableStatus.Upcoming,
                color: "bg-blue-500",
            },
            {
                label: t("filters.status.ended"),
                value: FilterableStatus.Ended,
                color: "bg-zinc-500",
            },
        ];
    }, [t]);

    const protocolOptions = useMemo(() => {
        const options: {
            label: string;
            icon?: FunctionComponent<SVGIcon>;
            value: string;
        }[] = [
            {
                label: t("filters.protocol.all"),
                value: "",
            },
        ];

        for (const protocol of protocols) {
            options.push({
                label: protocol.name,
                icon: protocol.logo,
                value: protocol.slug,
            });
        }
        return options;
    }, [protocols, t]);

    const chainOptions = useMemo(() => {
        const options: {
            label: string;
            value: number;
            query: string | null;
        }[] = [
            {
                label: t("filters.chain.all"),
                value: CHAIN_ALL,
                query: null,
            },
        ];
        for (const chain of chains) {
            const { name } = CHAIN_DATA[chain.id as SupportedChain];

            options.push({
                label: name,
                value: chain.id,
                query: name.toLowerCase().replaceAll(" ", "-"),
            });
        }
        return options;
    }, [chains, t]);

    const { loading, campaigns } = useCampaigns();

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        300,
        [search],
    );

    const filteredCampaigns = useMemo(() => {
        return sortCampaigns(
            filterCampaigns(
                campaigns || [],
                status,
                protocol,
                chain,
                debouncedSearch,
            ),
            sortField,
            order,
        );
    }, [campaigns, status, protocol, chain, debouncedSearch, sortField, order]);

    const { data: pagedCampaigns, totalPages } = usePagination({
        data: filteredCampaigns,
        page: pageNumber,
        size: PAGE_SIZE,
    });

    useEffect(() => {
        let updatedPageNumber = pageNumber;
        if (pageNumber > totalPages) {
            updatedPageNumber = totalPages || 1;
            setPageNumber(updatedPageNumber);
        }
    }, [pageNumber, pathname, router, totalPages]);

    useEffect(() => {
        const chain = searchParams.get("chain");
        if (chain) {
            const resolvedChain = chainOptions.find(
                (option) => option.query === chain,
            );

            const params = new URLSearchParams(searchParams.toString());
            if (resolvedChain?.query) {
                setChain(resolvedChain.value);
                params.set("chain", resolvedChain.query);
            } else {
                setChain(CHAIN_ALL);
                params.delete("chain");
            }
        }
    }, [searchParams, pathname, chainOptions]);

    // When sorting for APR or rewards we also filter for live campaigns,
    // since it doesn't make much sense so sort ended campaings with missing
    // APR and rewards.
    useEffect(() => {
        if (sortField === "apr" || sortField === "rewards")
            setStatus(FilterableStatus.Live);
    }, [sortField]);

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    const handleProtocolChange = useCallback(
        (protocol: SelectOption<string>) => {
            setProtocol(protocol.value);
        },
        [],
    );

    const handleStatusChange = useCallback(
        (status: SelectOption<FilterableStatus>) => {
            setStatus(status.value);
        },
        [],
    );

    const handleChainChange = useCallback(
        (chain: SelectOption<number> & { query: string | null }) => {
            setChain(chain.value);
            const params = new URLSearchParams(searchParams.toString());
            if (!chain.query) params.delete("chain");
            else params.set("chain", chain.query);
            router.replace(`${pathname}?${params.toString()}`);
        },
        [pathname, router, searchParams],
    );

    const getSortChangeHandler = useCallback(
        (column: CampaignSortOptions) => {
            return () => {
                setSortField(column);
                setOrder(column === sortField && order === 1 ? -1 : 1);
            };
        },
        [sortField, order],
    );

    const handleClearFilters = useCallback(() => {
        setSearch("");
        setProtocol("");
        setStatus(FilterableStatus.All);
        setChain(CHAIN_ALL);
        setSortField(undefined);
        setOrder(undefined);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("chain");
        router.replace(`${pathname}?${params.toString()}`);
    }, [pathname, searchParams, router]);

    function handlePreviousPage() {
        setPageNumber((page) => page - 1);
    }

    function handleNextPage() {
        setPageNumber((page) => page + 1);
    }

    function handlePage(page: number) {
        setPageNumber(page);
    }
    const handleCreateCampaign = useCallback(() => {
        localizedRouter.push("/campaigns/create");
    }, [localizedRouter]);

    return (
        <div className={styles.root}>
            <Lv2PointsCampaignBanner />
            <div className={styles.filters}>
                <TextInput
                    className={classNames(
                        styles.searchFilter,
                        styles.filterInput,
                    )}
                    icon={SearchIcon}
                    iconPlacement="right"
                    placeholder={t("filters.search.label")}
                    value={search}
                    onChange={handleSearchChange}
                />
                <div className={styles.selectionFilters}>
                    <Select
                        options={statusOptions}
                        value={status}
                        onChange={handleStatusChange}
                        label={t("filters.status.label")}
                        messages={{
                            noResults: "",
                        }}
                        className={styles.filterInput}
                        renderOption={statusSelectRenderOption}
                    />
                    <Select
                        options={protocolOptions}
                        value={protocol}
                        search
                        onChange={handleProtocolChange}
                        label={t("filters.protocol.label")}
                        messages={{
                            noResults: "",
                        }}
                        className={styles.filterInput}
                        renderOption={protocolSelectRenderOption}
                    />
                    <Select
                        options={chainOptions}
                        value={chain}
                        search
                        onChange={handleChainChange}
                        label={t("filters.chain.label")}
                        messages={{
                            noResults: "",
                        }}
                        className={styles.filterInput}
                        renderOption={chainSelectRenderOption}
                    />
                </div>
                <Button
                    variant="secondary"
                    size="xs"
                    border={false}
                    onClick={handleClearFilters}
                    className={{
                        root: classNames(styles.clearButton, {
                            [styles.visible]: filtersActive,
                        }),
                    }}
                >
                    {t("filters.clear")}
                </Button>
            </div>
            <div className={styles.scrollContainer}>
                <div className={styles.tableWrapper}>
                    <div className={styles.table}>
                        <div className={styles.header}>
                            {TABLE_COLUMNS.map(
                                ({ name, label, sort }, index) => (
                                    <div
                                        key={index}
                                        onClick={
                                            sort
                                                ? getSortChangeHandler(
                                                      name as any,
                                                  )
                                                : undefined
                                        }
                                        className={classNames(styles.column, {
                                            [styles.sort]: sort,
                                        })}
                                    >
                                        <Typography size="sm" weight="medium">
                                            {t(`header.${label}`)}
                                        </Typography>
                                        {sort && (
                                            <ArrowRightIcon
                                                className={classNames(
                                                    styles.sortIcon,
                                                    {
                                                        [styles.asc]:
                                                            sortField ===
                                                                name &&
                                                            order === 1,
                                                    },
                                                )}
                                            />
                                        )}
                                    </div>
                                ),
                            )}
                        </div>
                        <div className={styles.body}>
                            {loading ? (
                                <>
                                    <SkeletonCampaign />
                                    <SkeletonCampaign />
                                    <SkeletonCampaign />
                                    <SkeletonCampaign />
                                    <SkeletonCampaign />
                                    <SkeletonCampaign />
                                    <SkeletonCampaign />
                                    <SkeletonCampaign />
                                    <SkeletonCampaign />
                                    <SkeletonCampaign />
                                </>
                            ) : pagedCampaigns.length === 0 ? (
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
                                pagedCampaigns.map((campaign) => {
                                    return (
                                        <CampaignRow
                                            key={campaign.id}
                                            campaign={campaign}
                                        />
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.paginationWrapper}>
                <Pagination
                    page={pageNumber}
                    totalPages={totalPages}
                    onNext={handleNextPage}
                    onPrevious={handlePreviousPage}
                    onPage={handlePage}
                />
            </div>
        </div>
    );
}
