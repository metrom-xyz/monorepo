import type { CampaignPayload } from "@/src/types";
import { RemoteLogo } from "@/src/ui/remote-logo";
import { TextField } from "@/src/ui/text-field";
import { Typography } from "@/src/ui/typography";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useTranslations } from "next-intl";
import numeral from "numeral";
import { useChainId } from "wagmi";
import { useMemo } from "react";

import styles from "./styles.module.css";

interface RewardsProps {
    rewards: CampaignPayload["rewards"];
    campaignDurationDays: number;
}

export function Rewards({ rewards, campaignDurationDays }: RewardsProps) {
    const t = useTranslations("campaignPreview.rewards");
    const chain: SupportedChain = useChainId();

    const totalRewardsUsdAmount = useMemo(() => {
        if (!rewards) return 0;
        return rewards.reduce((accumulator, reward) => {
            return (accumulator += reward.amount * reward.price);
        }, 0);
    }, [rewards]);

    const dailyRewards = useMemo(() => {
        if (!totalRewardsUsdAmount) return 0;
        if (campaignDurationDays === 0) return totalRewardsUsdAmount;
        return totalRewardsUsdAmount / campaignDurationDays;
    }, [campaignDurationDays, totalRewardsUsdAmount]);

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
                        {numeral(reward.amount * reward.price).format(
                            "($ 0.00[0] a)",
                        )}
                    </Typography>
                    <Typography uppercase weight="medium" variant="lg">
                        {numeral(reward.amount).format("(0.00[00] a)")}
                    </Typography>
                </div>
            ))}
            <div className={styles.summary}>
                <TextField
                    boxed
                    label={t("daily")}
                    value={numeral(dailyRewards).format("($ 0.00[0] a)")}
                    className={styles.summaryBox}
                />
                <TextField
                    boxed
                    label={t("total")}
                    value={numeral(totalRewardsUsdAmount).format(
                        "($ 0.00[0] a)",
                    )}
                    className={styles.summaryBox}
                />
            </div>
        </div>
    );
}
