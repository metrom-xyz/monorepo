"use client";

import { TextField } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    CampaignDuration,
    CampaignDurationSkeleton,
} from "../../campaign-duration";
import { useEffect, useState } from "react";

import styles from "./styles.module.css";

interface DetailsProps {
    from: number;
    to: number;
    protocol: string;
}

export function Details({ from, to, protocol }: DetailsProps) {
    const t = useTranslations("lv2PointsCampaignPage.details");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={styles.root}>
            <div className={styles.topContent}>
                <TextField
                    boxed
                    size="xl"
                    uppercase
                    label={t("type")}
                    value={t("points")}
                />
                <TextField
                    boxed
                    size="xl"
                    uppercase
                    label={t("createdBy")}
                    value={protocol}
                />
            </div>
            {mounted ? (
                <CampaignDuration from={from} to={to} />
            ) : (
                <CampaignDurationSkeleton />
            )}
        </div>
    );
}
