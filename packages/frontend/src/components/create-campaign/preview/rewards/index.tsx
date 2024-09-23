import type { CampaignPayload } from "@/src/types";
import { TextField, Typography } from "@metrom-xyz/ui";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useTranslations } from "next-intl";
import { useChainId } from "wagmi";
import dayjs from "dayjs";
import { useMemo } from "react";
import { formatTokenAmount, formatUsdAmount } from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";

import styles from "./styles.module.css";

interface RewardsProps {
    rewards: CampaignPayload["rewards"];
    campaignDurationSeconds: number;
}

export function Rewards({ rewards, campaignDurationSeconds }: RewardsProps) {
    const t = useTranslations("campaignPreview.rewards");
    const chain: SupportedChain = useChainId();

    const totalRewardsUsdAmount = useMemo(() => {
        if (!rewards) return 0;
        let total = 0;
        for (const reward of rewards) {
            if (!reward.amount.usdValue) return 0;
            total += reward.amount.usdValue;
        }
        return total;
    }, [rewards]);

    const dailyRewards = useMemo(() => {
        if (!totalRewardsUsdAmount) return 0;

        const daysDuration = dayjs
            .duration(campaignDurationSeconds, "seconds")
            .get("days");

        return daysDuration > 0 ? totalRewardsUsdAmount / daysDuration : 0;
    }, [campaignDurationSeconds, totalRewardsUsdAmount]);

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Typography uppercase weight="medium" light variant="sm">
                    {t("token")}
                </Typography>
                <Typography uppercase weight="medium" light variant="sm">
                    {t("amount")}
                </Typography>
            </div>
            {rewards?.map((reward) => (
                <div key={reward.token.address} className={styles.row}>
                    <div className={styles.nameContainer}>
                        <RemoteLogo
                            chain={chain}
                            address={reward.token.address}
                        />
                        <Typography uppercase weight="medium" variant="lg">
                            {reward.token.symbol}
                        </Typography>
                    </div>
                    <Typography uppercase weight="medium" light>
                        {formatUsdAmount(reward.amount.usdValue || 0)}
                    </Typography>
                    <Typography uppercase weight="medium" variant="lg">
                        {formatTokenAmount({
                            amount: reward.amount.formatted,
                            humanize: false,
                        })}
                    </Typography>
                </div>
            ))}
            <div className={styles.summary}>
                <TextField
                    boxed
                    label={t("daily")}
                    value={formatUsdAmount(dailyRewards)}
                    className={styles.summaryBox}
                />
                <TextField
                    boxed
                    label={t("total")}
                    value={formatUsdAmount(totalRewardsUsdAmount)}
                    className={styles.summaryBox}
                />
            </div>
        </div>
    );
}
