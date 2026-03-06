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
import { useCampaignItems } from "@/src/hooks/useCampaignItems";
import type { CampaignDetails } from "@/src/types/campaign/common";

import styles from "./styles.module.css";

interface ItemsTableProps {
    loadingCampaignDetails?: boolean;
    campaignDetails?: CampaignDetails;
}

const COLUMNS: TranslationsKeys<"campaignDetails.itemsTable">[] = [
    "tableHeader.id",
    "tableHeader.status",
    "tableHeader.apr",
    "tableHeader.dailyRewards",
];

const PAGE_SIZE = 5;

export function ItemsTable({
    loadingCampaignDetails,
    campaignDetails,
}: ItemsTableProps) {
    const [pageNumber, setPageNumber] = useState(1);

    const t = useTranslations("campaignDetails.itemsTable");

    const {
        loading: loadingItems,
        fetching,
        placeholderData,
        campaignItems,
        totalCampaignItems,
    } = useCampaignItems({
        page: pageNumber,
        pageSize: PAGE_SIZE,
        campaignDetails,
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

    const expired = campaignDetails?.status === Status.Expired;
    const loading = loadingCampaignDetails || loadingItems;
    const type = !campaignDetails
        ? BackendCampaignType.Rewards
        : campaignDetails?.isDistributing(DistributablesType.Tokens)
          ? BackendCampaignType.Rewards
          : BackendCampaignType.Points;

    return (
        <div
            className={classNames(styles.root, {
                [styles.expired]: expired,
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
                        ) : !campaignItems || campaignItems.length === 0 ? (
                            <div className={styles.empty}>
                                <Typography size="sm" weight="medium" uppercase>
                                    {t("noActiveCampaigns")}
                                </Typography>
                            </div>
                        ) : (
                            campaignItems.map((campaignItem) => {
                                const { chainType, chainId, id } = campaignItem;

                                return (
                                    <Item
                                        key={`${chainType}-${chainId}-${id}`}
                                        campaignItem={campaignItem}
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
                    totalPages={Math.ceil(totalCampaignItems / PAGE_SIZE)}
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
