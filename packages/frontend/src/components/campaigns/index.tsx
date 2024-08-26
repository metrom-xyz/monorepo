"use client";

import { Typography } from "@/src/ui/typography";
import { useCampaigns } from "@/src/hooks/useCampaigns";
import { Campaign, SkeletonCampaign } from "./campaign";

import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import { usePagination } from "@/src/hooks/usePagination";
import { useState } from "react";
import { useAmms } from "@/src/hooks/useAmms";

const PAGE_SIZE = 10;

// TODO: implement pagination
export function Campaigns() {
    const t = useTranslations("allCampaigns");
    const amms = useAmms();

    const [pageNumber, setPageNumber] = useState(0);

    const { loading, campaigns } = useCampaigns();

    const { data: pagedCampaigns, totalPages } = usePagination({
        data: campaigns,
        page: pageNumber,
        size: PAGE_SIZE,
    });

    return (
        <div className={styles.root}>
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
                        <SkeletonCampaign
                            className={`${styles.row} ${styles.bodyRow}`}
                        />
                        <SkeletonCampaign
                            className={`${styles.row} ${styles.bodyRow}`}
                        />
                        <SkeletonCampaign
                            className={`${styles.row} ${styles.bodyRow}`}
                        />
                        <SkeletonCampaign
                            className={`${styles.row} ${styles.bodyRow}`}
                        />
                        <SkeletonCampaign
                            className={`${styles.row} ${styles.bodyRow}`}
                        />
                        <SkeletonCampaign
                            className={`${styles.row} ${styles.bodyRow}`}
                        />
                        <SkeletonCampaign
                            className={`${styles.row} ${styles.bodyRow}`}
                        />
                        <SkeletonCampaign
                            className={`${styles.row} ${styles.bodyRow}`}
                        />
                        <SkeletonCampaign
                            className={`${styles.row} ${styles.bodyRow}`}
                        />
                        <SkeletonCampaign
                            className={`${styles.row} ${styles.bodyRow}`}
                        />
                    </>
                ) : (
                    pagedCampaigns.map((campaign) => {
                        return (
                            <Campaign
                                key={campaign.id}
                                amms={amms}
                                campaign={campaign}
                                className={`${styles.row} ${styles.bodyRow}`}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
