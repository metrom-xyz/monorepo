import { TextField, Typography, Skeleton } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { useMemo } from "react";
import type { NamedCampaign } from "@/src/hooks/useCampaign";
import { formatTokenAmount, formatUsdAmount } from "@/src/utils/format";
import { RemoteLogo } from "../../remote-logo";

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

        return daysDuration > 0 && !!campaign.rewards.amountUsdValue
            ? campaign.rewards.amountUsdValue / daysDuration
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
                        <div key={reward.token.address} className={styles.row}>
                            <div className={styles.nameContainer}>
                                <RemoteLogo
                                    chain={campaign.chainId}
                                    address={reward.token.address}
                                    defaultText={reward.token.symbol}
                                />
                                <Typography
                                    uppercase
                                    weight="medium"
                                    variant="lg"
                                >
                                    {reward.token.symbol}
                                </Typography>
                            </div>
                            <Typography uppercase weight="medium" light>
                                {reward.amount.usdValue
                                    ? formatUsdAmount(reward.amount.usdValue)
                                    : "-"}
                            </Typography>
                            <Typography uppercase weight="medium" variant="lg">
                                {formatTokenAmount({
                                    amount: reward.amount.formatted,
                                })}
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
                        value={formatUsdAmount(dailyRewards)}
                        className={styles.summaryBox}
                    />
                    <TextField
                        boxed
                        variant="xl"
                        label={t("total")}
                        loading={loading || !campaign}
                        value={formatUsdAmount(
                            campaign?.rewards.amountUsdValue,
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
