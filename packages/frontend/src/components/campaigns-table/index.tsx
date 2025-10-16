import { Button, Pagination, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    filterCampaigns,
    sortCampaigns,
    type CampaignSortOptions,
} from "@/src/utils/filtering";
import type { TranslationsKeys } from "@/src/types/utils";
import { useTranslations } from "next-intl";
import { usePagination } from "@/src/hooks/usePagination";
import { useRouter as useLocalizedRouter } from "@/i18n/routing";
import { CampaignRow, SkeletonCampaign } from "../campaigns/campaign";
import { CHAIN_ALL, Filters } from "./filters";
import { FilterableStatus } from "@/src/types/common";
import { useCampaigns } from "@/src/hooks/useCampaigns";
import { APTOS } from "@/src/commons/env";
import { ChainType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

const PAGE_SIZE = 10;
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

interface CampaignsTableProps {
    disableFilters?: boolean;
}

export function CampaignsTable({ disableFilters }: CampaignsTableProps) {
    const t = useTranslations("allCampaigns");
    const localizedRouter = useLocalizedRouter();

    const [sortField, setSortField] = useState<CampaignSortOptions>();
    const [order, setOrder] = useState<number | undefined>();
    const [pageNumber, setPageNumber] = useState(1);
    const [filters, setFilters] = useState<Filters>({
        chain: CHAIN_ALL,
        protocol: "",
        search: "",
        status: FilterableStatus.All,
    });

    const { loading, campaigns, totalCampaigns } = useCampaigns({
        page: pageNumber,
        pageSize: PAGE_SIZE,
        chainType: APTOS ? ChainType.Aptos : undefined,
    });

    // const filteredCampaigns = useMemo(() => {
    //     return sortCampaigns(
    //         filterCampaigns(
    //             campaigns || [],
    //             filters.status,
    //             filters.protocol,
    //             filters.chain,
    //             filters.search,
    //         ),
    //         sortField,
    //         order,
    //     );
    // }, [campaigns, filters, sortField, order]);

    // const { data: pagedCampaigns, totalPages } = usePagination({
    //     data: filteredCampaigns,
    //     page: pageNumber,
    //     size: PAGE_SIZE,
    // });

    // useEffect(() => {
    //     let updatedPageNumber = pageNumber;
    //     if (pageNumber > totalPages) {
    //         updatedPageNumber = totalPages || 1;
    //         setPageNumber(updatedPageNumber);
    //     }
    // }, [pageNumber, totalPages]);

    const getSortChangeHandler = useCallback(
        (column: CampaignSortOptions) => {
            return () => {
                setSortField(column);
                setOrder(column === sortField && order === 1 ? -1 : 1);
            };
        },
        [sortField, order],
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
        setFilters({
            chain: CHAIN_ALL,
            protocol: "",
            search: "",
            status: FilterableStatus.All,
        });
        setSortField(undefined);
        setOrder(undefined);
    }

    const handleCreateCampaign = useCallback(() => {
        localizedRouter.push("/campaigns/create");
    }, [localizedRouter]);

    return (
        <div className={styles.root}>
            {!disableFilters && (
                <Filters
                    sortField={sortField}
                    order={order}
                    onClearFilters={handleClearFilters}
                    onFiltersChange={setFilters}
                />
            )}
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
                                                      name as CampaignSortOptions,
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
                            ) : campaigns?.length === 0 ? (
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
                    totalPages={Math.ceil(totalCampaigns / PAGE_SIZE)}
                    onNext={handleNextPage}
                    onPrevious={handlePreviousPage}
                    onPage={handlePage}
                />
            </div>
        </div>
    );
}
