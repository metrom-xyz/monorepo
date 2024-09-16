import { XIcon } from "@/src/assets/x-icon";
import {
    NumberInput,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import type { Token, WhitelistedErc20TokenAmount } from "@metrom-xyz/sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWatchBalance } from "@/src/hooks/useWatchBalance";
import { useAccount, useChainId } from "wagmi";
import { formatUnits } from "viem/utils";
import type { Address } from "viem";
import classNames from "classnames";
import { formatUsdAmount } from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface RewardProps {
    reward: WhitelistedErc20TokenAmount;
    campaignDuration?: number;
    onRemove: (reward: Token) => void;
    onError: (address: Address, error?: string) => void;
    onUpdate: (updatedReward: WhitelistedErc20TokenAmount) => void;
}

export function Reward({
    reward,
    campaignDuration,
    onRemove,
    onError,
    onUpdate,
}: RewardProps) {
    const [error, setError] = useState(false);
    const [rewardAmount, setRewardAmount] = useState<number | undefined>(
        reward.amount,
    );
    const { address } = useAccount();
    const chain = useChainId();
    const { balance: rewardTokenBalance } = useWatchBalance(
        address,
        reward.token.address,
    );

    const tokenUsdValue = useMemo(() => {
        if (!reward.usdPrice || !rewardAmount) return null;
        return rewardAmount * reward.usdPrice;
    }, [reward.usdPrice, rewardAmount]);

    useEffect(() => {
        if (!rewardAmount || !campaignDuration || !reward) return;

        const distributionRate = (rewardAmount * 3_600) / campaignDuration;
        const balance =
            rewardTokenBalance !== undefined
                ? Number(formatUnits(rewardTokenBalance, reward.token.decimals))
                : Number.MAX_SAFE_INTEGER;

        const error =
            rewardAmount > balance
                ? "newCampaign.form.rewards.errors.insufficientBalance"
                : distributionRate < reward.minimumRate
                  ? "newCampaign.form.rewards.errors.lowDistributionRate"
                  : "";

        onError(reward.token.address, error);
        setError(!!error);
    }, [campaignDuration, onError, reward, rewardAmount, rewardTokenBalance]);

    const handleRewardOnRemove = useCallback(() => {
        onError(reward.token.address, "");
        onRemove(reward.token);
    }, [onError, onRemove, reward]);

    const handleRewardAmountOnBlur = useCallback(() => {
        onUpdate({ ...reward, amount: rewardAmount || 0 });
    }, [onUpdate, reward, rewardAmount]);

    const handleRewardAmountOnChange = useCallback(
        (rawNewAmount: NumberFormatValues) => {
            setRewardAmount(rawNewAmount.floatValue);
        },
        [],
    );

    return (
        <div
            key={reward.token.address}
            className={classNames(styles.reward, { [styles.error]: error })}
        >
            <div className={styles.rewardPreviewWrapper}>
                <div>
                    <NumberInput
                        placeholder="0"
                        value={rewardAmount ? rewardAmount.toString() : ""}
                        onValueChange={handleRewardAmountOnChange}
                        className={styles.rewardTokenAmountInput}
                        onBlur={handleRewardAmountOnBlur}
                    />
                    <Typography weight="medium" light variant="xs">
                        {tokenUsdValue ? formatUsdAmount(tokenUsdValue) : "-"}
                    </Typography>
                </div>
                <div className={styles.rewardTokenWrapper}>
                    <RemoteLogo
                        size="sm"
                        address={reward.token.address}
                        chain={chain}
                    />
                    <Typography variant="lg" weight="medium">
                        {reward.token.symbol}
                    </Typography>
                    <div
                        className={styles.removeIconWrapper}
                        onClick={handleRewardOnRemove}
                    >
                        <XIcon className={styles.removeIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function RewardSkeleton() {
    const t = useTranslations();
    return (
        <div className={styles.rewardSkeleton}>
            <Typography
                className={styles.rewardSkeletonText}
                weight="medium"
                variant="xs"
                uppercase
            >
                {t("newCampaign.form.rewards.rewardsPreviewList.empty")}
            </Typography>
        </div>
    );
}
