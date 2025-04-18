"use client";

import {
    Typography,
    TextInput,
    Pagination,
    Select,
    Button,
    type SelectOption,
    Card,
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
} from "react";
import { SearchIcon } from "@/src/assets/search-icon";
import { useDebounce } from "react-use";
import { filterCampaigns, sortCampaigns } from "@/src/utils/filtering";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Link, useRouter as useLocalizedRouter } from "@/i18n/routing";
import { SupportedChain } from "@metrom-xyz/contracts";
import { useChains } from "wagmi";
import classNames from "classnames";
import { CHAIN_DATA } from "@/src/commons";
import { FilterableStatus } from "@/src/types/common";
import { ENVIRONMENT } from "@/src/commons/env";
import { LV2_POINTS_CAMPAIGNS } from "@/src/commons/lv2-points";

import styles from "./styles.module.css";

const PAGE_SIZE = 10;

const CHAIN_ALL = 0;

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
            {ChainIcon && (
                <div>
                    <ChainIcon className={styles.chainIcon} />
                </div>
            )}
            <Typography
                className={styles.chainSelectOptionText}
                weight="medium"
            >
                {option.label}
            </Typography>
        </div>
    );
};

export function Campaigns() {
    const t = useTranslations("allCampaigns");
    const chains = useChains();
    const router = useRouter();
    const localizedRouter = useLocalizedRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<FilterableStatus>(
        FilterableStatus.All,
    );
    const [chain, setChain] = useState(CHAIN_ALL);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [pageNumber, setPageNumber] = useState(1);

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
            filterCampaigns(campaigns || [], status, chain, debouncedSearch),
        );
    }, [campaigns, status, chain, debouncedSearch]);

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

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

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
            <div className={styles.lv2CampaignsWrapper}>
                {Object.entries(LV2_POINTS_CAMPAIGNS[ENVIRONMENT]).map(
                    ([protocol, lv2PointsCampaign], index) => {
                        if (lv2PointsCampaign)
                            return (
                                <Link
                                    key={index}
                                    href={`/campaigns/lv2-points/${protocol}`}
                                >
                                    <Card>
                                        <Typography>
                                            {lv2PointsCampaign.name}
                                        </Typography>
                                    </Card>
                                </Link>
                            );
                    },
                )}
            </div>
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
                        options={chainOptions}
                        value={chain}
                        onChange={handleChainChange}
                        label={t("filters.chain.label")}
                        messages={{
                            noResults: "",
                        }}
                        className={styles.filterInput}
                        renderOption={chainSelectRenderOption}
                    />
                </div>
            </div>
            <div className={styles.scrollContainer}>
                <div className={styles.tableWrapper}>
                    <div className={styles.table}>
                        <div className={styles.header}>
                            <Typography size="sm" weight="medium">
                                {t("header.chain")}
                            </Typography>
                            <Typography size="sm" weight="medium">
                                {t("header.protocol")}
                            </Typography>
                            <Typography size="sm" weight="medium">
                                {t("header.action")}
                            </Typography>
                            <Typography size="sm" weight="medium">
                                {t("header.status")}
                            </Typography>
                            <Typography size="sm" weight="medium">
                                {t("header.apr")}
                            </Typography>
                            <Typography size="sm" weight="medium">
                                {t("header.rewards")}
                            </Typography>
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
