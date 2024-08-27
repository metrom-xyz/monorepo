"use client";

import { Typography } from "@/src/ui/typography";
import { useCampaigns } from "@/src/hooks/useCampaigns";
import { Campaign, SkeletonCampaign } from "./campaign";

import { useTranslations } from "next-intl";
import { usePagination } from "@/src/hooks/usePagination";
import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import { TextInput } from "@/src/ui/text-input";
import { SearchIcon } from "@/src/assets/search-icon";
import { useDebounce } from "react-use";
import { filterCampaigns, sortCampaigns } from "@/src/utils/filtering";
import { Pagination } from "@/src/ui/pagination";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select, type SelectOption } from "@/src/ui/select";
import { Status } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

const PAGE_SIZE = 10;
const QUERY_PARAM_SEARCH = "search";
const QUERY_PARAM_STATUS = "status";

export enum FilterableStatus {
    None = "",
    Live = Status.Live,
    Upcoming = Status.Upcoming,
    Ended = Status.Ended,
}

export function Campaigns() {
    const t = useTranslations("allCampaigns");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get(QUERY_PARAM_SEARCH) || "",
    );
    const [status, setStatus] = useState<FilterableStatus | null>(null);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [pageNumber, setPageNumber] = useState(1);

    const statusOptions = useMemo(() => {
        return [
            {
                label: t("filters.status.none"),
                value: FilterableStatus.None,
            },
            {
                label: t("filters.status.live"),
                value: FilterableStatus.Live,
            },
            {
                label: t("filters.status.upcoming"),
                value: FilterableStatus.Upcoming,
            },
            {
                label: t("filters.status.ended"),
                value: FilterableStatus.Ended,
            },
        ];
    }, [t]);

    const { loading, campaigns } = useCampaigns();

    useDebounce(
        () => {
            setDebouncedSearch(search);
            const params = new URLSearchParams(searchParams.toString());
            if (search)
                if (params.has(QUERY_PARAM_SEARCH))
                    params.set(QUERY_PARAM_SEARCH, search);
                else params.append(QUERY_PARAM_SEARCH, search);
            else params.delete(QUERY_PARAM_SEARCH);
            router.push(`${pathname}?${params.toString()}`);
        },
        300,
        [search],
    );

    const filteredCampaigns = useMemo(
        () =>
            sortCampaigns(
                filterCampaigns(
                    campaigns,
                    status || FilterableStatus.None,
                    debouncedSearch,
                ),
            ),
        [campaigns, status, debouncedSearch],
    );

    const { data: pagedCampaigns, totalPages } = usePagination({
        data: filteredCampaigns,
        page: pageNumber,
        size: PAGE_SIZE,
    });

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    const handleStatusChange = useCallback(
        (status: SelectOption<FilterableStatus>) => {
            const params = new URLSearchParams(searchParams.toString());
            if (status.value !== FilterableStatus.None) {
                if (params.has(QUERY_PARAM_STATUS))
                    params.set(QUERY_PARAM_STATUS, status.value.toString());
                else params.append(QUERY_PARAM_STATUS, status.value.toString());
            } else {
                params.delete(QUERY_PARAM_STATUS);
            }
            router.push(`${pathname}?${params.toString()}`);
            setStatus(status.value);
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

    return (
        <div className={styles.root}>
            <div className={styles.filters}>
                <TextInput
                    className={styles.searchInput}
                    icon={SearchIcon}
                    iconPlacement="right"
                    placeholder={t("filters.search.placeholder")}
                    value={search}
                    onChange={handleSearchChange}
                />
                <Select
                    options={statusOptions}
                    value={status}
                    onChange={handleStatusChange}
                    placeholder="Status"
                    messages={{
                        noResults: "no",
                    }}
                    className={styles.statusSelect}
                />
            </div>
            <div className={styles.row}>
                <Typography variant="sm" light weight="medium">
                    {t("header.chain")}
                </Typography>
                <Typography variant="sm" light weight="medium">
                    {t("header.pool")}
                </Typography>
                <Typography variant="sm" light weight="medium">
                    {t("header.status")}
                </Typography>
                <Typography variant="sm" light weight="medium">
                    {t("header.apr")}
                </Typography>
                <Typography variant="sm" light weight="medium">
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
