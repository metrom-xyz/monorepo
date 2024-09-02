import { RemoteLogo } from "@/src/ui/remote-logo";
import { TextField } from "@/src/ui/text-field";
import { Typography } from "@/src/ui/typography";
import { useTranslations } from "next-intl";
import numeral from "numeral";
import dayjs from "dayjs";
import { useMemo } from "react";
import type { NamedCampaign } from "@/src/hooks/useCampaign";
import { Skeleton } from "@/src/ui/skeleton";

import styles from "./styles.module.css";

interface RewardsProps {
    campaign?: NamedCampaign;
    loading: boolean;
}

export function Rewards({ campaign, loading }: RewardsProps) {
    const t = useTranslations("campaignDetails.rewards");

    const dailyRewards = useMemo(() => {
        if (!campaign) return 0;

        const daysDuration = dayjs
            .unix(campaign.to)
            .diff(dayjs.unix(campaign.from), "days", false);

        return daysDuration > 0 && !!campaign.rewards.usdValue
            ? campaign.rewards.usdValue / daysDuration
            : 0;
    }, [campaign]);

    return (
        <div className={styles.root}>
            <Typography variant="lg" weight="medium" uppercase>
                {t("title")}
            </Typography>
            <div className={styles.table}>
                <div className={styles.header}>
                    <Typography uppercase weight="medium" light variant="sm">
                        {t("token")}
                    </Typography>
                    <Typography uppercase weight="medium" light variant="sm">
                        {t("inUsd")}
                    </Typography>
                    <Typography uppercase weight="medium" light variant="sm">
                        {t("amount")}
                    </Typography>
                </div>
                {!campaign ? (
                    <SkeletonReward />
                ) : (
                    campaign.rewards.map((reward) => (
                        <div key={reward.address} className={styles.row}>
                            <div className={styles.nameContainer}>
                                <RemoteLogo
                                    chain={campaign.chainId}
                                    address={reward.address}
                                    defaultText={reward.symbol}
                                />
                                <Typography
                                    uppercase
                                    weight="medium"
                                    variant="lg"
                                >
                                    {reward.symbol}
                                </Typography>
                            </div>
                            <Typography uppercase weight="medium" light>
                                {numeral(
                                    reward.usdPrice
                                        ? reward.amount * reward.usdPrice
                                        : 0,
                                ).format("($ 0.00[0] a)")}
                            </Typography>
                            <Typography uppercase weight="medium" variant="lg">
                                {numeral(reward.remaining).format(
                                    "(0.00[00] a)",
                                )}
                            </Typography>
                        </div>
                    ))
                )}
                <div className={styles.summary}>
                    <TextField
                        boxed
                        variant="xl"
                        label={t("daily")}
                        loading={loading || !campaign}
                        value={numeral(dailyRewards).format("($ 0.00[0] a)")}
                        className={styles.summaryBox}
                    />
                    <TextField
                        boxed
                        variant="xl"
                        label={t("total")}
                        loading={loading || !campaign}
                        value={numeral(campaign?.rewards.usdValue).format(
                            "($ 0.00[0] a)",
                        )}
                        className={styles.summaryBox}
                    />
                </div>
            </div>
        </div>
    );
}

function SkeletonReward() {
    return (
        <div className={styles.row}>
            <div className={styles.nameContainer}>
                <RemoteLogo loading />
                <Skeleton variant="lg" width={80} />
            </div>
            <Skeleton width={80} />
            <Skeleton variant="lg" width={80} />
        </div>
    );
}
