import { XIcon } from "@/src/assets/x-icon";
import {
    NumberInput,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import type {
    Erc20Token,
    UsdPricedOnChainAmount,
    WhitelistedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { useCallback, useEffect, useState } from "react";
import { useWatchBalance } from "@/src/hooks/useWatchBalance";
import { useAccount, useChainId } from "wagmi";
import { parseUnits } from "viem/utils";
import type { Address } from "viem";
import classNames from "classnames";
import { formatUsdAmount } from "@/src/utils/format";
import { RemoteLogo } from "@/src/components/remote-logo";
import { MAX_U256 } from "@/src/commons";

import styles from "./styles.module.css";

interface RewardProps {
    reward: WhitelistedErc20TokenAmount;
    campaignDuration?: number;
    onRemove: (reward: Erc20Token) => void;
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
    const [rewardRawValue, setRewardRawValue] = useState<NumberFormatValues>({
        floatValue: reward.amount.formatted,
        formattedValue: reward.amount.formatted.toString(),
        value: reward.amount.formatted.toString(),
    });
    const [rewardAmount, setRewardAmount] = useState<
        UsdPricedOnChainAmount | undefined
    >(reward.amount);
    const { address } = useAccount();
    const chain = useChainId();
    const { balance: rewardTokenBalance } = useWatchBalance(
        address,
        reward.token.address,
    );

    useEffect(() => {
        if (!campaignDuration || !reward) return;

        if (!rewardAmount) {
            onError(
                reward.token.address,
                "newCampaign.form.rewards.errors.lowDistributionRate",
            );
            setError(true);
            return;
        }

        const distributionRate =
            (rewardAmount.formatted * 3_600) / campaignDuration;
        const balance = rewardTokenBalance || MAX_U256;

        const error =
            rewardAmount.raw > balance
                ? "newCampaign.form.rewards.errors.insufficientBalance"
                : distributionRate < reward.token.minimumRate.formatted
                  ? "newCampaign.form.rewards.errors.lowDistributionRate"
                  : "";

        onError(reward.token.address, error);
        setError(!!error);
    }, [campaignDuration, onError, reward, rewardAmount, rewardTokenBalance]);

    useEffect(() => {
        if (!rewardRawValue) return;

        const formattedNewAmount = rewardRawValue.floatValue;
        if (!formattedNewAmount) setRewardAmount(undefined);
        else {
            const rawNewAmount = parseUnits(
                formattedNewAmount.toString(),
                reward.token.decimals,
            );

            setRewardAmount({
                raw: rawNewAmount,
                formatted: formattedNewAmount,
                usdValue: formattedNewAmount * reward.token.usdPrice,
            });
        }
    }, [reward.token.decimals, reward.token.usdPrice, rewardRawValue]);

    const handleRewardOnRemove = useCallback(() => {
        onError(reward.token.address, "");
        onRemove(reward.token);
    }, [onError, onRemove, reward]);

    const handleRewardAmountOnBlur = useCallback(() => {
        onUpdate({
            ...reward,
            amount: rewardAmount || {
                raw: 0n,
                formatted: 0,
                usdValue: null,
            },
        });
    }, [onUpdate, reward, rewardAmount]);

    return (
        <div
            key={reward.token.address}
            className={classNames(styles.reward, { [styles.error]: error })}
        >
            <div className={styles.rewardPreviewWrapper}>
                <div>
                    <NumberInput
                        placeholder="0"
                        value={rewardRawValue?.formattedValue}
                        onValueChange={setRewardRawValue}
                        allowNegative={false}
                        className={styles.rewardTokenAmountInput}
                        onBlur={handleRewardAmountOnBlur}
                    />
                    <Typography weight="medium" light variant="xs">
                        {reward.amount.usdValue
                            ? formatUsdAmount(reward.amount.usdValue)
                            : "-"}
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
