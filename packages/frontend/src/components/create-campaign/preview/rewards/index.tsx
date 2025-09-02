import type { CampaignPreviewTokenDistributables } from "@/src/types/campaign";
import { Card, TextField, Typography } from "@metrom-xyz/ui";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useTranslations } from "next-intl";
import { useChainId } from "@/src/hooks/useChainId";
import { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import {
    formatPercentage,
    formatAmount,
    formatUsdAmount,
} from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";
import { FEE_UNIT } from "@/src/commons";
import { useProtocolFees } from "@/src/hooks/useProtocolFees";

import styles from "./styles.module.css";

interface RewardsProps {
    rewards: CampaignPreviewTokenDistributables;
    startDate?: Dayjs;
    endDate?: Dayjs;
}

export function Rewards({ rewards, startDate, endDate }: RewardsProps) {
    const t = useTranslations("campaignPreview.rewards");

    const chain: SupportedChain = useChainId();
    const { fee, feeRebate } = useProtocolFees();

    const [resolvedFee, setResolvedFee] = useState<number>();

    const totalRewardsUsdAmount = useMemo(() => {
        if (!rewards) return 0;
        let total = 0;
        for (const reward of rewards.tokens) {
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

    useEffect(() => {
        if (fee !== undefined && feeRebate !== undefined) {
            const resolvedFeeRebate = feeRebate / FEE_UNIT;
            setResolvedFee(fee - fee * resolvedFeeRebate);
        }
    }, [feeRebate, fee]);

    return (
        <div className={styles.root}>
            <Typography uppercase weight="medium">
                {t("title")}
            </Typography>
            <Card className={styles.table}>
                <div className={styles.header}>
                    <Typography uppercase weight="medium" light size="sm">
                        {t("token")}
                    </Typography>
                    <Typography uppercase weight="medium" light size="sm">
                        {t("amount")}
                    </Typography>
                </div>
                {rewards?.tokens.map((reward) => (
                    <div key={reward.token.address} className={styles.row}>
                        <div className={styles.nameContainer}>
                            <RemoteLogo
                                chain={chain}
                                address={reward.token.address}
                            />
                            <Typography weight="medium" size="xl">
                                {reward.token.symbol}
                            </Typography>
                        </div>
                        <Typography weight="medium" light size="lg">
                            {formatUsdAmount({
                                amount: reward.amount.usdValue || 0,
                            })}
                        </Typography>
                        <Typography weight="medium" size="xl">
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
                    value={formatUsdAmount({ amount: dailyRewards })}
                />
                <TextField
                    boxed
                    size="xl"
                    label={t("total")}
                    value={formatUsdAmount({ amount: totalRewardsUsdAmount })}
                />
                {resolvedFee && (
                    <TextField
                        boxed
                        label={t("fee")}
                        value={
                            <div className={styles.feeText}>
                                <Typography weight="medium" size="xl">
                                    {formatPercentage({
                                        percentage:
                                            (resolvedFee / FEE_UNIT) * 100,
                                    })}
                                </Typography>
                                <Typography weight="medium" light>
                                    {formatUsdAmount({
                                        amount:
                                            (totalRewardsUsdAmount *
                                                resolvedFee) /
                                            FEE_UNIT,
                                    })}
                                </Typography>
                            </div>
                        }
                    />
                )}
            </div>
        </div>
    );
}
