import { useTranslations } from "next-intl";
import classNames from "classnames";
import {
    BackendCampaignType,
    DistributablesType,
    Status,
} from "@metrom-xyz/sdk";
import { Pagination, Typography } from "@metrom-xyz/ui";
import type { TranslationsKeys } from "@/src/types/utils";
import { Item, SkeletonItem } from "./item";
import { useState } from "react";
import { useAggregatedCampaignItems } from "@/src/hooks/useAggregatedCampaignItems";
import type { AggregatedCampaign } from "@/src/types/campaign";

import styles from "./styles.module.css";

interface ItemsTableProps {
    loadingAggregatedCampaign?: boolean;
    aggregatedCampaign?: AggregatedCampaign;
}

const COLUMNS: TranslationsKeys<"campaignDetails.itemsTable">[] = [
    "tableHeader.id",
    "tableHeader.status",
    "tableHeader.apr",
    "tableHeader.dailyRewards",
];

const PAGE_SIZE = 5;

export function ItemsTable({
    loadingAggregatedCampaign,
    aggregatedCampaign,
}: ItemsTableProps) {
    const [pageNumber, setPageNumber] = useState(1);

    const t = useTranslations("campaignDetails.itemsTable");

    const {
        loading: loadingItems,
        fetching,
        placeholderData,
        items,
        totalCampaigns,
    } = useAggregatedCampaignItems({
        page: pageNumber,
        pageSize: PAGE_SIZE,
        aggregatedCampaign,
    });

    function handlePreviousPage() {
        setPageNumber((page) => page - 1);
    }

    function handleNextPage() {
        setPageNumber((page) => page + 1);
    }

    function handlePage(page: number) {
        setPageNumber(page);
    }

    const aggregatedCampaignExpired =
        aggregatedCampaign?.status === Status.Expired;
    const loading = loadingAggregatedCampaign || loadingItems;
    const type = !aggregatedCampaign
        ? BackendCampaignType.Rewards
        : aggregatedCampaign?.isDistributing(DistributablesType.Tokens)
          ? BackendCampaignType.Rewards
          : BackendCampaignType.Points;

    // TODO: table for points campaigns?
    return (
        <div
            className={classNames(styles.root, {
                [styles.expired]: aggregatedCampaignExpired,
            })}
        >
            <div className={styles.tableWrapper}>
                <div
                    className={classNames(styles.table, {
                        [styles[type]]: true,
                    })}
                >
                    <div className={styles.header}>
                        {COLUMNS.map((label, index) => (
                            <div key={index} className={styles.column}>
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    variant="tertiary"
                                    uppercase
                                >
                                    {t(label)}
                                </Typography>
                            </div>
                        ))}
                    </div>
                    <div className={styles.body}>
                        {loading ? (
                            Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                <SkeletonItem key={i} />
                            ))
                        ) : !items || items.length === 0 ? (
                            <div className={styles.empty}>
                                <Typography size="sm" weight="medium" uppercase>
                                    {t("noActiveCampaigns")}
                                </Typography>
                            </div>
                        ) : (
                            items.map((item) => {
                                return (
                                    <Item
                                        key={`${item.chainType}-${item.chainId}-${item.id}`}
                                        item={item}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
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
