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
import { Campaign, SkeletonCampaign } from "./campaign";
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
import { useRouter, usePathname } from "next/navigation";
import { useRouter as useLocalizedRouter } from "@/i18n/routing";
import { SupportedChain } from "@metrom-xyz/contracts";
import { Status } from "@metrom-xyz/sdk";
import { useChains } from "wagmi";
import classNames from "classnames";
import { CHAIN_DATA } from "@/src/commons";

import styles from "./styles.module.css";

const PAGE_SIZE = 10;

export const CHAIN_ALL = 0;

export enum FilterableStatus {
    All = "",
    Live = Status.Live,
    Upcoming = Status.Upcoming,
    Ended = Status.Ended,
}

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
        const options = [
            {
                label: t("filters.chain.all"),
                value: CHAIN_ALL,
            },
        ];
        for (const chain of chains) {
            const { name } = CHAIN_DATA[chain.id as SupportedChain];

            options.push({
                label: name,
                value: chain.id,
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

    const filteredCampaigns = useMemo(
        () =>
            sortCampaigns(
                filterCampaigns(
                    campaigns || [],
                    status || FilterableStatus.All,
                    chain,
                    debouncedSearch,
                ),
            ),
        [campaigns, status, chain, debouncedSearch],
    );

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

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    const handleStatusChange = useCallback(
        (status: SelectOption<FilterableStatus>) => {
            setStatus(status.value);
        },
        [],
    );

    const handleChainChange = useCallback((chain: SelectOption<number>) => {
        setChain(chain.value);
    }, []);

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
        <div className={`${styles.root} dark`}>
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
            <div className={classNames(styles.row, styles.header)}>
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
                        <Button size="sm" onClick={handleCreateCampaign}>
                            {t("empty.create")}
                        </Button>
                    </div>
                ) : (
                    pagedCampaigns.map((campaign) => {
                        return (
                            <Campaign key={campaign.id} campaign={campaign} />
                        );
                    })
                )}
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
