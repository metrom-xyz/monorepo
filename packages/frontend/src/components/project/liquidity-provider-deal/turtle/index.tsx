"use client";

import { TextField, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useTurtleDeals } from "@/src/hooks/useTurtleDeals";
import { useMemo } from "react";
import { formatUsdAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface TurtleProps {
    campaignId?: string;
}

export function Turtle({ campaignId }: TurtleProps) {
    const t = useTranslations("liquidityProviderDeals");
    const { deals, loading } = useTurtleDeals({ campaignId, enabled: false });

    const totalDealsTvl = useMemo(() => {
        if (!deals) return null;

        return deals.reduce((prev, deal) => prev + deal.data.tvl, 0);
    }, [deals]);

    return (
        <div className={styles.root}>
            <div className={styles.details}>
                <TextField
                    boxed
                    size="xl"
                    label={t("tvl")}
                    loading={loading}
                    value={formatUsdAmount({
                        amount: totalDealsTvl,
                        cutoff: false,
                    })}
                />
                <TextField
                    boxed
                    size="xl"
                    label={t("status")}
                    value={
                        <div className={styles.statusWrapper}>
                            <div className={styles.statusDot}>
                                <div className={styles.live}></div>
                            </div>
                            <Typography weight="medium" size="xl">
                                {t("live")}
                            </Typography>
                        </div>
                    }
                />
            </div>
            {/* TODO: enable once Turtle widget supports campaign filtering */}
            {/* <div className={styles.widgetWrapper}>
                <Typography size="lg" weight="medium" uppercase>
                    {t("exploreDeals")}
                </Typography>
                <Earn />
            </div> */}
        </div>
    );
}
