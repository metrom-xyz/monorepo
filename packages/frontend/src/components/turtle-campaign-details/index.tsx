"use client";

import { useTurtleDeals } from "@/src/hooks/useTurtleDeals";
import { useAccount } from "wagmi";
import { TextField, Typography } from "@metrom-xyz/ui";
import { TURTLE_CAMPAIGNS } from "@/src/commons/turtle-campaigns";
import { Header } from "./header";
import { formatUsdAmount } from "@/src/utils/format";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Earn } from "./earn";

import styles from "./styles.module.css";

interface TurtleCampaignDetailsProps {
    campaignId: string;
}

export function TurtleCampaignDetails({
    campaignId,
}: TurtleCampaignDetailsProps) {
    const t = useTranslations("turtleCampaignPage");

    const { address } = useAccount();
    const { deals, loading } = useTurtleDeals({ campaignId });

    const totalDealsTvl = useMemo(() => {
        if (!deals) return null;

        return deals.reduce((prev, deal) => prev + deal.data.tvl, 0);
    }, [deals]);

    const campaign = TURTLE_CAMPAIGNS.find(({ id }) => id === campaignId);

    if (!campaign) return null;

    const { name, owner, description, brand, url, ownerLogo } = campaign;

    return (
        <div className={styles.root}>
            <Header
                name={name}
                owner={owner}
                description={description}
                url={url}
                brand={brand}
                icon={ownerLogo}
            />
            <div className={styles.contentWrapper}>
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
                        loading={loading}
                        value={
                            <div className={styles.statusWrapper}>
                                <div className={styles.statusDot}>
                                    <div className={styles.live}></div>
                                </div>
                                <Typography weight="medium" size="xl">
                                    {/* TODO: other states? We don't have date for Turtle campaigns */}
                                    {t("live")}
                                </Typography>
                            </div>
                        }
                    />
                </div>
            </div>

            <div className={styles.dealsWrapper}>
                <Typography size="lg" weight="medium" uppercase>
                    {t("exploreDeals")}
                </Typography>
                <Earn campaignId={campaignId} address={address} />
            </div>
        </div>
    );
}
