"use client";

import { Typography } from "@/src/ui/typography";
import { useCampaigns } from "@/src/hooks/useCampaigns";
import { Campaign, SkeletonCampaign } from "./campaign";

import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import { usePagination } from "@/src/hooks/usePagination";
import { useMemo, useState, type ChangeEvent } from "react";
import { TextInput } from "@/src/ui/text-input";
import { SearchIcon } from "@/src/assets/search-icon";
import { useDebounce } from "react-use";
import { filterCampaigns } from "@/src/utils/filtering";

const PAGE_SIZE = 10;

// TODO: implement pagination
export function Campaigns() {
    const t = useTranslations("allCampaigns");

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [pageNumber, setPageNumber] = useState(1);

    const { loading, campaigns } = useCampaigns();

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        300,
        [search],
    );

    const filteredCampaigns = useMemo(
        () => filterCampaigns(campaigns, debouncedSearch),
        [debouncedSearch, campaigns],
    );

    console.log(filteredCampaigns);

    const { data: pagedCampaigns, totalPages } = usePagination({
        data: filteredCampaigns,
        page: pageNumber,
        size: PAGE_SIZE,
    });

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
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
