import type { CampaignPayload } from "@/src/types";
import { TextField, Typography } from "@metrom-xyz/ui";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useTranslations } from "next-intl";
import { useChainId, useReadContract } from "wagmi";
import { Dayjs } from "dayjs";
import { useMemo } from "react";
import {
    formatPercentage,
    formatTokenAmount,
    formatUsdAmount,
} from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";
import { useChainData } from "@/src/hooks/useChainData";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { FEE_UNIT } from "@/src/commons";

import styles from "./styles.module.css";

interface RewardsProps {
    rewards: CampaignPayload["rewards"];
    startDate?: Dayjs;
    endDate?: Dayjs;
}

export function Rewards({ rewards, startDate, endDate }: RewardsProps) {
    const t = useTranslations("campaignPreview.rewards");
    const chain: SupportedChain = useChainId();
    const chainData = useChainData(chain);

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
        if (!endDate || !startDate || !totalRewardsUsdAmount) return 0;

        const hoursDuration = endDate.diff(startDate, "hours", false);
        const daysDuration = hoursDuration / 24;

        return daysDuration >= 1 ? totalRewardsUsdAmount / daysDuration : 0;
    }, [startDate, endDate, totalRewardsUsdAmount]);

    const { data: fee } = useReadContract({
        address: chainData?.metromContract.address,
        abi: metromAbi,
        functionName: "fee",
    });

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
                        <Typography weight="medium" variant="xl">
                            {reward.token.symbol}
                        </Typography>
                    </div>
                    <Typography weight="medium" light variant="lg">
                        {formatUsdAmount(reward.amount.usdValue || 0)}
                    </Typography>
                    <Typography weight="medium" variant="xl">
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
                    variant="xl"
                    label={t("daily")}
                    value={formatUsdAmount(dailyRewards)}
                    className={styles.summaryBox}
                />
                <TextField
                    boxed
                    variant="xl"
                    label={t("total")}
                    value={formatUsdAmount(totalRewardsUsdAmount)}
                    className={styles.summaryBox}
                />
                {fee && (
                    <TextField
                        boxed
                        label={t("fee")}
                        value={
                            <div className={styles.feeText}>
                                <Typography weight="medium" variant="xl">
                                    {formatPercentage((fee / FEE_UNIT) * 100)}
                                </Typography>
                                <Typography weight="medium" light>
                                    {formatUsdAmount(
                                        (totalRewardsUsdAmount * fee) /
                                            FEE_UNIT,
                                    )}
                                </Typography>
                            </div>
                        }
                        className={styles.summaryBox}
                    />
                )}
            </div>
        </div>
    );
}
