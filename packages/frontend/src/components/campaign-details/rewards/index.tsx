import { Card, TextField, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { useMemo } from "react";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { RemoteLogo } from "../../remote-logo";
import type {
    DistributablesCampaign,
    DistributablesType,
} from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface RewardsProps {
    campaign: DistributablesCampaign<DistributablesType.Tokens>;
    loading: boolean;
}

export function Rewards({ campaign, loading }: RewardsProps) {
    const t = useTranslations("campaignDetails.rewards");

    const dailyRewards = useMemo(() => {
        const hoursDuration = dayjs
            .unix(campaign.to)
            .diff(dayjs.unix(campaign.from), "hours", false);
        const daysDuration = hoursDuration / 24;

        return daysDuration >= 1
            ? campaign.distributables.amountUsdValue / daysDuration
            : 0;
    }, [campaign]);

    return (
        <div className={styles.root}>
            <Typography size="lg" weight="medium" uppercase>
                {t("title")}
            </Typography>
            <Card className={styles.table}>
                <div className={styles.header}>
                    <Typography uppercase weight="medium" light size="sm">
                        {t("token")}
                    </Typography>
                    <Typography uppercase weight="medium" light size="sm">
                        {t("inUsd")}
                    </Typography>
                    <Typography uppercase weight="medium" light size="sm">
                        {t("amount")}
                    </Typography>
                </div>
                {campaign.distributables.list.map((reward) => (
                    <div key={reward.token.address} className={styles.row}>
                        <div className={styles.nameContainer}>
                            <RemoteLogo
                                chain={campaign.chainId}
                                address={reward.token.address}
                                defaultText={reward.token.symbol}
                            />
                            <Typography weight="medium" size="lg" truncate>
                                {reward.token.symbol}
                            </Typography>
                        </div>
                        <Typography uppercase weight="medium" light>
                            {reward.amount.usdValue
                                ? formatUsdAmount(reward.amount.usdValue)
                                : "-"}
                        </Typography>
                        <Typography uppercase weight="medium" size="lg">
                            {formatAmount({
                                amount: reward.amount.formatted,
                            })}
                        </Typography>
                    </div>
                ))}
            </Card>
            <div className={styles.summary}>
                <TextField
                    boxed
                    size="xl"
                    label={t("daily")}
                    loading={loading}
                    value={formatUsdAmount(dailyRewards)}
                />
                <TextField
                    boxed
                    size="xl"
                    label={t("total")}
                    loading={loading}
                    value={formatUsdAmount(
                        campaign.distributables.amountUsdValue,
                    )}
                />
            </div>
        </div>
    );
}
