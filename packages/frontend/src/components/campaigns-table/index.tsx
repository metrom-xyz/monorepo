import { Button, Pagination, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useCallback, useMemo, useState } from "react";
import { type CampaignSortOptions } from "@/src/utils/filtering";
import type { TranslationsKeys } from "@/src/types/utils";
import { useTranslations } from "next-intl";
import { useRouter as useLocalizedRouter } from "@/i18n/routing";
import { CampaignRow, SkeletonCampaign } from "../campaigns/campaign";
import { CHAIN_ALL, Filters } from "./filters";
import { FilterableStatus } from "@/src/types/common";
import { useCampaigns } from "@/src/hooks/useCampaigns";
import { APTOS } from "@/src/commons/env";
import { BackendCampaignType, ChainType } from "@metrom-xyz/sdk";
import { LoadingBar } from "../loading-bar";

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
        name: "rewards",
        label: "rewards",
        sort: false,
    },
];

interface CampaignsTableProps {
    disableFilters?: boolean;
    optionalFilters?: Partial<Filters>;
}

export function CampaignsTable({
    disableFilters,
    optionalFilters,
}: CampaignsTableProps) {
    const t = useTranslations("allCampaigns");
    const localizedRouter = useLocalizedRouter();

    const [sortField, setSortField] = useState<CampaignSortOptions>();
    const [order, setOrder] = useState<number | undefined>();
    const [pageNumber, setPageNumber] = useState(1);
    const [filters, setFilters] = useState<Filters>({
        chainId: CHAIN_ALL,
        protocol: "",
        status: FilterableStatus.All,
        ...optionalFilters,
    });

    // TODO: remove this once we have the new multi filters
    const { chainTypes, chainIds, protocols, statuses } = useMemo(() => {
        return {
            chainIds:
                filters.chainId === CHAIN_ALL
                    ? undefined
                    : [Number(filters.chainId)],
            protocols: !filters.protocol ? undefined : [filters.protocol],
            statuses:
                filters.status !== FilterableStatus.All
                    ? [filters.status]
                    : undefined,
            chainTypes: APTOS
                ? [ChainType.Aptos]
                : filters.chainType
                  ? [filters.chainType]
                  : undefined,
        };
    }, [filters]);

    const { loading, fetching, placeholderData, campaigns, totalCampaigns } =
        useCampaigns({
            page: pageNumber,
            pageSize: PAGE_SIZE,
            type: BackendCampaignType.Rewards,
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
            chainId: CHAIN_ALL,
            protocol: "",
            status: FilterableStatus.All,
        });
        setPageNumber(1);
        setSortField(undefined);
        setOrder(undefined);
    }

    function handleFiltersOnChange(filters: Partial<Filters>) {
        setPageNumber(1);
        setFilters((prev) => ({ ...prev, ...filters }));
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
                    onFiltersChange={handleFiltersOnChange}
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
                            <LoadingBar
                                loading={placeholderData && fetching}
                                className={styles.loadingBar}
                            />
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
